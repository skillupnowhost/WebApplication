"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AnimatedPlus } from "@/components/ui/icons/AnimatedPlus";
import { AnimatedEdit } from "@/components/ui/icons/AnimatedEdit";
import { AnimatedTrash } from "@/components/ui/icons/AnimatedTrash";
import { AnimatedClose } from "@/components/ui/icons/AnimatedClose";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { AnimatedImage } from "@/components/ui/icons/AnimatedImage";
import { ToggleChipGroup } from "@/components/ui/ToggleChipGroup";
import { useLiveData } from "@/components/admin/useLiveData";
import { CategoryPicker } from "@/components/admin/CategoryPicker";
import { DataTable, LiveIndicator, type Column, type Row } from "@/components/admin/DataTable";
import { Modal, ConfirmDialog, useToast, type ConfirmState } from "@/components/ui/Modal";
import { ImageCropModal } from "@/components/admin/ImageCropModal";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox" | "date" | "datetime-local" | "category" | "checkboxGroup" | "rating" | "image";
  options?: { label: string; value: string }[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  /** Span both columns of the form grid. */
  full?: boolean;
  min?: number;
  max?: number;
  step?: string;
  /** Row key whose existing values are offered as autocomplete suggestions (new values stay allowed). */
  suggestionsFrom?: string;
  /** For "select" fields: an API endpoint returning `{ options: {label,value}[] }`, fetched once when the form opens. */
  optionsEndpoint?: string;
  /** For "image" fields: crop frame width/height ratio. Defaults to 1 (circular guide). */
  imageAspect?: number;
};

export type EntityConfig = {
  entity: string;
  titleSingular: string;
  titlePlural: string;
  description: string;
  columns: Column[];
  /** Present ⇒ the "Add" button is shown. */
  createFields?: FieldDef[];
  /** Present ⇒ each row gets an edit action. */
  editFields?: FieldDef[];
  createDefaults?: Record<string, unknown>;
  /** Row key used to name the record inside confirmation popups. */
  nameKey: string;
  canDelete?: boolean;
  /** Select-type fields offered in the bulk-edit modal for multi-selected rows. */
  bulkFields?: FieldDef[];
  /** API path prefix — defaults to "/api/admin"; lets non-admin screens (e.g. mentor dashboard) reuse this component. */
  basePath?: string;
};

type FormValues = Record<string, unknown>;

function initialValues(fields: FieldDef[], source?: Row, defaults?: Record<string, unknown>): FormValues {
  const values: FormValues = {};
  for (const f of fields) {
    const raw = source?.[f.name] ?? defaults?.[f.name];
    if (f.type === "checkbox") values[f.name] = Boolean(raw);
    else if (f.type === "date" && typeof raw === "string") values[f.name] = raw.slice(0, 10);
    else if (f.type === "datetime-local" && typeof raw === "string") {
      // Render the local-time wall clock the <input type="datetime-local"> control expects,
      // not the UTC digits from the stored ISO string (those would be off by the tz offset).
      const d = new Date(raw);
      values[f.name] = new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
    } else values[f.name] = raw ?? "";
  }
  return values;
}

/** Text input with live suggestions from existing records — pick one or type a new value. */
function SuggestField({
  field,
  value,
  onChange,
  suggestions,
  autoFocus,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  suggestions: string[];
  autoFocus?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = String(value ?? "").trim().toLowerCase();
    const list = q
      ? suggestions.filter((s) => s.toLowerCase().includes(q) && s.toLowerCase() !== q)
      : suggestions;
    return list.slice(0, 8);
  }, [suggestions, value]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function pick(s: string) {
    onChange(s);
    setOpen(false);
    setHighlight(-1);
  }

  const showList = open && matches.length > 0;

  return (
    <div ref={wrapRef} className="relative">
      <Input
        label={field.label}
        type="text"
        required={field.required}
        placeholder={field.placeholder}
        hint={field.hint}
        autoFocus={autoFocus}
        autoComplete="off"
        value={String(value ?? "")}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && showList) {
            e.stopPropagation();
            setOpen(false);
            return;
          }
          if (!showList) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => (h + 1) % matches.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => (h <= 0 ? matches.length - 1 : h - 1));
          } else if (e.key === "Enter" && highlight >= 0) {
            e.preventDefault();
            pick(matches[highlight]);
          }
        }}
      />
      <AnimatePresence>
        {showList && (
          <motion.ul
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-48 overflow-y-auto rounded-2xl border border-border-soft bg-surface p-1.5 shadow-[var(--shadow-lift)]"
          >
            {matches.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => pick(s)}
                  onMouseEnter={() => setHighlight(i)}
                  className={`flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    i === highlight ? "bg-brand-50 text-brand-700 dark:bg-brand-900/25 dark:text-brand-200" : "hover:bg-surface-2"
                  }`}
                >
                  {s}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Opens the crop/rotate editor, then uploads the edited result to /api/admin/upload and stores the returned URL. */
function ImageField({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ file: File; url: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const url = String(value ?? "");

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setPending({ file, url: URL.createObjectURL(file) });
  }

  function closePending() {
    if (pending) URL.revokeObjectURL(pending.url);
    setPending(null);
  }

  async function handleCropped(blob: Blob) {
    const editedFile = new File([blob], `${pending?.file.name.replace(/\.[^.]+$/, "") || "photo"}.png`, {
      type: "image/png",
    });
    closePending();
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", editedFile);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
        return;
      }
      onChange(json.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-medium">{field.label}</span>
      <div className="flex items-center gap-4 rounded-xl border border-border-soft bg-surface p-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-2">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded, arbitrary-size asset
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <AnimatedImage className="h-8 w-8 opacity-50" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading…" : url ? "Replace" : "Upload"}
            </Button>
            {url && (
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")} disabled={uploading}>
                Remove
              </Button>
            )}
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          {field.hint && !error && <p className="text-xs text-muted">{field.hint}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handlePick}
        />
      </div>
      {pending && (
        <ImageCropModal
          file={pending.file}
          imageUrl={pending.url}
          aspect={field.imageAspect}
          onCancel={closePending}
          onConfirm={handleCropped}
        />
      )}
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  suggestions,
  dynamicOptions,
  autoFocus,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  suggestions?: string[];
  dynamicOptions?: { label: string; value: string }[];
  autoFocus?: boolean;
}) {
  if (field.type === "image") {
    return <ImageField field={field} value={value} onChange={onChange} />;
  }
  if (field.type === "rating") {
    const current = Number(value ?? 0);
    return (
      <div>
        <span className="mb-2 block text-sm font-medium">{field.label}</span>
        <div className="flex items-center gap-1.5 rounded-xl border border-border-soft bg-surface px-4 py-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              className="cursor-pointer transition-transform duration-150 hover:scale-125 active:scale-90"
            >
              <AnimatedStar className={`h-6 w-6 ${n <= Math.round(current) ? "opacity-100" : "opacity-25"}`} />
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold tabular-nums text-muted">{current.toFixed(1)}</span>
        </div>
        {field.hint && <p className="mt-1.5 text-xs text-muted">{field.hint}</p>}
      </div>
    );
  }
  if (field.type === "checkboxGroup") {
    return (
      <ToggleChipGroup
        label={field.label}
        options={field.options ?? []}
        value={String(value ?? "")}
        onChange={onChange}
        hint={field.hint}
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <Textarea
        label={field.label}
        rows={3}
        required={field.required}
        placeholder={field.placeholder}
        hint={field.hint}
        autoFocus={autoFocus}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "text" && suggestions?.length) {
    return (
      <SuggestField field={field} value={value} onChange={onChange} suggestions={suggestions} autoFocus={autoFocus} />
    );
  }
  if (field.type === "category") {
    return (
      <CategoryPicker
        label={field.label}
        value={String(value ?? "")}
        onChange={onChange}
        hint={field.hint}
      />
    );
  }
  if (field.type === "select") {
    return (
      <Select
        label={field.label}
        options={field.options ?? dynamicOptions ?? []}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border-soft bg-surface px-4 py-3">
        <span className="text-sm font-medium">{field.label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-300 ${
            value ? "brand-gradient-bg" : "bg-surface-2 border border-border-soft"
          }`}
        >
          <span
            className={`absolute top-1/2 h-4.5 w-4.5 -translate-y-1/2 rounded-full bg-white shadow transition-all duration-300 ${
              value ? "left-[calc(100%-1.375rem)]" : "left-1"
            }`}
          />
        </button>
      </label>
    );
  }
  return (
    <Input
      label={field.label}
      type={field.type}
      required={field.required}
      placeholder={field.placeholder}
      hint={field.hint}
      min={field.min}
      max={field.max}
      step={field.step}
      autoFocus={autoFocus}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function EntityManager({ config }: { config: EntityConfig }) {
  const { entity, titleSingular, titlePlural, description, columns, createFields, editFields, createDefaults, nameKey, bulkFields } = config;
  const canDelete = config.canDelete !== false;
  const basePath = config.basePath ?? "/api/admin";

  const { data, error, loading, updatedAt, refresh } = useLiveData<{ rows: Row[] }>(`${basePath}/${entity}`);
  const rows = useMemo(() => data?.rows ?? [], [data]);
  const toast = useToast();
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, { label: string; value: string }[]>>({});

  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkValues, setBulkValues] = useState<FormValues>({});

  // Snapshot of the form when it opened — used to detect unsaved edits on close.
  const openedSnapshot = useRef("");

  // Distinct existing values per field that opts into suggestions (e.g. mentor subjects).
  const suggestionsByField = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const f of [...(createFields ?? []), ...(editFields ?? [])]) {
      if (!f.suggestionsFrom || map[f.name]) continue;
      const seen = new Set<string>();
      for (const r of rows) {
        const v = String(r[f.suggestionsFrom] ?? "").trim();
        if (v) seen.add(v);
      }
      map[f.name] = [...seen].sort((a, b) => a.localeCompare(b));
    }
    return map;
  }, [rows, createFields, editFields]);

  // Drop selections that no longer exist after a live refresh.
  useEffect(() => {
    setSelectedIds((prev) => {
      const existing = new Set(rows.map((r) => r.id));
      const next = new Set([...prev].filter((id) => existing.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [rows]);

  const activeFields = formMode === "create" ? createFields ?? [] : editFields ?? [];

  // Fetch each field's optionsEndpoint once per form-open — mirrors suggestionsFrom, but for
  // select dropdowns backed by a live list from another entity (e.g. linkable user accounts).
  useEffect(() => {
    if (formMode === null) return;
    for (const f of activeFields) {
      if (!f.optionsEndpoint || dynamicOptions[f.name]) continue;
      fetch(f.optionsEndpoint)
        .then((res) => res.json())
        .then((json) => setDynamicOptions((prev) => ({ ...prev, [f.name]: json.options ?? [] })))
        .catch(() => setDynamicOptions((prev) => ({ ...prev, [f.name]: [] })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMode]);

  function openCreate() {
    const v = initialValues(createFields ?? [], undefined, createDefaults);
    openedSnapshot.current = JSON.stringify(v);
    setValues(v);
    setFormError(null);
    setFormMode("create");
  }

  function openEdit(row: Row) {
    const v = initialValues(editFields ?? [], row);
    openedSnapshot.current = JSON.stringify(v);
    setEditingRow(row);
    setValues(v);
    setFormError(null);
    setFormMode("edit");
  }

  function closeForm() {
    setFormMode(null);
    setEditingRow(null);
  }

  /** Esc / Cancel / backdrop — ask before throwing away unsaved edits. */
  function requestCloseForm() {
    if (JSON.stringify(values) === openedSnapshot.current) {
      closeForm();
      return;
    }
    setConfirm({
      title: "Discard changes?",
      message: (
        <>Your unsaved edits to this {titleSingular.toLowerCase()} will be lost.</>
      ),
      confirmLabel: "Yes, discard",
      tone: "danger",
      onConfirm: closeForm,
    });
  }

  function closeBulk() {
    setBulkOpen(false);
    setBulkValues({});
  }

  function requestCloseBulk() {
    const dirty = Object.values(bulkValues).some((v) => String(v ?? "").trim() !== "");
    if (!dirty) {
      closeBulk();
      return;
    }
    setConfirm({
      title: "Discard changes?",
      message: <>Your bulk edit selections will be lost.</>,
      confirmLabel: "Yes, discard",
      tone: "danger",
      onConfirm: closeBulk,
    });
  }

  async function send(method: "POST" | "PATCH" | "DELETE", id: string | null, body?: FormValues) {
    const url = id ? `${basePath}/${entity}/${encodeURIComponent(id)}` : `${basePath}/${entity}`;
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error ?? "Request failed");
    }
  }

  /** Form submit → confirmation popup → API call → toast + live refresh. */
  function requestSave() {
    const missing = activeFields.find(
      (f) => f.required && String(values[f.name] ?? "").trim() === ""
    );
    if (missing) {
      setFormError(`${missing.label} is required`);
      return;
    }
    setFormError(null);

    const mode = formMode;
    const row = editingRow;
    const label =
      mode === "edit"
        ? String(row?.[nameKey] ?? titleSingular)
        : String(values[nameKey] ?? "").trim() || `new ${titleSingular.toLowerCase()}`;

    setConfirm({
      title: mode === "create" ? `Add ${titleSingular.toLowerCase()}?` : "Save changes?",
      message: (
        <>
          {mode === "create" ? "Create " : "Update "}
          <span className="font-semibold text-foreground">“{label}”</span>
          {mode === "create" ? ` in ${titlePlural.toLowerCase()}?` : ` — the change goes live immediately.`}
        </>
      ),
      confirmLabel: mode === "create" ? "Yes, add it" : "Yes, save",
      tone: "primary",
      onConfirm: async () => {
        try {
          const payload: FormValues = {};
          for (const f of activeFields) {
            const v = values[f.name];
            if (f.type === "password" && String(v ?? "") === "") continue;
            payload[f.name] = f.type === "number" ? Number(v ?? 0) : v;
          }
          await send(mode === "create" ? "POST" : "PATCH", mode === "edit" ? String(row?.id) : null, payload);
          toast("success", mode === "create" ? `${titleSingular} added` : `${titleSingular} updated`);
          closeForm();
          refresh();
        } catch (err) {
          toast("error", err instanceof Error ? err.message : "Request failed");
        }
      },
    });
  }

  function requestDelete(row: Row) {
    setConfirm({
      title: `Delete ${titleSingular.toLowerCase()}?`,
      message: (
        <>
          <span className="font-semibold text-foreground">“{String(row[nameKey] ?? row.id)}”</span> will be permanently
          removed along with its linked records. This cannot be undone.
        </>
      ),
      confirmLabel: "Yes, delete",
      tone: "danger",
      onConfirm: async () => {
        try {
          await send("DELETE", String(row.id));
          toast("success", `${titleSingular} deleted`);
          refresh();
        } catch (err) {
          toast("error", err instanceof Error ? err.message : "Delete failed");
        }
      },
    });
  }

  /** Run one request per selected row in parallel and report the outcome. */
  async function runBulk(fn: (id: string) => Promise<void>, verb: string) {
    const ids = [...selectedIds];
    const results = await Promise.allSettled(ids.map(fn));
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed === 0) toast("success", `${ids.length} record${ids.length === 1 ? "" : "s"} ${verb}`);
    else toast("error", `${ids.length - failed} ${verb}, ${failed} failed`);
    setSelectedIds(new Set());
    refresh();
  }

  function requestBulkApply() {
    const payload: FormValues = {};
    for (const f of bulkFields ?? []) {
      const v = bulkValues[f.name];
      if (String(v ?? "").trim() !== "") payload[f.name] = v;
    }
    if (Object.keys(payload).length === 0) return;
    const n = selectedIds.size;
    setConfirm({
      title: "Apply to selected?",
      message: (
        <>
          Update <span className="font-semibold text-foreground">{n}</span> selected{" "}
          {n === 1 ? titleSingular.toLowerCase() : titlePlural.toLowerCase()} at the same time — the changes go live
          immediately.
        </>
      ),
      confirmLabel: `Yes, update ${n}`,
      tone: "primary",
      onConfirm: async () => {
        setBulkOpen(false);
        setBulkValues({});
        await runBulk((id) => send("PATCH", id, payload), "updated");
      },
    });
  }

  function requestBulkDelete() {
    const n = selectedIds.size;
    setConfirm({
      title: `Delete ${n} record${n === 1 ? "" : "s"}?`,
      message: (
        <>
          All <span className="font-semibold text-foreground">{n}</span> selected{" "}
          {n === 1 ? titleSingular.toLowerCase() : titlePlural.toLowerCase()} and their linked records will be
          permanently removed. This cannot be undone.
        </>
      ),
      confirmLabel: `Yes, delete ${n}`,
      tone: "danger",
      onConfirm: () => runBulk((id) => send("DELETE", id), "deleted"),
    });
  }

  const hasActions = Boolean(editFields) || canDelete;
  const hasBulk = Boolean(bulkFields?.length) || canDelete;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 basis-56 text-sm text-muted">{description}</p>
        <LiveIndicator updatedAt={updatedAt} error={error} />
        {createFields && (
          <Button size="sm" icon={<AnimatedPlus className="h-4.5 w-4.5" />} onClick={openCreate}>
            Add {titleSingular.toLowerCase()}
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyMessage={`No ${titlePlural.toLowerCase()} found.`}
        selected={hasBulk ? selectedIds : undefined}
        onSelectedChange={hasBulk ? setSelectedIds : undefined}
        actions={
          hasActions
            ? (row) => (
                <>
                  {editFields && (
                    <button
                      onClick={() => openEdit(row)}
                      aria-label={`Edit ${titleSingular.toLowerCase()}`}
                      className="cursor-pointer rounded-full p-1.5 transition-all duration-200 hover:scale-110 hover:bg-brand-50 active:scale-90 dark:hover:bg-brand-900/25"
                    >
                      <AnimatedEdit className="h-4.5 w-4.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => requestDelete(row)}
                      aria-label={`Delete ${titleSingular.toLowerCase()}`}
                      className="cursor-pointer rounded-full p-1.5 transition-all duration-200 hover:scale-110 hover:bg-danger/10 active:scale-90"
                    >
                      <AnimatedTrash className="h-4.5 w-4.5" />
                    </button>
                  )}
                </>
              )
            : undefined
        }
      />

      <Modal
        open={formMode !== null}
        onClose={requestCloseForm}
        wide={activeFields.length > 5}
        title={formMode === "create" ? `Add ${titleSingular.toLowerCase()}` : `Edit ${titleSingular.toLowerCase()}`}
        subtitle={
          formMode === "edit" && editingRow ? `Editing “${String(editingRow[nameKey] ?? "")}”` : undefined
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestSave();
          }}
        >
          <div className={`grid grid-cols-1 gap-4 ${activeFields.length > 5 ? "sm:grid-cols-2" : ""}`}>
            {activeFields.map((f, i) => (
              <div key={f.name} className={f.full ? "sm:col-span-full" : undefined}>
                <FieldControl
                  field={f}
                  value={values[f.name]}
                  onChange={(v) => setValues((prev) => ({ ...prev, [f.name]: v }))}
                  suggestions={suggestionsByField[f.name]}
                  dynamicOptions={dynamicOptions[f.name]}
                  autoFocus={i === 0}
                />
              </div>
            ))}
          </div>
          {formError && <p className="mt-4 rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm text-danger">{formError}</p>}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button size="sm" variant="ghost" onClick={requestCloseForm}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              {formMode === "create" ? `Add ${titleSingular.toLowerCase()}` : "Save changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Floating bulk-action bar — acts on every selected row at once. */}
      <AnimatePresence>
        {hasBulk && selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-5 left-1/2 z-[60] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-border-soft bg-[var(--glass-nav-bg)] px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur-xl sm:gap-3"
          >
            <span className="text-sm font-semibold">
              {selectedIds.size} selected
            </span>
            {Boolean(bulkFields?.length) && (
              <Button size="sm" variant="secondary" icon={<AnimatedEdit className="h-4.5 w-4.5" />} onClick={() => setBulkOpen(true)}>
                Bulk edit
              </Button>
            )}
            {canDelete && (
              <Button size="sm" variant="danger" icon={<AnimatedTrash className="h-4.5 w-4.5" />} onClick={requestBulkDelete}>
                Delete selected
              </Button>
            )}
            <button
              onClick={() => setSelectedIds(new Set())}
              aria-label="Clear selection"
              className="cursor-pointer rounded-full p-1.5 transition-transform duration-200 hover:scale-110 hover:bg-surface-2 active:scale-90"
            >
              <AnimatedClose className="h-4.5 w-4.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk edit modal — only the fields you set are applied to every selected row. */}
      <Modal
        open={bulkOpen}
        onClose={requestCloseBulk}
        title={`Bulk edit ${selectedIds.size} ${selectedIds.size === 1 ? titleSingular.toLowerCase() : titlePlural.toLowerCase()}`}
        subtitle="Leave a field on “No change” to keep each record's current value."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestBulkApply();
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            {(bulkFields ?? []).map((f) => (
              <Select
                key={f.name}
                label={f.label}
                value={String(bulkValues[f.name] ?? "")}
                onChange={(e) => setBulkValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                options={[{ label: "— No change —", value: "" }, ...(f.options ?? [])]}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button size="sm" variant="ghost" onClick={requestCloseBulk}>
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={!(bulkFields ?? []).some((f) => String(bulkValues[f.name] ?? "").trim() !== "")}>
              Apply to {selectedIds.size} selected
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </div>
  );
}

"use client";

/** A set of toggleable pill chips backed by a comma-separated string value (e.g. "CBSE, ICSE"). */
export function ToggleChipGroup({
  label,
  options,
  value,
  onChange,
  hint,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (next: string) => void;
  hint?: string;
}) {
  const selected = new Set(
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );

  function toggle(v: string) {
    const next = new Set(selected);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange([...next].join(", "));
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.has(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                active
                  ? "brand-gradient-bg border-transparent text-white shadow-[0_2px_8px_rgba(108,77,255,0.35)]"
                  : "border-border-soft bg-surface text-muted hover:bg-surface-2"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

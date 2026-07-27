"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const STAGE_W = 320;
const OUTPUT_W = 720;

/** Crop/rotate editor shown before an admin-uploaded image is sent to the server. */
export function ImageCropModal({
  file,
  imageUrl,
  aspect = 1,
  onCancel,
  onConfirm,
}: {
  file: File;
  imageUrl: string;
  /** width / height of the crop frame — 1 for a circular portrait, wider for a banner. */
  aspect?: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const stageH = STAGE_W / aspect;
  const outputH = OUTPUT_W / aspect;
  const circular = aspect === 1;

  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const baseScale = natural.w && natural.h ? Math.max(STAGE_W / natural.w, stageH / natural.h) : 1;
  const scale = baseScale * zoom;

  function handlePointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(true);
    drag.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    setPan({ x: drag.current.panX + (e.clientX - drag.current.startX), y: drag.current.panY + (e.clientY - drag.current.startY) });
  }
  function handlePointerUp() {
    drag.current = null;
    setDragging(false);
  }

  function reset() {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  }

  function handleApply() {
    if (!imgRef.current || !natural.w) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_W;
    canvas.height = outputH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const factor = OUTPUT_W / STAGE_W;
    ctx.save();
    ctx.translate(OUTPUT_W / 2, outputH / 2);
    ctx.translate(pan.x * factor, pan.y * factor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale * factor, scale * factor);
    ctx.drawImage(imgRef.current, -natural.w / 2, -natural.h / 2, natural.w, natural.h);
    ctx.restore();
    // PNG (not JPEG) so transparent logos/cutouts don't get flattened to black.
    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/png"
    );
  }

  return (
    <Modal open onClose={onCancel} title="Adjust photo" subtitle={file.name}>
      <div className="flex flex-col items-center gap-5">
        <div
          className="relative touch-none overflow-hidden rounded-2xl bg-surface-2 select-none"
          style={{ width: STAGE_W, height: stageH, cursor: dragging ? "grabbing" : "grab" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- editor source, transformed via canvas on apply */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt=""
            draggable={false}
            onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
            className="absolute top-1/2 left-1/2 max-w-none"
            style={{
              width: natural.w,
              height: natural.h,
              transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${scale})`,
            }}
          />
          {/* Crop guide: everything outside the frame is dimmed */}
          <div
            className={`pointer-events-none absolute inset-[6px] ${circular ? "rounded-full" : "rounded-xl"}`}
            style={{ boxShadow: "0 0 0 9999px rgba(11,13,23,0.5)" }}
          />
        </div>

        <div className="w-full max-w-xs space-y-4">
          <label className="flex items-center gap-3 text-sm text-muted">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-brand-500"
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-muted">
            Rotate
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation > 180 ? rotation - 360 : rotation}
              onChange={(e) => setRotation((Number(e.target.value) + 360) % 360)}
              className="flex-1 accent-brand-500"
            />
          </label>
          <div className="flex items-center justify-center gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => setRotation((r) => (r + 270) % 360)}>
              Rotate 90° left
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={() => setRotation((r) => (r + 90) % 360)}>
              Rotate 90° right
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>

        <div className="flex w-full justify-end gap-2 border-t border-border-soft pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply} disabled={!natural.w}>
            Apply & upload
          </Button>
        </div>
      </div>
    </Modal>
  );
}

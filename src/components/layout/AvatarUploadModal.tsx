"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmDialog, useToast, type ConfirmState } from "@/components/ui/Modal";
import { AnimatedUploadCloud } from "@/components/ui/icons/AnimatedUploadCloud";
import { AnimatedCameraCapture } from "@/components/ui/icons/AnimatedCameraCapture";
import { AnimatedWarning } from "@/components/ui/icons/AnimatedWarning";

const MAX_SIZE = 4 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];

export function AvatarUploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState<"choose" | "camera">("choose");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    stopCamera();
    setMode("choose");
    setPreview(null);
    setFile(null);
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function discardPreview() {
    setConfirm({
      title: "Discard this photo?",
      message: "You'll lose this preview and go back to choosing a new one.",
      confirmLabel: "Discard",
      tone: "danger",
      onConfirm: () => {
        setPreview(null);
        setFile(null);
        setError(null);
        setMode("choose");
      },
    });
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setMode("camera");
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setError("Couldn't access your camera. Check your browser permissions.");
    }
  }

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setFile(blob);
        setPreview(URL.createObjectURL(blob));
        stopCamera();
      },
      "image/jpeg",
      0.92
    );
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setError("Use a JPG, PNG, or WEBP image.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Image must be under 4MB.");
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("photo", file, file instanceof File ? file.name : "capture.jpg");
      const res = await fetch("/api/account/avatar", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        const message = json.error ?? "Couldn't update your photo";
        setError(message);
        toast("error", message);
        return;
      }
      toast("success", "Profile photo updated");
      handleClose();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Modal open={open} onClose={handleClose} title="Update profile photo" subtitle="A sharp, well-lit photo helps mentors and peers recognize you">
        <div className="flex flex-col items-center gap-5">
          {preview ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative"
              >
                <div className="absolute -inset-2 rounded-full bg-[conic-gradient(from_0deg,var(--brand-500),var(--accent-500),var(--brand-500))] opacity-70 blur-md" />
                {/* eslint-disable-next-line @next/next/no-img-element -- transient blob preview, not a static asset */}
                <img
                  src={preview}
                  alt="Preview"
                  className="relative h-40 w-40 rounded-full border-4 border-surface object-cover shadow-[var(--shadow-lift)]"
                />
              </motion.div>

              {error && (
                <p className="flex items-center gap-1.5 text-sm text-danger">
                  <AnimatedWarning className="h-4.5 w-4.5" /> {error}
                </p>
              )}

              <div className="flex w-full gap-3">
                <Button variant="danger" className="flex-1" onClick={discardPreview} disabled={saving}>
                  Cancel
                </Button>
                <Button
                  variant="info"
                  className="flex-1"
                  onClick={handleSave}
                  disabled={saving}
                  icon={<AnimatedUploadCloud className="h-4.5 w-4.5" />}
                >
                  {saving ? "Uploading…" : "Upload photo"}
                </Button>
              </div>
            </>
          ) : mode === "camera" ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="h-56 w-full scale-x-[-1] rounded-2xl bg-black object-cover" />
              {error && (
                <p className="flex items-center gap-1.5 text-sm text-danger">
                  <AnimatedWarning className="h-4.5 w-4.5" /> {error}
                </p>
              )}
              <div className="flex w-full gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    stopCamera();
                    setMode("choose");
                  }}
                >
                  Back
                </Button>
                <Button variant="info" className="flex-1" onClick={capture} icon={<AnimatedCameraCapture className="h-5 w-5" />}>
                  Capture
                </Button>
              </div>
            </>
          ) : (
            <div className="flex w-full flex-col gap-3">
              {error && (
                <p className="flex items-center gap-1.5 text-sm text-danger">
                  <AnimatedWarning className="h-4.5 w-4.5" /> {error}
                </p>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border-soft px-4 py-4 text-left text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-[var(--shadow-soft)]"
              >
                <AnimatedUploadCloud className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                <span>
                  <span className="block">Upload a photo</span>
                  <span className="block text-xs font-normal text-muted">JPG, PNG or WEBP · up to 4MB</span>
                </span>
              </button>
              <button
                onClick={startCamera}
                className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border-soft px-4 py-4 text-left text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-[var(--shadow-soft)]"
              >
                <AnimatedCameraCapture className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                <span>
                  <span className="block">Use camera</span>
                  <span className="block text-xs font-normal text-muted">Take a photo right now</span>
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFilePick}
              />
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

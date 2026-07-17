"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedVideoCamera } from "@/components/ui/icons/AnimatedVideoCamera";
import { AnimatedRecordDot } from "@/components/ui/icons/AnimatedRecordDot";
import { AnimatedClose } from "@/components/ui/icons/AnimatedClose";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: Record<string, unknown>) => {
      dispose: () => void;
      addEventListener: (event: string, cb: (...args: unknown[]) => void) => void;
    };
  }
}

const JITSI_DOMAIN = "meet.jit.si";
const MAX_RECORDING_MS = 90 * 60_000; // safety valve — auto-stop long recordings

export function LiveClassRoom({
  classId,
  roomSlug,
  title,
  canRecord,
  displayName,
}: {
  classId: string;
  roomSlug: string;
  title: string;
  canRecord: boolean;
  displayName: string;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<InstanceType<NonNullable<Window["JitsiMeetExternalAPI"]>> | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const autoStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "uploading" | "error">("idle");

  useEffect(() => {
    if (!scriptReady || !containerRef.current || apiRef.current) return;
    if (!window.JitsiMeetExternalAPI) return;

    apiRef.current = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
      roomName: roomSlug,
      parentNode: containerRef.current,
      width: "100%",
      height: "100%",
      userInfo: { displayName },
      configOverwrite: { prejoinPageEnabled: false, disableDeepLinking: true },
      interfaceConfigOverwrite: { TOOLBAR_ALWAYS_VISIBLE: true },
    });

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [scriptReady, roomSlug, displayName]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (autoStopTimer.current) clearTimeout(autoStopTimer.current);
    };
  }, []);

  async function uploadRecording() {
    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    chunksRef.current = [];
    setRecordingState("uploading");
    try {
      const res = await fetch(`/api/mentor/classes/${classId}/recording`, {
        method: "POST",
        headers: { "Content-Type": "video/webm", "X-Filename": `class-${classId}-${Date.now()}.webm` },
        body: blob,
      });
      setRecordingState(res.ok ? "idle" : "error");
    } catch {
      setRecordingState("error");
    }
  }

  function stopRecording() {
    if (autoStopTimer.current) clearTimeout(autoStopTimer.current);
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 15 },
        audio: true,
      });
      streamRef.current = stream;
      stream.getVideoTracks()[0].addEventListener("ended", stopRecording);

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        void uploadRecording();
      };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setRecordingState("recording");

      autoStopTimer.current = setTimeout(stopRecording, MAX_RECORDING_MS);
    } catch {
      setRecordingState("error");
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-black">
      <Script src={`https://${JITSI_DOMAIN}/external_api.js`} onLoad={() => setScriptReady(true)} strategy="afterInteractive" />

      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-surface px-4 py-3 sm:px-6">
        <span className="flex min-w-0 items-center gap-2.5">
          <AnimatedVideoCamera className="h-6 w-6 shrink-0" />
          <span className="truncate text-sm font-semibold">{title}</span>
        </span>

        <div className="flex items-center gap-2">
          {canRecord && (
            <AnimatePresence mode="wait">
              {recordingState === "recording" ? (
                <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <AnimatedRecordDot className="h-5 w-5" />
                  <Button size="sm" variant="danger" onClick={stopRecording}>
                    Stop recording
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button size="sm" variant="secondary" onClick={startRecording} disabled={recordingState === "uploading"}>
                    {recordingState === "uploading" ? "Uploading…" : "Start recording"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <Button size="sm" variant="ghost" onClick={() => router.back()} icon={<AnimatedClose className="h-4.5 w-4.5" />}>
            Leave
          </Button>
        </div>
      </div>

      {recordingState === "error" && (
        <p className="bg-danger/10 px-4 py-2 text-center text-xs text-danger">
          Recording couldn&apos;t be captured or uploaded — make sure Google Drive is connected and screen sharing was allowed.
        </p>
      )}

      <div ref={containerRef} className="min-h-0 flex-1" />
    </div>
  );
}

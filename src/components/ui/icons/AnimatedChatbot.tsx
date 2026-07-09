"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Modern 3D-style AI agent bot — glossy white shell with a dark camera visor,
 * glowing cyan eyes, blue top antennas and ear pods, a pulsing chest core, and
 * an extended arm presenting a floating purple energy orb with a spinning ring.
 * Every part loops forever.
 */
export function AnimatedChatbot({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = "bot" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const shell = `url(#${id}shell)`;
  const blue = `url(#${id}blue)`;
  const eye = `url(#${id}eye)`;
  const glow = `url(#${id}glow)`;
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={style}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}shell`} x1="0" y1="0" x2="0.55" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#eef2f9" />
            <stop offset="100%" stopColor="#c6d3e8" />
          </linearGradient>
          <linearGradient id={`${id}blue`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ed1ff" />
            <stop offset="100%" stopColor="#3f97ef" />
          </linearGradient>
          <linearGradient id={`${id}visor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c3a58" />
            <stop offset="100%" stopColor="#0e1626" />
          </linearGradient>
          <linearGradient id={`${id}eye`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <radialGradient id={`${id}orb`} cx="0.35" cy="0.3" r="0.9">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="45%" stopColor="#7c5cf6" />
            <stop offset="100%" stopColor="#4c2bb8" />
          </radialGradient>
          <filter id={`${id}glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ground shadow, breathing opposite the hover bob */}
        <motion.ellipse
          cx="24"
          cy="45.2"
          rx="9"
          ry="1.5"
          fill="#64748b"
          style={{ transformOrigin: "24px 45.2px" }}
          animate={{ scaleX: [1, 0.8, 1], opacity: [0.24, 0.12, 0.24] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Hovering robot */}
        <motion.g animate={{ y: [0, -1.4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          {/* Top antennas with blinking tips */}
          <rect x="10.9" y="1.8" width="3.2" height="7" rx="1.6" fill={blue} transform="rotate(-26 12.5 5.3)" />
          <rect x="33.9" y="1.8" width="3.2" height="7" rx="1.6" fill={blue} transform="rotate(26 35.5 5.3)" />
          {[
            { cx: 10.8, d: 0 },
            { cx: 37.2, d: 0.5 },
          ].map((tip) => (
            <motion.circle
              key={tip.cx}
              cx={tip.cx}
              cy="2.4"
              r="0.9"
              fill="#a5f3fc"
              filter={glow}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: tip.d }}
            />
          ))}

          {/* Ear pods */}
          <rect x="6.9" y="12.6" width="4.4" height="9" rx="2.2" fill={blue} />
          <rect x="36.7" y="12.6" width="4.4" height="9" rx="2.2" fill={blue} />
          <rect x="7.7" y="13.6" width="1.1" height="7" rx="0.55" fill="#ffffff" opacity="0.4" />
          <rect x="37.5" y="13.6" width="1.1" height="7" rx="0.55" fill="#ffffff" opacity="0.4" />

          {/* Glossy head */}
          <rect x="11" y="6" width="26" height="20" rx="8.5" fill={shell} />
          <ellipse cx="19" cy="8.6" rx="6.5" ry="1.7" fill="#ffffff" opacity="0.7" />

          {/* Dark camera visor with corner brackets */}
          <rect x="14.6" y="10" width="18.8" height="12" rx="5" fill={`url(#${id}visor)`} />
          <path d="M15.4 13.8v-0.6a3 3 0 0 1 3-3h0.6" stroke="#67e8f9" strokeWidth="0.7" strokeLinecap="round" opacity="0.9" />
          <path d="M32.6 13.8v-0.6a3 3 0 0 0-3-3h-0.6" stroke="#67e8f9" strokeWidth="0.7" strokeLinecap="round" opacity="0.9" />
          <path d="M15.4 18.2v0.6a3 3 0 0 0 3 3h0.6" stroke="#67e8f9" strokeWidth="0.7" strokeLinecap="round" opacity="0.9" />
          <path d="M32.6 18.2v0.6a3 3 0 0 1-3 3h-0.6" stroke="#67e8f9" strokeWidth="0.7" strokeLinecap="round" opacity="0.9" />

          {/* Blinking glowing eyes */}
          {[20.4, 27.6].map((cx) => (
            <motion.ellipse
              key={cx}
              cx={cx}
              cy="16.1"
              rx="2.05"
              ry="2.7"
              fill={eye}
              filter={glow}
              style={{ transformOrigin: `${cx}px 16.1px` }}
              animate={{ scaleY: [1, 1, 0.12, 1, 1] }}
              transition={{ duration: 3.4, times: [0, 0.42, 0.5, 0.58, 1], repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          ))}

          {/* Right arm, tucked behind the body */}
          <rect x="30.6" y="28.4" width="8.5" height="3.6" rx="1.8" fill={shell} transform="rotate(32 31.6 30.2)" />

          {/* Torso with blue chest bib and pulsing core */}
          <rect x="16" y="26.4" width="16" height="13.6" rx="6.8" fill={shell} />
          <path d="M18.2 26.4h11.6v4a5.8 5.8 0 0 1-11.6 0Z" fill={blue} />
          <motion.circle
            cx="24"
            cy="30.6"
            r="2"
            fill={eye}
            filter={glow}
            style={{ transformOrigin: "24px 30.6px" }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Presenting arm + floating energy orb */}
          <motion.g
            style={{ transformOrigin: "17px 31px" }}
            animate={{ rotate: [0, 4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="8.4" y="29.6" width="9.5" height="3.6" rx="1.8" fill={shell} transform="rotate(-14 17 31.4)" />
            <motion.g animate={{ y: [0, -1.6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}>
              <motion.circle
                cx="7.6"
                cy="25.4"
                r="3.9"
                fill={`url(#${id}orb)`}
                filter={glow}
                style={{ transformOrigin: "7.6px 25.4px" }}
                animate={{ scale: [1, 1.09, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <ellipse cx="6.4" cy="23.9" rx="1.3" ry="0.85" fill="#ffffff" opacity="0.55" />
              <motion.ellipse
                cx="7.6"
                cy="25.4"
                rx="5.8"
                ry="2.1"
                stroke="#67e8f9"
                strokeWidth="0.7"
                fill="none"
                opacity="0.9"
                style={{ transformOrigin: "7.6px 25.4px" }}
                animate={{ rotate: [-18, 342] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.path
                d="M13.4 19.6l0.5 1.1 1.1 0.5-1.1 0.5-0.5 1.1-0.5-1.1-1.1-0.5 1.1-0.5Z"
                fill="#a5f3fc"
                style={{ transformOrigin: "13.9px 21.2px" }}
                animate={{ scale: [0.5, 1.15, 0.5], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>
    </span>
  );
}

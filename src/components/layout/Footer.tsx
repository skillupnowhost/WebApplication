"use client";

import Link from "next/link";
import Image from "next/image";
import { useId } from "react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedChat } from "@/components/ui/icons/AnimatedChat";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedBriefcase } from "@/components/ui/icons/AnimatedBriefcase";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { toWhatsAppLink } from "@/lib/whatsapp";
import { CONTACT_EMAIL, CONTACT_PHONES, WHATSAPP_PHONE } from "@/lib/contactInfo";
import logo from "@/images/Loginn Logo.png";

/* ── Gradient social glyphs ─────────────────────────────────────────── */

function InstagramIcon({ className }: { className?: string }) {
  const id = "igf" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="45%" stopColor="#e1306c" />
          <stop offset="100%" stopColor="#833ab4" />
        </linearGradient>
      </defs>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" fill={`url(#${id})`} />
      <circle cx="12" cy="12" r="4.1" stroke="#fff" strokeWidth="1.9" />
      <circle cx="17.25" cy="6.75" r="1.25" fill="#fff" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  const id = "lif" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0a66c2" />
        </linearGradient>
      </defs>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5" fill={`url(#${id})`} />
      <path
        d="M8.3 10.1v7H5.9v-7Zm-1.2-3.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm3.4 3.6h2.3v1c.35-.6 1.2-1.25 2.5-1.25 2 0 3 1.3 3 3.5v3.75h-2.4v-3.4c0-1-.4-1.7-1.3-1.7-.75 0-1.2.5-1.4 1-.07.18-.1.42-.1.67v3.43h-2.4v-7Z"
        fill="#fff"
      />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  const id = "twf" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5" fill={`url(#${id})`} />
      <path
        d="M15.5 6.5h1.9l-4.15 4.75L18.15 17.5h-3.83l-3-3.92-3.43 3.92H6l4.44-5.07L5.75 6.5h3.93l2.71 3.58Zm-.67 9.86h1.05L9.11 7.58H7.98Z"
        fill="#fff"
      />
    </svg>
  );
}

const socials = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { label: "X (Twitter)", href: "#", Icon: TwitterIcon },
];

/* ── Link data ──────────────────────────────────────────────────────── */

const columns = [
  {
    title: "Learn",
    Icon: AnimatedGraduation,
    links: [
      { href: "/courses", label: "Courses" },
      { href: "/internships", label: "Internships" },
      { href: "/projects", label: "Projects" },
      { href: "/tutoring", label: "Online Tutoring" },
    ],
  },
  {
    title: "Services",
    Icon: AnimatedBriefcase,
    links: [
      { href: "/services/digital-marketing", label: "Digital Marketing" },
      { href: "/services/app-web-development", label: "App & Web Development" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Account",
    Icon: AnimatedUser,
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Create account" },
    ],
  },
];

const contactLinks = [
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, Icon: AnimatedMail },
  { label: `+91 ${CONTACT_PHONES[0].display}`, href: `tel:${CONTACT_PHONES[0].tel}`, Icon: AnimatedPhone },
  {
    label: "WhatsApp us",
    href: toWhatsAppLink(WHATSAPP_PHONE, "Hi MyLoginn team!") ?? "/contact",
    Icon: AnimatedChat,
    external: true,
  },
];

/* ── Footer ─────────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border-soft">
      {/* Full-bleed CTA banner */}
      <div className="relative overflow-hidden brand-gradient-bg text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 70% 100% at 50% 50%, black 30%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 100% at 50% 50%, black 30%, transparent 85%)",
          }}
        />
        <div className="pointer-events-none absolute -top-20 right-[10%] h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-[5%] h-64 w-64 rounded-full bg-black/10 blur-3xl" />

        <Reveal scale className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to level up your skills?</p>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                Join learners building real careers with MyLoginn.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="shrink-0">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-600 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
              >
                Get started — it&apos;s free
                <AnimatedArrow className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-x-10 gap-y-14 py-16 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
          {/* Brand + contact */}
          <Reveal direction="up" className="md:border-r md:border-border-soft md:pr-10">
            <Link
              href="/"
              className="inline-flex items-center transition-transform duration-300 hover:scale-[1.03]"
            >
              <Image src={logo} alt="MyLoginn" className="h-20 w-auto select-none object-contain" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              AI-powered learning, tutoring, internships and growth services &mdash; built for students,
              professionals and businesses.
            </p>

            <ul className="mt-7 flex flex-col gap-4">
              {contactLinks.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex items-center gap-3 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    <c.Icon className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-5">
              {socials.map(({ label, href, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="inline-flex"
                >
                  <Icon className="h-7 w-7" />
                </motion.a>
              ))}
            </div>
          </Reveal>

          {/* Link columns */}
          <RevealGroup
            className="grid gap-x-8 gap-y-10 [grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr))]"
            stagger={0.12}
          >
            {columns.map((col) => (
              <RevealItem key={col.title}>
                <div className="flex items-center gap-2">
                  <col.Icon className="h-5 w-5 shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-[0.16em] brand-gradient-text">{col.title}</p>
                </div>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-0 text-sm text-muted transition-colors duration-200 hover:text-foreground"
                      >
                        <span className="h-1.5 w-0 rounded-full brand-gradient-bg opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:w-1.5 group-hover:opacity-100" />
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Bottom bar */}
        <Reveal direction="none" duration={0.9}>
          <div className="flex flex-col items-center gap-4 border-t border-border-soft py-7 text-xs text-muted sm:flex-row sm:justify-between">
            <p>&copy; {new Date().getFullYear()} MyLoginn. All rights reserved.</p>

            <p className="inline-flex items-center gap-1.5">
              Made with
              <motion.span
                aria-hidden
                className="inline-flex text-rose-500"
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                ♥
              </motion.span>
              in India
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

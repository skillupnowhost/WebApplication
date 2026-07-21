"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedPhone } from "@/components/ui/icons/AnimatedPhone";
import { AnimatedChat } from "@/components/ui/icons/AnimatedChat";
import { AnimatedArrow } from "@/components/ui/icons/AnimatedArrow";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedBriefcase } from "@/components/ui/icons/AnimatedBriefcase";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedInstagram } from "@/components/ui/icons/AnimatedInstagram";
import { AnimatedFacebook } from "@/components/ui/icons/AnimatedFacebook";
import { Monogram, MonogramWatermark } from "@/components/ui/Monogram";
import { toWhatsAppLink } from "@/lib/whatsapp";
import { CONTACT_EMAILS, CONTACT_PHONES, WHATSAPP_PHONE, SOCIAL_LINKS } from "@/lib/contactInfo";
import logo from "@/images/Loginn Logo.png";

const socialIcons = { instagram: AnimatedInstagram, facebook: AnimatedFacebook } as const;

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
      { href: "/mentoring", label: "Mentoring" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    title: "Services",
    Icon: AnimatedBriefcase,
    links: [
      { href: "/services/digital-marketing", label: "Digital Marketing" },
      { href: "/services/app-web-development", label: "App & Web Development" },
      { href: "/astrology", label: "Astrology" },
      { href: "/about", label: "About us" },
    ],
  },
  {
    title: "Account",
    Icon: AnimatedUser,
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Create account" },
      { href: "/contact", label: "Contact us" },
    ],
  },
];

/* ── Footer ─────────────────────────────────────────────────────────── */

export function Footer() {
  const whatsappHref = toWhatsAppLink(WHATSAPP_PHONE, "Hi MyLoginn team!") ?? "/contact";

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
        <MonogramWatermark className="pointer-events-none absolute -bottom-20 -right-6 text-[13rem] leading-none sm:text-[17rem]" />

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
        <div className="grid gap-x-10 gap-y-14 py-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2.4fr)]">
          {/* Brand */}
          <Reveal direction="up" className="md:border-r md:border-border-soft md:pr-10">
            <Link
              href="/"
              className="inline-flex items-center gap-3 transition-transform duration-300 hover:scale-[1.03]"
            >
              <Monogram size="sm" />
              <Image src={logo} alt="MyLoginn" className="h-14 w-auto select-none object-contain" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              AI-powered learning, tutoring, internships and growth services &mdash; built for students,
              professionals and businesses.
            </p>

            <div className="mt-7 flex flex-col gap-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
              >
                <AnimatedChat className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                WhatsApp us
              </a>
              <a
                href={`tel:${CONTACT_PHONES[0].tel}`}
                className="group inline-flex items-center gap-3 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
              >
                <AnimatedPhone className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                +91 {CONTACT_PHONES[0].display}
              </a>
            </div>

            <div className="mt-7 flex items-center gap-4">
              {SOCIAL_LINKS.map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <motion.a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`MyLoginn on ${s.label}`}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="inline-flex"
                  >
                    <Icon className="h-8 w-8" />
                  </motion.a>
                );
              })}
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

            <RevealItem className="[grid-column:1/-1] sm:[grid-column:auto] min-w-0">
              <div className="flex items-center gap-2">
                <AnimatedMail className="h-5 w-5 shrink-0" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] brand-gradient-text">Get in touch</p>
              </div>
              <ul className="mt-5 flex flex-col gap-4">
                {CONTACT_EMAILS.map((c) => (
                  <li key={c.key}>
                    <a
                      href={`mailto:${c.email}`}
                      className="group flex flex-col gap-0.5"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground/70 transition-colors duration-200 group-hover:text-brand-500">
                        {c.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 break-all text-sm text-muted transition-colors duration-200 group-hover:text-foreground">
                        <AnimatedArrow className="h-3 w-3 shrink-0 opacity-0 transition-all duration-300 -ml-4 group-hover:ml-0 group-hover:opacity-100" />
                        {c.email}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </RevealItem>
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

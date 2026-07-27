"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  LogIn,
  Rocket,
} from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import { AnimatedHome } from "@/components/ui/icons/AnimatedHome";
import { AnimatedBook } from "@/components/ui/icons/AnimatedBook";
import { AnimatedBriefcase } from "@/components/ui/icons/AnimatedBriefcase";
import { AnimatedFolder } from "@/components/ui/icons/AnimatedFolder";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedMegaphone } from "@/components/ui/icons/AnimatedMegaphone";
import { AnimatedCode } from "@/components/ui/icons/AnimatedCode";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { AnimatedCalendar } from "@/components/ui/icons/AnimatedCalendar";
import { AnimatedVideoCamera } from "@/components/ui/icons/AnimatedVideoCamera";
import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { ProfileMenu, type ProfileUser } from "./ProfileMenu";
import { NotificationBell } from "./NotificationBell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import logo from "@/images/Loginn Logo.png";

type NavUser = ProfileUser | null;
type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

/* ── Top-level structural nav (client spec order: Home, About, Courses,
   Internships, Services, Projects, Gallery, Contact) ─────────────────── */

const beforeServiceLinks = [
  { href: "/about", label: "About Us" },
  { href: "/courses", label: "Courses" },
  { href: "/internships", label: "Internships" },
];

const afterServiceLinks = [{ href: "/projects", label: "Projects" }];

/* ── Services mega-menu content ────────────────────────────────────────
   Grouped into "Learning" (tutoring/mentoring/events) and "Digital
   Services" (marketing/dev), plus a featured Astrology entry. There is no
   dedicated Blog/News feature in this codebase — intentionally omitted
   rather than linking to a fake route. */

type MegaItem = { href: string; label: string; desc: string; icon: IconComponent };
type MegaColumn = { title: string; items: MegaItem[] };

const megaColumns: MegaColumn[] = [
  {
    title: "Learning",
    items: [
      { href: "/tutoring", label: "Tutoring", desc: "1:1 mentor sessions, live classes", icon: AnimatedGraduation },
      { href: "/mentoring", label: "Mentoring", desc: "Meet the mentors behind our projects", icon: AnimatedUsers },
      { href: "/events", label: "Events", desc: "Live workshops, webinars & meetups", icon: AnimatedCalendar },
    ],
  },
  {
    title: "Digital Services",
    items: [
      {
        href: "/services/digital-marketing",
        label: "Digital Marketing",
        desc: "AI-driven growth campaigns",
        icon: AnimatedMegaphone,
      },
      {
        href: "/services/app-web-development",
        label: "App & Web Development",
        desc: "Full-stack builds, premium UX",
        icon: AnimatedCode,
      },
    ],
  },
];

const megaFeature: MegaItem = {
  href: "/astrology",
  label: "Astrology",
  desc: "Your divine horoscope, guided by our astrologers",
  icon: AnimatedMoonStar,
};

/** Stable visual order of every focusable mega-menu link, used for arrow-key cycling. */
const MEGA_ITEM_ORDER = [
  ...megaColumns.flatMap((col) => col.items.map((item) => item.href)),
  megaFeature.href,
  "/services",
];

const isServicesPath = (p: string) =>
  p.startsWith("/services") || p === "/tutoring" || p === "/mentoring" || p === "/events" || p === "/astrology";

/* ── Mobile menu content (mirrors the desktop mega-menu grouping) ─────── */

type MobileLink = {
  href: string;
  label: string;
  desc?: string;
  icon: IconComponent;
};

const mobileTopLinks: MobileLink[] = [
  { href: "/", label: "Home", desc: "Back to the start", icon: AnimatedHome },
  { href: "/about", label: "About Us", desc: "Our story, team & partners", icon: AnimatedUsers },
  { href: "/courses", label: "Courses", desc: "Learn job-ready skills", icon: AnimatedBook },
  { href: "/internships", label: "Internships", desc: "Real-world experience", icon: AnimatedBriefcase },
];

const mobileAfterLinks: MobileLink[] = [
  { href: "/projects", label: "Projects", desc: "Build your portfolio", icon: AnimatedFolder },
];

type MobileGroup = { id: string; label: string; icon: IconComponent; items: MobileLink[] };

const mobileMegaGroups: MobileGroup[] = [
  {
    id: "learning",
    label: "Learning",
    icon: AnimatedGraduation,
    items: [
      { href: "/tutoring", label: "Tutoring", desc: "1:1 mentor sessions, live classes", icon: AnimatedGraduation },
      { href: "/mentoring", label: "Mentoring", desc: "Meet the mentors behind our projects", icon: AnimatedUsers },
      { href: "/events", label: "Events", desc: "Live workshops, webinars & meetups", icon: AnimatedCalendar },
    ],
  },
  {
    id: "digital",
    label: "Digital Services",
    icon: AnimatedCode,
    items: [
      {
        href: "/services/digital-marketing",
        label: "Digital Marketing",
        desc: "AI-driven growth campaigns",
        icon: AnimatedMegaphone,
      },
      {
        href: "/services/app-web-development",
        label: "App & Web Development",
        desc: "Full-stack builds, premium UX",
        icon: AnimatedCode,
      },
    ],
  },
];

const mobileAstrologyLink: MobileLink = {
  href: "/astrology",
  label: "Astrology",
  desc: "Your divine horoscope",
  icon: AnimatedMoonStar,
};

const mobileServicesIndexLink: MobileLink = {
  href: "/services",
  label: "All services",
  desc: "See everything we offer",
  icon: AnimatedLayers,
};

const mobileContactLink: MobileLink = {
  href: "/contact",
  label: "Contact",
  desc: "We reply fast",
  icon: AnimatedMail,
};

export function Navbar({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || mobileOpen ? "glass-nav border-b border-border-soft shadow-[var(--shadow-soft)]" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-28 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.97]"
        >
          <Image
            src={logo}
            alt="MyLoginn"
            preload
            className="h-12 w-auto select-none object-contain sm:h-14 lg:h-16"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <NavHeaderLink href="/" active={pathname === "/"}>
            Home
          </NavHeaderLink>

          {beforeServiceLinks.map((link) => (
            <NavHeaderLink key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavHeaderLink>
          ))}

          <ServicesMegaMenu pathname={pathname} />

          {afterServiceLinks.map((link) => (
            <NavHeaderLink key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavHeaderLink>
          ))}

          <NavHeaderLink href="/contact" active={pathname === "/contact"}>
            Contact
          </NavHeaderLink>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <ProfileMenu user={user} />
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button href="/signup" variant="primary" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5 lg:hidden">
          {user ? (
            <>
              <NotificationBell />
              <ProfileMenu user={user} onOpen={() => setMobileOpen(false)} />
            </>
          ) : (
            <Link
              href="/login"
              aria-label="Log in"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft bg-surface transition-all duration-300 hover:border-brand-400 hover:shadow-[0_4px_16px_rgba(108,77,255,0.25)] active:scale-95"
            >
              <AnimatedUser className="h-6 w-6" />
            </Link>
          )}
          <HamburgerButton open={mobileOpen} onToggle={() => setMobileOpen((o) => !o)} />
        </div>
      </nav>

      <MobileMenu open={mobileOpen} pathname={pathname} user={user} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

/* ── Desktop services mega-menu ─────────────────────────────────────────
   Keyboard-accessible: Enter/Space (native button behavior) or ArrowDown
   opens and focuses the first item; Escape closes and returns focus to
   the trigger; ArrowUp/ArrowDown cycle through menu items. Hover keeps the
   existing open-on-hover feel for mouse users. */

function ServicesMegaMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Keyed by href rather than a reset-every-render array, so registration only
  // ever happens inside ref callbacks (mount/unmount), never during render.
  const itemNodes = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const orderedItems = () => MEGA_ITEM_ORDER.map((href) => itemNodes.current.get(href)).filter(
    (el): el is HTMLAnchorElement => Boolean(el)
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const close = (focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const active = isServicesPath(pathname);

  return (
    <div
      ref={wrapRef}
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="services-mega-menu"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => orderedItems()[0]?.focus());
          } else if (e.key === "Escape") {
            close();
          }
        }}
        className={cn(
          "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
          active ? "text-brand-500" : "text-foreground/80 hover:text-foreground"
        )}
      >
        Services
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
        <span
          className={cn(
            "pointer-events-none absolute inset-x-3.5 -bottom-0.5 h-[3px] origin-center rounded-full brand-gradient-bg transition-transform duration-300 ease-out",
            open || active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="services-mega-menu"
            role="menu"
            aria-label="Services"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={(e) => {
              const items = orderedItems();
              if (items.length === 0) return;
              const idx = items.findIndex((el) => el === document.activeElement);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                items[(idx + 1 + items.length) % items.length]?.focus();
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                items[(idx - 1 + items.length) % items.length]?.focus();
              } else if (e.key === "Escape") {
                e.preventDefault();
                close(true);
              }
            }}
            className="absolute left-1/2 top-full mt-2 w-[38rem] max-w-[92vw] -translate-x-[38%] rounded-3xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-lift)]"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="grid grid-cols-1 gap-6 sm:col-span-2 sm:grid-cols-2">
                {megaColumns.map((col) => (
                  <div key={col.title}>
                    <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                      {col.title}
                    </p>
                    <div className="flex flex-col gap-1">
                      {col.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            ref={(el) => {
                              if (el) itemNodes.current.set(item.href, el);
                              else itemNodes.current.delete(item.href);
                            }}
                            onClick={() => setOpen(false)}
                            className="group/item flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors duration-150 hover:bg-surface-2 focus:outline-none focus-visible:bg-surface-2"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 transition-transform duration-300 group-hover/item:scale-110">
                              <Icon className="h-6 w-6" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium">{item.label}</span>
                              <span className="block text-xs text-muted">{item.desc}</span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Astrology</p>
                <Link
                  href={megaFeature.href}
                  role="menuitem"
                  ref={(el) => {
                    if (el) itemNodes.current.set(megaFeature.href, el);
                    else itemNodes.current.delete(megaFeature.href);
                  }}
                  onClick={() => setOpen(false)}
                  className="group/item relative flex h-[calc(100%-1.75rem)] min-h-[8.5rem] flex-col justify-end overflow-hidden rounded-2xl border border-border-soft bg-gradient-to-br from-brand-50 to-surface-2 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:from-brand-900/20 dark:to-surface-2"
                >
                  <AnimatedMoonStar className="absolute -right-3 -top-3 h-16 w-16 opacity-70 transition-transform duration-500 group-hover/item:scale-110 group-hover/item:-rotate-6" />
                  <span className="text-sm font-semibold">{megaFeature.label}</span>
                  <span className="mt-1 block text-xs text-muted">{megaFeature.desc}</span>
                </Link>
              </div>
            </div>

            <div className="mt-4 border-t border-border-soft pt-3">
              <Link
                href="/services"
                role="menuitem"
                ref={(el) => {
                  if (el) itemNodes.current.set("/services", el);
                  else itemNodes.current.delete("/services");
                }}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-2.5 py-2 text-sm font-medium text-brand-500 transition-colors duration-150 hover:bg-surface-2 focus:outline-none focus-visible:bg-surface-2"
              >
                Explore all services
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Morphing hamburger button ──────────────────────────────────────── */

function HamburgerButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const barTransition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };
  return (
    <motion.button
      aria-label="Toggle menu"
      aria-expanded={open}
      onClick={onToggle}
      whileTap={{ scale: 0.88 }}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-2xl cursor-pointer transition-all duration-300",
        open
          ? "brand-gradient-bg text-white shadow-[0_8px_24px_rgba(108,77,255,0.45)]"
          : "border border-border-soft bg-surface text-foreground hover:border-brand-400 hover:shadow-[0_4px_16px_rgba(108,77,255,0.25)]"
      )}
    >
      <span className="relative block h-3.5 w-5">
        <motion.span
          className="absolute left-0 top-0 block h-[2.5px] w-full rounded-full bg-current"
          animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={barTransition}
        />
        <motion.span
          className="absolute left-0 top-1.5 block h-[2.5px] w-full rounded-full bg-current"
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.18 }}
        />
        <motion.span
          className="absolute left-0 bottom-0 block h-[2.5px] w-[70%] rounded-full bg-current"
          animate={open ? { y: -6, rotate: -45, width: "100%" } : { y: 0, rotate: 0, width: "70%" }}
          transition={barTransition}
        />
      </span>
    </motion.button>
  );
}

/* ── Mobile menu sheet ──────────────────────────────────────────────── */

const listVariants: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: 32, filter: "blur(4px)" },
  open: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

function MobileMenu({
  open,
  pathname,
  user,
  onClose,
}: {
  open: boolean;
  pathname: string;
  user: NavUser;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 top-28 z-40 bg-black/45 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.97, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-x-3 top-32 z-50 origin-top overflow-hidden rounded-3xl border border-border-soft bg-surface shadow-[var(--shadow-lift)]"
          >
            {/* ambient gradient glow inside the sheet */}
            <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(108,77,255,0.22),transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.18),transparent_70%)]" />

            <motion.div
              variants={listVariants}
              initial="closed"
              animate="open"
              className="relative max-h-[calc(100dvh-9.75rem)] overflow-y-auto overscroll-contain px-4 pb-5 pt-4"
            >
              <motion.p variants={itemVariants} className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                Explore
              </motion.p>

              <div className="flex flex-col gap-1">
                {mobileTopLinks.map((link) => (
                  <MobileNavItem key={link.href} link={link} active={pathname === link.href} />
                ))}
              </div>

              <motion.div variants={itemVariants} className="my-3 flex items-center gap-3 px-2">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border-soft to-transparent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] brand-gradient-text">Services</span>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border-soft to-transparent" />
              </motion.div>

              <div className="flex flex-col gap-1.5">
                {mobileMegaGroups.map((group) => (
                  <MobileAccordionGroup key={group.id} group={group} pathname={pathname} />
                ))}
                <MobileNavItem link={mobileAstrologyLink} active={pathname === mobileAstrologyLink.href} />
                <MobileNavItem link={mobileServicesIndexLink} active={pathname === mobileServicesIndexLink.href} />
              </div>

              <motion.div variants={itemVariants} className="my-3 flex items-center gap-3 px-2">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border-soft to-transparent" />
              </motion.div>

              <div className="flex flex-col gap-1">
                {mobileAfterLinks.map((link) => (
                  <MobileNavItem key={link.href} link={link} active={pathname === link.href} />
                ))}
                <MobileNavItem link={mobileContactLink} active={pathname === mobileContactLink.href} />
              </div>

              <motion.div variants={itemVariants} className="mt-4 flex flex-col gap-2 border-t border-border-soft pt-4">
                {user ? (
                  <MobileUserActions user={user} />
                ) : (
                  <>
                    <Button href="/signup" variant="primary" icon={<Rocket className="h-4 w-4" />}>
                      Get started — it&apos;s free
                    </Button>
                    <Button href="/login" variant="secondary" icon={<LogIn className="h-4 w-4" />}>
                      Log in
                    </Button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Accordion for a mega-menu category inside the mobile sheet — tap the
 * header to expand/collapse its sub-links, touch-friendly hit targets throughout. */
function MobileAccordionGroup({ group, pathname }: { group: MobileGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const Icon = group.icon;
  const hasActive = group.items.some((i) => i.href === pathname);

  return (
    <motion.div variants={itemVariants}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3.5 rounded-2xl px-3 py-2.5 transition-all duration-200 active:scale-[0.98]",
          hasActive
            ? "bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-900/25 dark:ring-brand-700/50"
            : "hover:bg-surface-2"
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center">
          <Icon className="h-8 w-8" />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className={cn("block text-sm font-semibold", hasActive && "text-brand-500")}>{group.label}</span>
          <span className="block truncate text-xs text-muted">{group.items.length} services</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform duration-300",
            open && "rotate-180",
            hasActive && "text-brand-500"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 py-1 pl-4">
              {group.items.map((link) => (
                <MobileSubNavItem key={link.href} link={link} active={pathname === link.href} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MobileSubNavItem({ link, active }: { link: MobileLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 active:scale-[0.98]",
        active
          ? "bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-900/25 dark:ring-brand-700/50"
          : "hover:bg-surface-2"
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm font-medium", active && "text-brand-500")}>{link.label}</span>
        {link.desc && <span className="block truncate text-xs text-muted">{link.desc}</span>}
      </span>
    </Link>
  );
}

function MobileNavItem({ link, active }: { link: MobileLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={link.href}
        className={cn(
          "group flex items-center gap-3.5 rounded-2xl px-3 py-2.5 transition-all duration-200 active:scale-[0.98]",
          active
            ? "bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-900/25 dark:ring-brand-700/50"
            : "hover:bg-surface-2"
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <Icon className="h-8 w-8" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block text-sm font-semibold", active && "text-brand-500")}>{link.label}</span>
          {link.desc && <span className="block truncate text-xs text-muted">{link.desc}</span>}
        </span>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-all duration-300",
            active ? "text-brand-500" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
          )}
        />
      </Link>
    </motion.div>
  );
}

function NavHeaderLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
        active ? "text-brand-500" : "text-foreground/80 hover:text-foreground"
      )}
    >
      {children}
      <span
        className={cn(
          "pointer-events-none absolute inset-x-3.5 -bottom-0.5 h-[3px] origin-center rounded-full brand-gradient-bg transition-transform duration-300 ease-out",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}

function MobileUserActions({ user }: { user: ProfileUser }) {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <>
      <Button href="/dashboard" variant="primary" icon={<LayoutDashboard className="h-4 w-4" />}>
        Dashboard
      </Button>
      {user.role === "ADMIN" && (
        <Button href="/admin" variant="secondary" icon={<ShieldCheck className="h-4 w-4" />}>
          Admin
        </Button>
      )}
      {user.role === "MENTOR" && (
        <Button href="/mentor" variant="secondary" icon={<AnimatedVideoCamera className="h-4 w-4" />}>
          Mentor dashboard
        </Button>
      )}
      <Button variant="ghost" onClick={handleLogout} icon={<LogOut className="h-4 w-4" />} className="text-danger hover:bg-danger/10">
        Log out
      </Button>
    </>
  );
}

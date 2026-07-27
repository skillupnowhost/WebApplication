"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ComponentType, CSSProperties } from "react";
import { AnimatedHome } from "@/components/ui/icons/AnimatedHome";
import { AnimatedBook } from "@/components/ui/icons/AnimatedBook";
import { AnimatedBriefcase } from "@/components/ui/icons/AnimatedBriefcase";
import { AnimatedFolder } from "@/components/ui/icons/AnimatedFolder";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";
import { AnimatedMail } from "@/components/ui/icons/AnimatedMail";
import { AnimatedUser } from "@/components/ui/icons/AnimatedUser";
import { AnimatedUsers } from "@/components/ui/icons/AnimatedUsers";
import { AnimatedCalendar } from "@/components/ui/icons/AnimatedCalendar";
import { AnimatedGraduation } from "@/components/ui/icons/AnimatedGraduation";
import { AnimatedMegaphone } from "@/components/ui/icons/AnimatedMegaphone";
import { AnimatedCode } from "@/components/ui/icons/AnimatedCode";
import { AnimatedMoonStar } from "@/components/ui/icons/AnimatedMoonStar";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

type TabItem = {
  key: string;
  label: string;
  icon: IconComponent;
  href?: string;
  isActive: (pathname: string) => boolean;
};

type PopupLink = { href: string; label: string; desc: string; icon: IconComponent };
type PopupGroup = { title: string; items: PopupLink[] };

// Kept in sync with the desktop mega-menu / mobile sheet grouping in Navbar.tsx.
const servicesPopupGroups: PopupGroup[] = [
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
      { href: "/services/digital-marketing", label: "Digital Marketing", desc: "AI-driven growth campaigns", icon: AnimatedMegaphone },
      { href: "/services/app-web-development", label: "App & Web Development", desc: "Full-stack builds, premium UX", icon: AnimatedCode },
    ],
  },
];

const servicesPopupAstrology: PopupLink = {
  href: "/astrology",
  label: "Astrology",
  desc: "Your divine horoscope",
  icon: AnimatedMoonStar,
};

const servicesPopupAllLink: PopupLink = {
  href: "/services",
  label: "All services",
  desc: "See everything we offer",
  icon: AnimatedLayers,
};

const isServicesPath = (p: string) =>
  p.startsWith("/services") || p === "/tutoring" || p === "/mentoring" || p === "/events" || p === "/astrology";

export function MobileBottomNav({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    setServicesOpen(false);
  }, [pathname]);

  const tabs: TabItem[] = [
    { key: "home", label: "Home", icon: AnimatedHome, href: "/", isActive: (p) => p === "/" },
    { key: "courses", label: "Courses", icon: AnimatedBook, href: "/courses", isActive: (p) => p.startsWith("/courses") },
    { key: "internships", label: "Internship", icon: AnimatedBriefcase, href: "/internships", isActive: (p) => p.startsWith("/internships") },
    { key: "projects", label: "Projects", icon: AnimatedFolder, href: "/projects", isActive: (p) => p.startsWith("/projects") },
    { key: "services", label: "Services", icon: AnimatedLayers, isActive: isServicesPath },
    { key: "contact", label: "Contact", icon: AnimatedMail, href: "/contact", isActive: (p) => p.startsWith("/contact") },
    {
      key: "profile",
      label: "Profile",
      icon: AnimatedUser,
      href: loggedIn ? "/dashboard" : "/login",
      isActive: (p) => p.startsWith("/dashboard") || p.startsWith("/login") || p.startsWith("/signup"),
    },
  ];

  return (
    <>
      {/* Spacer so page content and footer aren't hidden behind the fixed bar */}
      <div className="h-[4.5rem] lg:hidden" aria-hidden />

      {/* Services popup */}
      <AnimatePresence>
        {servicesOpen && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setServicesOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="fixed inset-x-3 z-50 origin-bottom overflow-hidden rounded-3xl border border-border-soft bg-surface p-2 shadow-[var(--shadow-lift)]"
              style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
            >
              <div className="pointer-events-none absolute -top-20 -right-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(108,77,255,0.2),transparent_70%)]" />
              <div className="max-h-[62vh] overflow-y-auto overscroll-contain">
                {servicesPopupGroups.map((group) => (
                  <div key={group.title}>
                    <p className="px-3.5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] brand-gradient-text">
                      {group.title}
                    </p>
                    {group.items.map((s) => (
                      <PopupLinkRow key={s.href} link={s} active={pathname === s.href} />
                    ))}
                  </div>
                ))}
                <p className="px-3.5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] brand-gradient-text">
                  Astrology
                </p>
                <PopupLinkRow link={servicesPopupAstrology} active={pathname === servicesPopupAstrology.href} />

                <div className="mt-1 border-t border-border-soft pt-1">
                  <Link
                    href={servicesPopupAllLink.href}
                    className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-medium text-brand-500 transition-colors duration-150 hover:bg-surface-2"
                  >
                    {servicesPopupAllLink.label}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom tab bar */}
      <nav
        aria-label="Primary mobile navigation"
        className="glass-nav fixed inset-x-0 bottom-0 z-50 border-t border-border-soft shadow-[0_-8px_30px_rgba(15,15,35,0.08)] lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid h-[4.5rem] max-w-3xl grid-cols-7 items-stretch px-1">
          {tabs.map((tab) => {
            const active = tab.key === "services" ? servicesOpen || isServicesPath(pathname) : tab.isActive(pathname);
            return tab.href ? (
              <TabButton key={tab.key} tab={tab} active={active} href={tab.href} />
            ) : (
              <TabButton key={tab.key} tab={tab} active={active} onClick={() => setServicesOpen((o) => !o)} />
            );
          })}
        </div>
      </nav>
    </>
  );
}

function PopupLinkRow({ link, active }: { link: PopupLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      className={cn(
        "group flex items-center gap-3.5 rounded-2xl px-3 py-2.5 transition-all duration-200 active:scale-[0.98]",
        active
          ? "bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-900/25 dark:ring-brand-700/50"
          : "hover:bg-surface-2"
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
        <Icon className="h-8 w-8" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm font-semibold", active && "text-brand-500")}>{link.label}</span>
        <span className="block truncate text-xs text-muted">{link.desc}</span>
      </span>
    </Link>
  );
}

function TabButton({
  tab,
  active,
  href,
  onClick,
}: {
  tab: TabItem;
  active: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const Icon = tab.icon;
  const content = (
    <>
      {active && (
        <motion.span
          layoutId="bottom-nav-pill"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="absolute inset-x-0.5 inset-y-1.5 rounded-2xl bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-900/25 dark:ring-brand-700/50"
        />
      )}
      <motion.span
        animate={active ? { y: -1, scale: 1.08 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        className="relative flex h-7 w-7 items-center justify-center"
      >
        <Icon className="h-6 w-6" />
      </motion.span>
      <span
        className={cn(
          "relative max-w-full truncate text-[9px] font-semibold leading-none tracking-tight transition-colors duration-200",
          active ? "text-brand-500" : "text-muted"
        )}
      >
        {tab.label}
      </span>
    </>
  );

  const className =
    "relative flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 transition-transform duration-150 active:scale-95 cursor-pointer";

  return href ? (
    <Link href={href} className={className} aria-current={active ? "page" : undefined}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className} aria-expanded={active}>
      {content}
    </button>
  );
}

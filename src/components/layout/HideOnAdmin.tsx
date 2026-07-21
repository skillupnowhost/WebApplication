"use client";

import { usePathname } from "next/navigation";

/** The admin panel and print-only routes (e.g. PDF rendering) bring their own layout — suppress the site chrome there. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  if (pathname.endsWith("/print")) return null;
  return <>{children}</>;
}

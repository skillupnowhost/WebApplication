import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Mentor dashboard — MyLoginn" };

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "MENTOR") redirect("/dashboard");

  return <>{children}</>;
}

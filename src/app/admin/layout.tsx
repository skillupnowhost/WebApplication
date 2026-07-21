import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Admin — MyLoginn" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <AdminShell
      user={{ name: user.name, email: user.email, avatarColor: user.avatarColor, avatarUrl: user.avatarUrl }}
    >
      {children}
    </AdminShell>
  );
}

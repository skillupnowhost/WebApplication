import { AuthSettingsForm } from "@/components/admin/AuthSettingsForm";

export const metadata = { title: "Authentication Settings — MyLoginn Admin" };

export default function AdminAuthSettingsPage() {
  return (
    <div>
      <p className="mb-5 max-w-2xl text-sm text-muted">
        Visibility into the authentication knobs already baked into the codebase.
      </p>
      <AuthSettingsForm />
    </div>
  );
}

import { SystemSettingsForm } from "@/components/admin/SystemSettingsForm";

export const metadata = { title: "System Settings — MyLoginn Admin" };

export default function AdminSettingsPage() {
  return (
    <div>
      <p className="mb-5 max-w-2xl text-sm text-muted">
        Site-wide toggles and defaults. Fields flagged below are persisted but not yet consumed elsewhere in the app.
      </p>
      <SystemSettingsForm />
    </div>
  );
}

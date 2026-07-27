import { ComposeNotificationForm } from "@/components/admin/ComposeNotificationForm";
import { EntityScreen } from "@/components/admin/EntityScreen";

export const metadata = { title: "Notifications — MyLoginn Admin" };

export default function AdminNotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ComposeNotificationForm />
      <EntityScreen entity="notifications" />
    </div>
  );
}

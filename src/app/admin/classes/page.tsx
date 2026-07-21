import { EntityScreen } from "@/components/admin/EntityScreen";
import { AdminClassesCalendar } from "@/components/classes/AdminClassesCalendar";

export const metadata = { title: "Classes — Admin — MyLoginn" };

export default function AdminClassesPage() {
  return (
    <div className="flex flex-col gap-8">
      <AdminClassesCalendar />
      <EntityScreen entity="classes" />
    </div>
  );
}

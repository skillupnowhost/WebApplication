import { EntityScreen } from "@/components/admin/EntityScreen";

export const metadata = { title: "Horoscope Reports — MyLoginn Admin" };

export default function AdminAstrologyPage() {
  return <EntityScreen entity="astrologyReports" />;
}

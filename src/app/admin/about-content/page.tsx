import { AboutContentForm } from "@/components/admin/AboutContentForm";

export const metadata = { title: "About Page Content — MyLoginn Admin" };

export default function AdminAboutContentPage() {
  return (
    <div>
      <p className="mb-5 max-w-2xl text-sm text-muted">
        The hero title, tagline, overview and mission shown at the top of the public About Us page.
      </p>
      <AboutContentForm />
    </div>
  );
}

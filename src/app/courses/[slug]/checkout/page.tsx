import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CheckoutPanel } from "@/components/courses/CheckoutPanel";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/courses/${slug}/checkout`);

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (enrollment) redirect(`/courses/${slug}`);

  return (
    <Section className="relative overflow-hidden pt-14 sm:pt-14">
      <div className="aurora-blob -left-16 top-8 h-56 w-56 bg-brand-400/15" aria-hidden />
      <div className="aurora-blob aurora-blob-alt -right-16 bottom-0 h-56 w-56 bg-accent-400/12" aria-hidden />
      <Container className="relative">
        <div className="mx-auto max-w-xl">
          <Breadcrumbs
            items={[
              { label: "Courses", href: "/courses" },
              { label: course.title, href: `/courses/${course.slug}` },
              { label: "Checkout" },
            ]}
            className="mb-6"
          />
          <CheckoutPanel
            course={{
              id: course.id,
              slug: course.slug,
              title: course.title,
              category: course.category,
              price: course.price,
              originalPrice: course.originalPrice,
            }}
          />
        </div>
      </Container>
    </Section>
  );
}

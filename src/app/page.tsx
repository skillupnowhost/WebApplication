import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/sections/HeroSection";
import { ModulesSection } from "@/components/sections/ModulesSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [showcaseProjects, testimonials] = await Promise.all([
    prisma.showcaseProject.findMany({ orderBy: { sortOrder: "asc" }, take: 8 }),
    prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 8 }),
  ]);

  return (
    <>
      <HeroSection />
      <ModulesSection />
      <FeaturesSection />
      <PortfolioShowcase
        projects={showcaseProjects.map((p) => ({
          id: p.id,
          title: p.title,
          student: p.student,
          result: p.result,
          description: p.description,
          tags: p.tags.split(",").map((t) => t.trim()).filter(Boolean),
          mentor: p.mentor,
        }))}
      />
      <ProcessTimeline />
      <TestimonialsSection
        testimonials={testimonials.map((t) => ({
          id: t.id,
          quote: t.quote,
          authorName: t.authorName,
          authorRole: t.authorRole,
          avatarUrl: t.avatarUrl ?? "",
          rating: t.rating,
        }))}
      />
      <CTASection />
    </>
  );
}

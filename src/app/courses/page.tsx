import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Section, Container } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CoursesHero } from "@/components/courses/CoursesHero";
import { CoursesExplorer } from "@/components/courses/CoursesExplorer";
import type { CourseCardData } from "@/components/courses/CourseCard";

export const metadata = { title: "Courses — MyLoginn" };

export default async function CoursesPage() {
  const [user, courses] = await Promise.all([
    getCurrentUser(),
    prisma.course.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const enrollments = user
    ? await prisma.enrollment.findMany({ where: { userId: user.id } })
    : [];
  const enrolledIds = enrollments.map((e) => e.courseId);

  const cards: CourseCardData[] = courses.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    category: c.category,
    level: c.level,
    description: c.description,
    instructor: c.instructor,
    instructorTitle: c.instructorTitle,
    durationWeeks: c.durationWeeks,
    price: c.price,
    originalPrice: c.originalPrice,
    rating: c.rating,
    studentsCount: c.studentsCount,
    imageColor: c.imageColor,
    tags: JSON.parse(c.tags) as string[],
  }));

  const recommendedIds = user
    ? courses
        .filter((c) => c.featured && !enrolledIds.includes(c.id))
        .slice(0, 3)
        .map((c) => c.id)
    : [];

  const trendingIds = [...courses]
    .sort((a, b) => b.studentsCount - a.studentsCount)
    .slice(0, 3)
    .map((c) => c.id);

  const categories = [...new Set(cards.map((c) => c.category))];
  const instructors = [...new Set(cards.map((c) => c.instructor))];
  const studentsCount = cards.reduce((sum, c) => sum + c.studentsCount, 0);
  const avgRating = cards.length ? cards.reduce((sum, c) => sum + c.rating, 0) / cards.length : 0;

  return (
    <>
      <CoursesHero
        courseCount={cards.length}
        studentsCount={studentsCount}
        avgRating={avgRating}
        categories={categories}
        instructors={instructors}
      />

      <Section className="overflow-hidden pt-10 sm:pt-14">
        <Container>
          <Breadcrumbs items={[{ label: "Courses" }]} className="mb-6" />

          <div id="course-catalog" className="scroll-mt-24">
            <CoursesExplorer
              courses={cards}
              enrolledIds={enrolledIds}
              recommendedIds={recommendedIds}
              trendingIds={trendingIds}
              isLoggedIn={!!user}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

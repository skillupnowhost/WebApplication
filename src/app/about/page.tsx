import { prisma } from "@/lib/prisma";
import { AboutHero } from "@/components/about/AboutHero";
import { CompanyStatsSection } from "@/components/about/CompanyStatsSection";
import { TeamSection, type Leader } from "@/components/about/TeamSection";
import { StaffSection } from "@/components/about/StaffSection";
import { PartnersSection } from "@/components/about/PartnersSection";
import { ClientsSection } from "@/components/about/ClientsSection";

export const metadata = { title: "About Us — MyLoginn" };

export const dynamic = "force-dynamic";

function toLeader(m: {
  id: string;
  name: string;
  role: string;
  bio: string;
  category: "FOUNDER" | "CEO" | "STAFF";
  experienceYears: number | null;
  photoUrl: string | null;
  linkedinUrl: string | null;
}): Leader {
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    bio: m.bio,
    category: m.category,
    experienceYears: m.experienceYears,
    photoUrl: m.photoUrl ?? "",
    linkedinUrl: m.linkedinUrl ?? "",
  };
}

export default async function AboutPage() {
  const [content, offerings, team, partners, clients, courseCount, internshipCount, tutorCount, studentCount] =
    await Promise.all([
      prisma.aboutContent.findUnique({ where: { id: "singleton" } }),
      prisma.offering.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] }),
      prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
      prisma.partner.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
      prisma.client.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
      prisma.course.count(),
      prisma.internship.count(),
      prisma.tutor.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
    ]);

  const leaders = team
    .filter((t) => t.category === "FOUNDER" || t.category === "CEO")
    .map(toLeader);
  const staff = team
    .filter((t) => t.category === "STAFF")
    .map((s) => ({ id: s.id, name: s.name, role: s.role, specialization: s.specialization ?? "", photoUrl: s.photoUrl ?? "" }));

  const stats = [
    { label: "Courses", value: courseCount },
    { label: "Internships", value: internshipCount },
    { label: "Mentors & Tutors", value: tutorCount },
    { label: "Learners", value: studentCount },
  ];

  return (
    <>
      <AboutHero
        heroTitle={content?.heroTitle ?? "About MyLoginn"}
        heroTagline={content?.heroTagline ?? ""}
        overview={content?.overview ?? ""}
        mission={content?.mission ?? ""}
        offerings={offerings}
      />
      <CompanyStatsSection stats={stats} />
      <TeamSection leaders={leaders} />
      <StaffSection staff={staff} />
      <PartnersSection
        partners={partners.map((p) => ({ id: p.id, name: p.name, logoUrl: p.logoUrl ?? "", websiteUrl: p.websiteUrl ?? "" }))}
      />
      <ClientsSection
        clients={clients.map((c) => ({
          id: c.id,
          name: c.name,
          logoUrl: c.logoUrl ?? "",
          websiteUrl: c.websiteUrl ?? "",
          description: c.description,
        }))}
      />
    </>
  );
}

import { prisma } from "@/lib/prisma";
import { AboutHero } from "@/components/about/AboutHero";
import { LeadershipSection, type Leader } from "@/components/about/LeadershipSection";
import { StaffSection } from "@/components/about/StaffSection";
import { PartnersSection } from "@/components/about/PartnersSection";
import { ClientsSection } from "@/components/about/ClientsSection";

export const metadata = { title: "About Us — MyLoginn" };

export const dynamic = "force-dynamic";

function toLeader(m: { id: string; name: string; role: string; bio: string; experienceYears: number | null; photoUrl: string | null; linkedinUrl: string | null }): Leader {
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    bio: m.bio,
    experienceYears: m.experienceYears,
    photoUrl: m.photoUrl ?? "",
    linkedinUrl: m.linkedinUrl ?? "",
  };
}

export default async function AboutPage() {
  const [content, offerings, team, partners, clients] = await Promise.all([
    prisma.aboutContent.findUnique({ where: { id: "singleton" } }),
    prisma.offering.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] }),
    prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.partner.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.client.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);

  const founders = team.filter((t) => t.category === "FOUNDER").map(toLeader);
  const ceo = team.find((t) => t.category === "CEO");
  const staff = team
    .filter((t) => t.category === "STAFF")
    .map((s) => ({ id: s.id, name: s.name, role: s.role, specialization: s.specialization ?? "", photoUrl: s.photoUrl ?? "" }));

  return (
    <>
      <AboutHero
        heroTitle={content?.heroTitle ?? "About MyLoginn"}
        heroTagline={content?.heroTagline ?? ""}
        overview={content?.overview ?? ""}
        mission={content?.mission ?? ""}
        offerings={offerings}
      />
      <LeadershipSection founders={founders} ceo={ceo ? toLeader(ceo) : null} />
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

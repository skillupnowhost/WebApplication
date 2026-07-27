import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AboutHero } from "@/components/about/AboutHero";
import { CompanyTimeline } from "@/components/about/CompanyTimeline";
import { TeamSection, type Leader } from "@/components/about/TeamSection";
import { StaffSection, type TeamDepartment } from "@/components/about/StaffSection";
import { PartnersSection } from "@/components/about/PartnersSection";
import { ClientsSection } from "@/components/about/ClientsSection";
import { PillBadge } from "@/components/about/PillBadge";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { type GalleryItemData } from "@/components/gallery/constants";

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
  const [content, team, milestones, partners, clients, galleryRows] = await Promise.all([
    prisma.aboutContent.findUnique({ where: { id: "singleton" } }),
    prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.companyMilestone.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.partner.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.client.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.galleryItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  ]);

  const founders = team.filter((t) => t.category === "FOUNDER").map(toLeader);
  const ceo = team.filter((t) => t.category === "CEO").map(toLeader);
  const staff = team
    .filter((t) => t.category === "STAFF")
    .map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      bio: s.bio,
      specialization: s.specialization ?? "",
      photoUrl: s.photoUrl ?? "",
      linkedinUrl: s.linkedinUrl ?? "",
      department: s.department as TeamDepartment | null,
    }));

  const galleryItems: GalleryItemData[] = galleryRows.map((g) => ({
    id: g.id,
    imageUrl: g.imageUrl,
    caption: g.caption,
    category: g.category,
  }));

  return (
    <>
      <AboutHero
        heroTitle={content?.heroTitle ?? "About MyLoginn"}
        heroTagline={content?.heroTagline ?? ""}
        overview={content?.overview ?? ""}
        sinceYear={milestones[0]?.year}
      />
      <CompanyTimeline
        milestones={milestones.map((m) => ({ id: m.id, year: m.year, title: m.title, description: m.description }))}
      />
      <TeamSection founders={founders} ceo={ceo} />
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
      <Section className="overflow-hidden">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <div className="flex justify-center">
                <PillBadge>Gallery</PillBadge>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Our story in photos</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                Workshops, launches, office life and the wins we celebrate together.
              </p>
              <div className="mx-auto mt-4 h-[3px] w-[80px] rounded-full brand-gradient-bg" />
            </Reveal>
          </div>

          <div className="mt-10">
            <GalleryGrid items={galleryItems} />
          </div>
        </Container>
      </Section>
    </>
  );
}

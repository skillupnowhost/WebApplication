import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { updateClass, deleteClass } from "@/lib/classes";
import { z } from "zod";

/**
 * Server-side registry powering the generic /api/admin/[entity] CRUD routes.
 * Each entity declares how to list (already serialized for the admin tables),
 * and optionally how to create, update and delete records — including the
 * dependent rows that must go with them (SQLite has no ON DELETE CASCADE here).
 */

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(base: string, exists: (slug: string) => Promise<boolean>) {
  const slug = slugify(base);
  return (await exists(slug)) ? `${slug}-${Date.now().toString(36)}` : slug;
}

const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);

/** Tutor.boards / Tutor.grades are stored as JSON string arrays — expose them as "A, B". */
function jsonListToText(raw: string): string {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.join(", ") : raw;
  } catch {
    return raw;
  }
}

function textToJsonList(text: string) {
  return JSON.stringify(
    text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

/* ── Input schemas ──────────────────────────────────────────────────── */

const userCreate = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().nullable(),
  role: z.enum(["STUDENT", "MENTOR", "ADMIN"]).default("STUDENT"),
  password: z.string().min(8),
  emailVerified: z.coerce.boolean().default(false),
});
const userUpdate = userCreate.partial().omit({ password: true }).extend({
  points: z.coerce.number().int().min(0).optional(),
  tutoringTier: z.enum(["FREE", "STANDARD", "PREMIUM"]).optional(),
});

const courseCreate = z.object({
  title: z.string().trim().min(3),
  category: z.string().trim().min(2).max(40),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  description: z.string().trim().min(10),
  instructor: z.string().trim().min(2),
  durationWeeks: z.coerce.number().int().min(1).max(52),
  price: z.coerce.number().int().min(0),
  originalPrice: z.coerce.number().int().min(0).optional().nullable(),
  featured: z.coerce.boolean().default(false),
});
const courseUpdate = courseCreate.partial();

const mentorCreate = z.object({
  name: z.string().trim().min(2),
  subject: z.string().trim().min(2),
  bio: z.string().trim().min(10),
  qualification: z.string().trim().min(2),
  experienceYears: z.coerce.number().int().min(0).max(60),
  rating: z.coerce.number().min(0).max(5).default(4.9),
  boards: z.string().trim().default("CBSE"),
  grades: z.string().trim().default("6th Grade, 7th Grade, 8th Grade, 9th Grade, 10th Grade"),
  userId: z.string().trim().optional().nullable(),
});
const mentorUpdate = mentorCreate.partial();

const internshipCreate = z.object({
  title: z.string().trim().min(3),
  company: z.string().trim().min(2),
  type: z.string().trim().min(2),
  paid: z.coerce.boolean().default(true),
  stipend: z.coerce.number().int().min(0).optional().nullable(),
  location: z.string().trim().min(2),
  durationWeeks: z.coerce.number().int().min(1).max(52),
  description: z.string().trim().min(10),
  requirements: z.string().trim().min(3),
  responsibilities: z.string().trim().min(3),
  mentorName: z.string().trim().min(2),
  mentorEmail: z.string().trim().email(),
  applyDeadline: z.coerce.date(),
  featured: z.coerce.boolean().default(false),
});
const internshipUpdate = internshipCreate.partial();

const enrollmentUpdate = z.object({
  progress: z.coerce.number().int().min(0).max(100).optional(),
  status: z.enum(["active", "completed", "paused"]).optional(),
});

const applicationUpdate = z.object({
  status: z.enum(["submitted", "under_review", "accepted", "rejected"]),
});

const projectUpdate = z.object({
  title: z.string().trim().min(3).optional(),
  status: z.enum(["in_progress", "completed", "on_hold"]).optional(),
  progress: z.coerce.number().int().min(0).max(100).optional(),
  feedback: z.string().trim().optional().nullable(),
});

const bookingUpdate = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  notes: z.string().trim().optional().nullable(),
});

const classUpdate = z.object({
  title: z.string().trim().min(3).optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"]).optional(),
  recordingAccessTier: z.enum(["FREE", "STANDARD", "PREMIUM"]).optional(),
});

const leadUpdate = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

const paymentUpdate = z.object({
  status: z.enum(["created", "paid", "failed", "refunded"]),
});

/* ── Registry ───────────────────────────────────────────────────────── */

type Row = Record<string, unknown>;

export type EntityDef = {
  list: () => Promise<Row[]>;
  create?: (body: unknown) => Promise<Row>;
  update?: (id: string, body: unknown) => Promise<Row>;
  remove?: (id: string) => Promise<void>;
};

export const adminEntities: Record<string, EntityDef> = {
  users: {
    list: async () => {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { enrollments: true, projects: true } } },
      });
      return users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone ?? "—",
        role: u.role,
        emailVerified: u.emailVerified,
        points: u.points,
        streak: u.currentStreak,
        tutoringTier: u.tutoringTier,
        enrollments: u._count.enrollments,
        projects: u._count.projects,
        createdAt: iso(u.createdAt),
      }));
    },
    create: async (body) => {
      const data = userCreate.parse(body);
      const passwordHash = await hashPassword(data.password);
      return prisma.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          phone: data.phone || null,
          role: data.role,
          emailVerified: data.emailVerified,
          passwordHash,
        },
        select: { id: true },
      });
    },
    update: async (id, body) => {
      const data = userUpdate.parse(body);
      return prisma.user.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.email !== undefined && { email: data.email.toLowerCase() }),
          ...(data.phone !== undefined && { phone: data.phone || null }),
          ...(data.role !== undefined && { role: data.role }),
          ...(data.emailVerified !== undefined && { emailVerified: data.emailVerified }),
          ...(data.points !== undefined && { points: data.points }),
          ...(data.tutoringTier !== undefined && { tutoringTier: data.tutoringTier }),
        },
        select: { id: true },
      });
    },
    remove: async (id) => {
      await prisma.$transaction([
        prisma.enrollment.deleteMany({ where: { userId: id } }),
        prisma.internshipApplication.deleteMany({ where: { userId: id } }),
        prisma.tutoringBooking.deleteMany({ where: { userId: id } }),
        prisma.payment.deleteMany({ where: { userId: id } }),
        prisma.notification.deleteMany({ where: { userId: id } }),
        prisma.otpCode.deleteMany({ where: { userId: id } }),
        prisma.dailyActivity.deleteMany({ where: { userId: id } }),
        prisma.pointsTransaction.deleteMany({ where: { userId: id } }),
        prisma.project.updateMany({ where: { mentorId: id }, data: { mentorId: null } }),
        prisma.project.deleteMany({ where: { userId: id } }),
        prisma.user.delete({ where: { id } }),
      ]);
    },
  },

  courses: {
    list: async () => {
      const courses = await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { enrollments: true } } },
      });
      return courses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        level: c.level,
        instructor: c.instructor,
        durationWeeks: c.durationWeeks,
        price: c.price,
        featured: c.featured,
        students: c._count.enrollments,
        rating: c.rating,
        createdAt: iso(c.createdAt),
        // raw fields the edit form needs
        description: c.description,
        originalPrice: c.originalPrice,
      }));
    },
    create: async (body) => {
      const data = courseCreate.parse(body);
      const slug = await uniqueSlug(data.title, async (s) =>
        Boolean(await prisma.course.findUnique({ where: { slug: s } }))
      );
      return prisma.course.create({
        data: { ...data, slug, tags: JSON.stringify([]), syllabus: JSON.stringify([]) },
        select: { id: true },
      });
    },
    update: async (id, body) => {
      const data = courseUpdate.parse(body);
      return prisma.course.update({ where: { id }, data, select: { id: true } });
    },
    remove: async (id) => {
      await prisma.$transaction([
        prisma.enrollment.deleteMany({ where: { courseId: id } }),
        prisma.payment.deleteMany({ where: { courseId: id } }),
        prisma.course.delete({ where: { id } }),
      ]);
    },
  },

  categories: {
    // Fully dynamic: a category exists exactly as long as a course uses it.
    list: async () => {
      const grouped = await prisma.course.groupBy({
        by: ["category"],
        _count: { _all: true },
        orderBy: { _count: { category: "desc" } },
      });
      return grouped.map((g) => ({ id: g.category, name: g.category, courses: g._count._all }));
    },
    // Renaming a category moves every course that uses it.
    update: async (id, body) => {
      const { name } = z.object({ name: z.string().trim().min(2).max(40) }).parse(body);
      await prisma.course.updateMany({ where: { category: id }, data: { category: name } });
      return { id: name };
    },
  },

  mentors: {
    list: async () => {
      const tutors = await prisma.tutor.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { bookings: true } }, user: { select: { name: true, email: true } } },
      });
      return tutors.map((t) => ({
        id: t.id,
        name: t.name,
        subject: t.subject,
        qualification: t.qualification,
        experienceYears: t.experienceYears,
        rating: t.rating,
        boards: jsonListToText(t.boards),
        grades: jsonListToText(t.grades),
        bookings: t._count.bookings,
        bio: t.bio,
        userId: t.userId,
        account: t.user ? `${t.user.name} (${t.user.email})` : "— not linked —",
      }));
    },
    create: async (body) => {
      const { userId, ...data } = mentorCreate.parse(body);
      return prisma.tutor.create({
        data: {
          ...data,
          boards: textToJsonList(data.boards),
          grades: textToJsonList(data.grades),
          userId: userId || null,
        },
        select: { id: true },
      });
    },
    update: async (id, body) => {
      const { userId, ...data } = mentorUpdate.parse(body);
      return prisma.tutor.update({
        where: { id },
        data: {
          ...data,
          ...(data.boards !== undefined && { boards: textToJsonList(data.boards) }),
          ...(data.grades !== undefined && { grades: textToJsonList(data.grades) }),
          ...(userId !== undefined && { userId: userId || null }),
        },
        select: { id: true },
      });
    },
    remove: async (id) => {
      await prisma.$transaction([
        prisma.classBooking.deleteMany({ where: { tutorClass: { tutorId: id } } }),
        prisma.classRecording.deleteMany({ where: { tutorClass: { tutorId: id } } }),
        prisma.tutorClass.deleteMany({ where: { tutorId: id } }),
        prisma.tutoringBooking.deleteMany({ where: { tutorId: id } }),
        prisma.tutor.delete({ where: { id } }),
      ]);
    },
  },

  enrollments: {
    list: async () => {
      const rows = await prisma.enrollment.findMany({
        orderBy: { enrolledAt: "desc" },
        include: { user: { select: { name: true, email: true } }, course: { select: { title: true, category: true } } },
      });
      return rows.map((e) => ({
        id: e.id,
        user: e.user.name,
        email: e.user.email,
        course: e.course.title,
        category: e.course.category,
        progress: e.progress,
        status: e.status,
        enrolledAt: iso(e.enrolledAt),
      }));
    },
    update: async (id, body) => {
      const data = enrollmentUpdate.parse(body);
      return prisma.enrollment.update({ where: { id }, data, select: { id: true } });
    },
    remove: async (id) => {
      await prisma.enrollment.delete({ where: { id } });
    },
  },

  internships: {
    list: async () => {
      const rows = await prisma.internship.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { applications: true } } },
      });
      return rows.map((i) => ({
        id: i.id,
        title: i.title,
        company: i.company,
        type: i.type,
        paid: i.paid,
        stipend: i.stipend,
        location: i.location,
        durationWeeks: i.durationWeeks,
        applications: i._count.applications,
        applyDeadline: iso(i.applyDeadline),
        featured: i.featured,
        description: i.description,
        requirements: i.requirements,
        responsibilities: i.responsibilities,
        mentorName: i.mentorName,
        mentorEmail: i.mentorEmail,
      }));
    },
    create: async (body) => {
      const data = internshipCreate.parse(body);
      const slug = await uniqueSlug(data.title, async (s) =>
        Boolean(await prisma.internship.findUnique({ where: { slug: s } }))
      );
      return prisma.internship.create({ data: { ...data, slug }, select: { id: true } });
    },
    update: async (id, body) => {
      const data = internshipUpdate.parse(body);
      return prisma.internship.update({ where: { id }, data, select: { id: true } });
    },
    remove: async (id) => {
      await prisma.$transaction([
        prisma.internshipApplication.deleteMany({ where: { internshipId: id } }),
        prisma.internship.delete({ where: { id } }),
      ]);
    },
  },

  applications: {
    list: async () => {
      const rows = await prisma.internshipApplication.findMany({
        orderBy: { appliedAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          internship: { select: { title: true, company: true } },
        },
      });
      return rows.map((a) => ({
        id: a.id,
        applicant: a.user.name,
        email: a.user.email,
        internship: a.internship.title,
        company: a.internship.company,
        status: a.status,
        coverNote: a.coverNote,
        appliedAt: iso(a.appliedAt),
      }));
    },
    update: async (id, body) => {
      const data = applicationUpdate.parse(body);
      return prisma.internshipApplication.update({ where: { id }, data, select: { id: true } });
    },
    remove: async (id) => {
      await prisma.internshipApplication.delete({ where: { id } });
    },
  },

  projects: {
    list: async () => {
      const rows = await prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        include: { user: { select: { name: true } }, mentor: { select: { name: true } } },
      });
      return rows.map((p) => ({
        id: p.id,
        title: p.title,
        student: p.user.name,
        mentor: p.mentor?.name ?? "—",
        status: p.status,
        progress: p.progress,
        feedback: p.feedback,
        dueDate: iso(p.dueDate),
        updatedAt: iso(p.updatedAt),
      }));
    },
    update: async (id, body) => {
      const data = projectUpdate.parse(body);
      return prisma.project.update({ where: { id }, data, select: { id: true } });
    },
    remove: async (id) => {
      await prisma.project.delete({ where: { id } });
    },
  },

  tutoring: {
    list: async () => {
      const rows = await prisma.tutoringBooking.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } }, tutor: { select: { name: true } } },
      });
      return rows.map((b) => ({
        id: b.id,
        student: b.user.name,
        email: b.user.email,
        tutor: b.tutor.name,
        subject: b.subject,
        grade: b.grade,
        board: b.board,
        slot: b.preferredSlot,
        status: b.status,
        notes: b.notes,
        createdAt: iso(b.createdAt),
      }));
    },
    update: async (id, body) => {
      const data = bookingUpdate.parse(body);
      return prisma.tutoringBooking.update({ where: { id }, data, select: { id: true } });
    },
    remove: async (id) => {
      await prisma.tutoringBooking.delete({ where: { id } });
    },
  },

  classes: {
    list: async () => {
      const rows = await prisma.tutorClass.findMany({
        orderBy: { startsAt: "desc" },
        include: { tutor: { select: { name: true } }, _count: { select: { bookings: true, recordings: true } } },
      });
      return rows.map((c) => ({
        id: c.id,
        title: c.title,
        mentor: c.tutor.name,
        subject: c.subject,
        startsAt: iso(c.startsAt),
        endsAt: iso(c.endsAt),
        status: c.status,
        recordingAccessTier: c.recordingAccessTier,
        joinUrl: c.joinUrl,
        googleEventLink: c.googleEventLink,
        bookings: c._count.bookings,
        recordings: c._count.recordings,
      }));
    },
    update: async (id, body) => {
      const data = classUpdate.parse(body);
      const updated = await updateClass(id, data);
      return { id: updated.id };
    },
    remove: async (id) => {
      await deleteClass(id);
    },
  },

  leads: {
    list: async () => {
      const rows = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        company: l.company ?? "—",
        service: l.service,
        message: l.message,
        status: l.status,
        createdAt: iso(l.createdAt),
      }));
    },
    update: async (id, body) => {
      const data = leadUpdate.parse(body);
      return prisma.lead.update({ where: { id }, data, select: { id: true } });
    },
    remove: async (id) => {
      await prisma.lead.delete({ where: { id } });
    },
  },

  payments: {
    list: async () => {
      const rows = await prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } },
      });
      return rows.map((p) => ({
        id: p.id,
        user: p.user.name,
        email: p.user.email,
        course: p.course.title,
        amount: p.amount / 100,
        currency: p.currency,
        orderId: p.razorpayOrderId,
        status: p.status,
        createdAt: iso(p.createdAt),
      }));
    },
    update: async (id, body) => {
      const data = paymentUpdate.parse(body);
      return prisma.payment.update({ where: { id }, data, select: { id: true } });
    },
    remove: async (id) => {
      await prisma.payment.delete({ where: { id } });
    },
  },
};

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

type Datum = { label: string; value: number };

/** Last `weeks` calendar weeks (oldest first), each a [start, end) range plus a short label. */
function weekBuckets(weeks: number) {
  const now = new Date();
  const buckets: { start: Date; end: Date; label: string }[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const end = new Date(now.getTime() - i * WEEK_MS);
    const start = new Date(end.getTime() - WEEK_MS);
    buckets.push({ start, end, label: start.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) });
  }
  return buckets;
}

/** Last `months` calendar months (oldest first). */
function monthBuckets(months: number) {
  const now = new Date();
  const buckets: { start: Date; end: Date; label: string }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    buckets.push({ start, end, label: start.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }) });
  }
  return buckets;
}

function bucketCounts<T extends { start: Date; end: Date; label: string }>(
  buckets: T[],
  dates: Date[]
): Datum[] {
  return buckets.map((b) => ({
    label: b.label,
    value: dates.filter((d) => d >= b.start && d < b.end).length,
  }));
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const weeks = weekBuckets(8);
  const months = monthBuckets(6);
  const earliestNeeded = weeks[0].start < months[0].start ? weeks[0].start : months[0].start;

  const [
    enrollmentsForTrend,
    usersForTrend,
    enrollmentsByCourseRaw,
    paymentStatusRaw,
    applicationStatusRaw,
    tutoringStatusRaw,
    courseRatingAgg,
    categoryRows,
    enrollmentStatusRaw,
    paymentTotals,
  ] = await Promise.all([
    prisma.enrollment.findMany({ where: { enrolledAt: { gte: earliestNeeded } }, select: { enrolledAt: true } }),
    prisma.user.findMany({ where: { createdAt: { gte: earliestNeeded } }, select: { createdAt: true } }),
    prisma.enrollment.groupBy({
      by: ["courseId"],
      _count: { _all: true },
      orderBy: { _count: { courseId: "desc" } },
      take: 8,
    }),
    prisma.payment.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.internshipApplication.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.tutoringBooking.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.course.aggregate({ _avg: { rating: true } }),
    prisma.course.findMany({ select: { category: true } }),
    prisma.enrollment.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.payment.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const courseTitles = await prisma.course.findMany({
    where: { id: { in: enrollmentsByCourseRaw.map((r) => r.courseId) } },
    select: { id: true, title: true },
  });
  const titleById = new Map(courseTitles.map((c) => [c.id, c.title]));
  const enrollmentsByCourse: Datum[] = enrollmentsByCourseRaw.map((r) => ({
    label: titleById.get(r.courseId) ?? "Unknown course",
    value: r._count._all,
  }));

  const weeklyEnrollments = bucketCounts(weeks, enrollmentsForTrend.map((e) => e.enrolledAt));
  const monthlySignups = bucketCounts(months, usersForTrend.map((u) => u.createdAt));

  const STATUS_LABELS: Record<string, string> = {
    created: "Created",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
    submitted: "Submitted",
    under_review: "Under review",
    accepted: "Accepted",
    rejected: "Rejected",
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    active: "Active",
    paused: "Paused",
  };
  const toDatums = (rows: { status: string; _count: { _all: number } }[]): Datum[] =>
    rows.map((r) => ({ label: STATUS_LABELS[r.status] ?? r.status, value: r._count._all }));

  const paymentStatusBreakdown = toDatums(paymentStatusRaw);
  const applicationStatusBreakdown = toDatums(applicationStatusRaw);
  const tutoringStatusBreakdown = toDatums(tutoringStatusRaw);
  const enrollmentStatusBreakdown = toDatums(enrollmentStatusRaw);

  const activeCategories = new Set(categoryRows.map((c) => c.category)).size;

  const totalEnrollmentCount = enrollmentStatusRaw.reduce((s, r) => s + r._count._all, 0);
  const completedEnrollmentCount = enrollmentStatusRaw.find((r) => r.status === "completed")?._count._all ?? 0;
  const completionRatePct = totalEnrollmentCount > 0 ? Math.round((completedEnrollmentCount / totalEnrollmentCount) * 1000) / 10 : 0;

  const totalPaymentCount = paymentTotals.reduce((s, r) => s + r._count._all, 0);
  const paidPaymentCount = paymentTotals.find((r) => r.status === "paid")?._count._all ?? 0;
  const paymentSuccessRatePct = totalPaymentCount > 0 ? Math.round((paidPaymentCount / totalPaymentCount) * 1000) / 10 : 0;

  return NextResponse.json({
    weeklyEnrollments,
    monthlySignups,
    enrollmentsByCourse,
    paymentStatusBreakdown,
    applicationStatusBreakdown,
    tutoringStatusBreakdown,
    enrollmentStatusBreakdown,
    stats: {
      avgCourseRating: Math.round((courseRatingAgg._avg.rating ?? 0) * 100) / 100,
      completionRatePct,
      paymentSuccessRatePct,
      activeCategories,
    },
    fetchedAt: new Date().toISOString(),
  });
}

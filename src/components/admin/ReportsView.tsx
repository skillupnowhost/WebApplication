"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useLiveData } from "@/components/admin/useLiveData";
import { BarList, Donut, type Datum } from "@/components/admin/charts";
import { LiveIndicator } from "@/components/admin/DataTable";
import { AnimatedStar } from "@/components/ui/icons/AnimatedStar";
import { AnimatedChecklist } from "@/components/ui/icons/AnimatedChecklist";
import { AnimatedPercent } from "@/components/ui/icons/AnimatedPercent";
import { AnimatedLayers } from "@/components/ui/icons/AnimatedLayers";

type Reports = {
  weeklyEnrollments: Datum[];
  monthlySignups: Datum[];
  enrollmentsByCourse: Datum[];
  paymentStatusBreakdown: Datum[];
  applicationStatusBreakdown: Datum[];
  tutoringStatusBreakdown: Datum[];
  enrollmentStatusBreakdown: Datum[];
  stats: {
    avgCourseRating: number;
    completionRatePct: number;
    paymentSuccessRatePct: number;
    activeCategories: number;
  };
};

function ChartCard({ title, subtitle, children, delay = 0 }: { title: string; subtitle?: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6"
    >
      <h2 className="text-sm font-semibold">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function StatTile({
  label,
  value,
  suffix = "",
  icon,
  index,
  loading,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  index: number;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-soft)]"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 to-brand-700" />
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/25">{icon}</span>
      {loading ? (
        <span className="mt-4 block h-7 w-20 animate-pulse rounded-full bg-surface-2" />
      ) : (
        <span className="mt-4 text-2xl font-bold leading-none tabular-nums">
          {Number.isInteger(value) ? value : value.toFixed(1)}
          {suffix}
        </span>
      )}
      <p className="mt-1.5 text-xs font-medium text-muted">{label}</p>
    </motion.div>
  );
}

export function ReportsView() {
  const { data, error, loading, updatedAt } = useLiveData<Reports>("/api/admin/reports", { intervalMs: 15_000 });
  const s = data?.stats;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 basis-56 text-sm text-muted">
          Deeper cuts of the same live data — trends over time, course-level breakdowns and funnel health. See the main
          Dashboard for headline totals and revenue.
        </p>
        <LiveIndicator updatedAt={updatedAt} error={error} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Avg. course rating" value={s?.avgCourseRating ?? 0} icon={<AnimatedStar className="h-6 w-6" />} index={0} loading={loading && !data} />
        <StatTile label="Enrollment completion rate" value={s?.completionRatePct ?? 0} suffix="%" icon={<AnimatedChecklist className="h-6 w-6" />} index={1} loading={loading && !data} />
        <StatTile label="Payment success rate" value={s?.paymentSuccessRatePct ?? 0} suffix="%" icon={<AnimatedPercent className="h-6 w-6" />} index={2} loading={loading && !data} />
        <StatTile label="Active categories" value={s?.activeCategories ?? 0} icon={<AnimatedLayers className="h-6 w-6" />} index={3} loading={loading && !data} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Weekly Enrollment Trend" subtitle="New enrollments per week, last 8 weeks" delay={0.08}>
          <BarList data={data?.weeklyEnrollments ?? []} />
        </ChartCard>
        <ChartCard title="New Signups by Month" subtitle="New user accounts created, last 6 months" delay={0.12}>
          <BarList data={data?.monthlySignups ?? []} />
        </ChartCard>
      </div>

      <ChartCard title="Top Courses by Enrollments" subtitle="Enrollment counts, not revenue — see Dashboard for revenue by course" delay={0.16}>
        <BarList data={data?.enrollmentsByCourse ?? []} />
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Payment Status" delay={0.2}>
          <Donut data={data?.paymentStatusBreakdown ?? []} unit="payments" />
        </ChartCard>
        <ChartCard title="Internship Application Status" delay={0.24}>
          <Donut data={data?.applicationStatusBreakdown ?? []} unit="applications" />
        </ChartCard>
        <ChartCard title="Tutoring Booking Status" delay={0.28}>
          <Donut data={data?.tutoringStatusBreakdown ?? []} unit="bookings" />
        </ChartCard>
      </div>

      <ChartCard title="Enrollment Status" subtitle="Active vs. completed vs. paused, across every course" delay={0.32}>
        <Donut data={data?.enrollmentStatusBreakdown ?? []} unit="enrollments" />
      </ChartCard>

      <p className={cn("text-xs text-muted")}>
        Device / browser analytics aren&apos;t shown here — this codebase doesn&apos;t capture that data anywhere yet, so a
        chart for it would have to use fabricated numbers.
      </p>
    </div>
  );
}

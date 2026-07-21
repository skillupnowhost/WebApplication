"use client";

import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ContentIcon } from "@/components/ui/ContentIcon";
import type { Column, Row } from "@/components/admin/DataTable";
import type { EntityConfig } from "@/components/admin/EntityManager";
import { SUBJECT_OPTIONS, BOARD_OPTIONS, GRADE_OPTIONS, FEE_TIER_OPTIONS } from "@/lib/tutoringOptions";

const nfIN = new Intl.NumberFormat("en-IN");

function fmtDate(v: unknown) {
  if (!v) return "—";
  return new Date(String(v)).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const dateCell = (key: string) => (row: Row) => <span className="text-muted">{fmtDate(row[key])}</span>;

function fmtDateTime(v: unknown) {
  if (!v) return "—";
  return new Date(String(v)).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

const dateTimeCell = (key: string) => (row: Row) => <span className="text-muted">{fmtDateTime(row[key])}</span>;

const rupeeCell = (key: string) => (row: Row) => (
  <span className="font-semibold tabular-nums">₹{nfIN.format(Number(row[key] ?? 0))}</span>
);

const boolCell = (key: string) => (row: Row) =>
  row[key] ? (
    <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">Yes</span>
  ) : (
    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">No</span>
  );

const statusCell = (key: string) => (row: Row) => <StatusBadge status={String(row[key] ?? "")} />;

const categoryCell = (key: string) => (row: Row) => {
  const name = String(row[key] ?? "");
  if (!name) return "—";
  return (
    <span className="inline-flex items-center gap-2">
      <ContentIcon keyword={name} className="h-6 w-6" />
      <span>{name}</span>
    </span>
  );
};

const progressCell = (key: string) => (row: Row) => {
  const value = Math.min(100, Math.max(0, Number(row[key] ?? 0)));
  return (
    <div className="flex min-w-24 items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full brand-gradient-bg transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
      <span className="w-9 text-right text-xs tabular-nums text-muted">{value}%</span>
    </div>
  );
};

const LEVEL_OPTIONS = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

/* ── Configs ────────────────────────────────────────────────────────── */

export const courseConfig: EntityConfig = {
  entity: "courses",
  titleSingular: "Course",
  titlePlural: "Courses",
  description: "Create, update and retire courses. Prices and enrollments update live.",
  nameKey: "title",
  columns: [
    { key: "title", label: "Title", className: "font-medium" },
    { key: "category", label: "Category", render: categoryCell("category") },
    { key: "level", label: "Level", hideBelow: "md" },
    { key: "instructor", label: "Instructor", hideBelow: "lg" },
    { key: "price", label: "Price", align: "right", render: rupeeCell("price") },
    { key: "students", label: "Students", align: "right", hideBelow: "sm" },
    { key: "featured", label: "Featured", hideBelow: "xl", render: boolCell("featured") },
    { key: "createdAt", label: "Created", hideBelow: "lg", render: dateCell("createdAt") },
  ] as Column[],
  createFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "instructor", label: "Instructor", type: "text", required: true },
    { name: "category", label: "Category", type: "category", required: true, hint: "Pick an existing category or type a new one — its animated icon is generated automatically." },
    { name: "level", label: "Level", type: "select", options: LEVEL_OPTIONS },
    { name: "durationWeeks", label: "Duration (weeks)", type: "number", min: 1, max: 52, required: true },
    { name: "price", label: "Price (₹)", type: "number", min: 0, required: true },
    { name: "originalPrice", label: "Original price (₹)", type: "number", min: 0 },
    { name: "featured", label: "Featured on home page", type: "checkbox" },
    { name: "description", label: "Description", type: "textarea", required: true, full: true },
  ],
  editFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "instructor", label: "Instructor", type: "text", required: true },
    { name: "category", label: "Category", type: "category", required: true },
    { name: "level", label: "Level", type: "select", options: LEVEL_OPTIONS },
    { name: "durationWeeks", label: "Duration (weeks)", type: "number", min: 1, max: 52 },
    { name: "price", label: "Price (₹)", type: "number", min: 0 },
    { name: "originalPrice", label: "Original price (₹)", type: "number", min: 0 },
    { name: "featured", label: "Featured on home page", type: "checkbox" },
    { name: "description", label: "Description", type: "textarea", full: true },
  ],
  createDefaults: { level: "Beginner", durationWeeks: 6, price: 9999, featured: false },
  bulkFields: [{ name: "level", label: "Level", type: "select", options: LEVEL_OPTIONS }],
};

export const categoryConfig: EntityConfig = {
  entity: "categories",
  titleSingular: "Category",
  titlePlural: "Categories",
  description:
    "Categories are fully dynamic — one exists as long as a course uses it, and its animated icon is generated from the name. Renaming moves every course.",
  nameKey: "name",
  canDelete: false,
  columns: [
    {
      key: "name",
      label: "Category",
      render: (r) => (
        <span className="inline-flex items-center gap-2.5 font-medium">
          <ContentIcon keyword={String(r.name)} className="h-8 w-8" />
          {String(r.name)}
        </span>
      ),
    },
    { key: "courses", label: "Courses", align: "right" },
  ] as Column[],
  editFields: [
    { name: "name", label: "Category name", type: "text", required: true, hint: "Renaming updates every course in this category." },
  ],
};

export const userConfig: EntityConfig = {
  entity: "users",
  titleSingular: "User",
  titlePlural: "Users",
  description: "Every account on the platform — students, mentors and admins.",
  nameKey: "name",
  columns: [
    { key: "name", label: "Name", className: "font-medium" },
    { key: "email", label: "Email", className: "text-muted" },
    { key: "role", label: "Role", render: (r) => <StatusBadge status={String(r.role).toLowerCase()} /> },
    { key: "emailVerified", label: "Verified", hideBelow: "sm", render: boolCell("emailVerified") },
    { key: "points", label: "Points", align: "right", hideBelow: "md" },
    { key: "tutoringTier", label: "Tutoring tier", hideBelow: "lg", render: (r) => <StatusBadge status={String(r.tutoringTier ?? "").toLowerCase()} /> },
    { key: "enrollments", label: "Enrollments", align: "right", hideBelow: "lg" },
    { key: "createdAt", label: "Joined", hideBelow: "lg", render: dateCell("createdAt") },
  ] as Column[],
  createFields: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { label: "Student", value: "STUDENT" },
        { label: "Mentor", value: "MENTOR" },
        { label: "Admin", value: "ADMIN" },
      ],
    },
    { name: "password", label: "Password", type: "password", required: true, hint: "Minimum 8 characters." },
    { name: "emailVerified", label: "Mark email as verified", type: "checkbox" },
  ],
  editFields: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { label: "Student", value: "STUDENT" },
        { label: "Mentor", value: "MENTOR" },
        { label: "Admin", value: "ADMIN" },
      ],
    },
    { name: "points", label: "Points", type: "number", min: 0 },
    { name: "emailVerified", label: "Email verified", type: "checkbox" },
    {
      name: "tutoringTier",
      label: "Tutoring fee tier",
      type: "select",
      options: FEE_TIER_OPTIONS,
      hint: "Controls which class recordings this student can access.",
    },
  ],
  createDefaults: { role: "STUDENT", emailVerified: false },
  bulkFields: [
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { label: "Student", value: "STUDENT" },
        { label: "Mentor", value: "MENTOR" },
        { label: "Admin", value: "ADMIN" },
      ],
    },
  ],
};

export const mentorConfig: EntityConfig = {
  entity: "mentors",
  titleSingular: "Mentor",
  titlePlural: "Mentors",
  description: "Tutoring mentors shown across the site, with their live booking counts.",
  nameKey: "name",
  columns: [
    { key: "name", label: "Name", className: "font-medium" },
    { key: "subject", label: "Subject" },
    { key: "qualification", label: "Qualification", hideBelow: "md" },
    { key: "experienceYears", label: "Exp (yrs)", align: "right", hideBelow: "sm" },
    { key: "rating", label: "Rating", align: "right", hideBelow: "lg" },
    {
      key: "boards",
      label: "Boards",
      hideBelow: "xl",
      render: (r) => (
        <span className="flex flex-wrap gap-1">
          {String(r.boards ?? "")
            .split(", ")
            .filter(Boolean)
            .map((b) => (
              <span key={b} className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium">
                {b}
              </span>
            ))}
        </span>
      ),
    },
    {
      key: "grades",
      label: "Grades",
      hideBelow: "xl",
      render: (r) => (
        <span className="flex flex-wrap gap-1">
          {String(r.grades ?? "")
            .split(", ")
            .filter(Boolean)
            .map((g) => (
              <span key={g} className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium">
                {g}
              </span>
            ))}
        </span>
      ),
    },
    { key: "account", label: "Login account", hideBelow: "lg", className: "text-muted" },
    { key: "bookings", label: "Bookings", align: "right" },
  ] as Column[],
  createFields: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "subject", label: "Subject", type: "select", options: SUBJECT_OPTIONS, required: true },
    { name: "qualification", label: "Qualification", type: "text", required: true, hint: "e.g. M.Sc Mathematics, B.Ed" },
    { name: "experienceYears", label: "Experience (years)", type: "number", min: 0, max: 60, required: true },
    { name: "rating", label: "Rating", type: "rating" },
    { name: "boards", label: "Boards taught", type: "checkboxGroup", options: BOARD_OPTIONS },
    { name: "grades", label: "Grades taught", type: "checkboxGroup", options: GRADE_OPTIONS, required: true },
    {
      name: "userId",
      label: "Linked login account",
      type: "select",
      optionsEndpoint: "/api/admin/mentors/linkable-users",
      hint: "Create the mentor's account on the Users screen first (role: Mentor), then link it here so they can access their own dashboard.",
    },
    { name: "bio", label: "Bio", type: "textarea", required: true, full: true },
  ],
  editFields: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "subject", label: "Subject", type: "select", options: SUBJECT_OPTIONS, required: true },
    { name: "qualification", label: "Qualification", type: "text", required: true },
    { name: "experienceYears", label: "Experience (years)", type: "number", min: 0, max: 60 },
    { name: "rating", label: "Rating", type: "rating" },
    { name: "boards", label: "Boards taught", type: "checkboxGroup", options: BOARD_OPTIONS },
    { name: "grades", label: "Grades taught", type: "checkboxGroup", options: GRADE_OPTIONS },
    {
      name: "userId",
      label: "Linked login account",
      type: "select",
      optionsEndpoint: "/api/admin/mentors/linkable-users",
      hint: "Create the mentor's account on the Users screen first (role: Mentor), then link it here so they can access their own dashboard.",
    },
    { name: "bio", label: "Bio", type: "textarea", full: true },
  ],
  createDefaults: {
    subject: SUBJECT_OPTIONS[0].value,
    rating: 4.9,
    boards: "CBSE",
    grades: "6th Grade, 7th Grade, 8th Grade, 9th Grade, 10th Grade",
  },
};

export const enrollmentConfig: EntityConfig = {
  entity: "enrollments",
  titleSingular: "Enrollment",
  titlePlural: "Enrollments",
  description: "Who is learning what — progress and status stream in live.",
  nameKey: "user",
  columns: [
    { key: "user", label: "User", className: "font-medium" },
    { key: "email", label: "Email", hideBelow: "lg", className: "text-muted" },
    { key: "course", label: "Course" },
    { key: "category", label: "Category", hideBelow: "md", render: categoryCell("category") },
    { key: "progress", label: "Progress", render: progressCell("progress"), filterable: false },
    { key: "status", label: "Status", render: statusCell("status") },
    { key: "enrolledAt", label: "Enrolled", hideBelow: "lg", render: dateCell("enrolledAt") },
  ] as Column[],
  editFields: [
    { name: "progress", label: "Progress (%)", type: "number", min: 0, max: 100 },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Completed", value: "completed" },
        { label: "Paused", value: "paused" },
      ],
    },
  ],
  bulkFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Completed", value: "completed" },
        { label: "Paused", value: "paused" },
      ],
    },
  ],
};

export const internshipConfig: EntityConfig = {
  entity: "internships",
  titleSingular: "Internship",
  titlePlural: "Internships",
  description: "Openings students can apply to, with live application counts.",
  nameKey: "title",
  columns: [
    { key: "title", label: "Title", className: "font-medium" },
    { key: "company", label: "Company" },
    { key: "type", label: "Type", hideBelow: "md" },
    { key: "location", label: "Location", hideBelow: "lg" },
    { key: "stipend", label: "Stipend", align: "right", hideBelow: "md", render: (r) => (r.stipend ? `₹${nfIN.format(Number(r.stipend))}` : "Unpaid") },
    { key: "applications", label: "Applications", align: "right" },
    { key: "applyDeadline", label: "Deadline", hideBelow: "lg", render: dateCell("applyDeadline") },
  ] as Column[],
  createFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "type", label: "Type", type: "text", required: true, placeholder: "Remote / On-site / Hybrid" },
    { name: "location", label: "Location", type: "text", required: true },
    { name: "durationWeeks", label: "Duration (weeks)", type: "number", min: 1, max: 52, required: true },
    { name: "stipend", label: "Stipend (₹/month)", type: "number", min: 0 },
    { name: "applyDeadline", label: "Apply deadline", type: "date", required: true },
    { name: "paid", label: "Paid internship", type: "checkbox" },
    { name: "mentorName", label: "Mentor name", type: "text", required: true },
    { name: "mentorEmail", label: "Mentor email", type: "email", required: true },
    { name: "description", label: "Description", type: "textarea", required: true, full: true },
    { name: "requirements", label: "Requirements", type: "textarea", required: true, full: true },
    { name: "responsibilities", label: "Responsibilities", type: "textarea", required: true, full: true },
    { name: "featured", label: "Featured listing", type: "checkbox" },
  ],
  editFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "type", label: "Type", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "durationWeeks", label: "Duration (weeks)", type: "number", min: 1, max: 52 },
    { name: "stipend", label: "Stipend (₹/month)", type: "number", min: 0 },
    { name: "applyDeadline", label: "Apply deadline", type: "date" },
    { name: "paid", label: "Paid internship", type: "checkbox" },
    { name: "mentorName", label: "Mentor name", type: "text" },
    { name: "mentorEmail", label: "Mentor email", type: "email" },
    { name: "description", label: "Description", type: "textarea", full: true },
    { name: "requirements", label: "Requirements", type: "textarea", full: true },
    { name: "responsibilities", label: "Responsibilities", type: "textarea", full: true },
    { name: "featured", label: "Featured listing", type: "checkbox" },
  ],
  createDefaults: { paid: true, durationWeeks: 8, featured: false },
};

export const applicationConfig: EntityConfig = {
  entity: "applications",
  titleSingular: "Application",
  titlePlural: "Applications",
  description: "Internship applications — review, accept or reject with one click.",
  nameKey: "applicant",
  columns: [
    { key: "applicant", label: "Applicant", className: "font-medium" },
    { key: "email", label: "Email", hideBelow: "lg", className: "text-muted" },
    { key: "internship", label: "Internship" },
    { key: "company", label: "Company", hideBelow: "md" },
    { key: "status", label: "Status", render: statusCell("status") },
    { key: "appliedAt", label: "Applied", hideBelow: "md", render: dateCell("appliedAt") },
  ] as Column[],
  editFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Submitted", value: "submitted" },
        { label: "Under review", value: "under_review" },
        { label: "Accepted", value: "accepted" },
        { label: "Rejected", value: "rejected" },
      ],
    },
  ],
  bulkFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Submitted", value: "submitted" },
        { label: "Under review", value: "under_review" },
        { label: "Accepted", value: "accepted" },
        { label: "Rejected", value: "rejected" },
      ],
    },
  ],
};

export const projectConfig: EntityConfig = {
  entity: "projects",
  titleSingular: "Project",
  titlePlural: "Projects",
  description: "Student projects — update progress and leave mentor feedback.",
  nameKey: "title",
  columns: [
    { key: "title", label: "Title", className: "font-medium" },
    { key: "student", label: "Student" },
    { key: "mentor", label: "Mentor", hideBelow: "md" },
    { key: "progress", label: "Progress", render: progressCell("progress"), filterable: false },
    { key: "status", label: "Status", render: statusCell("status") },
    { key: "updatedAt", label: "Updated", hideBelow: "lg", render: dateCell("updatedAt") },
  ] as Column[],
  editFields: [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "In progress", value: "in_progress" },
        { label: "Completed", value: "completed" },
        { label: "On hold", value: "on_hold" },
      ],
    },
    { name: "progress", label: "Progress (%)", type: "number", min: 0, max: 100 },
    { name: "feedback", label: "Mentor feedback", type: "textarea", full: true },
  ],
  bulkFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "In progress", value: "in_progress" },
        { label: "Completed", value: "completed" },
        { label: "On hold", value: "on_hold" },
      ],
    },
  ],
};

export const tutoringConfig: EntityConfig = {
  entity: "tutoring",
  titleSingular: "Booking",
  titlePlural: "Tutoring bookings",
  description: "Tutoring session requests — confirm, complete or cancel them.",
  nameKey: "student",
  columns: [
    { key: "student", label: "Student", className: "font-medium" },
    { key: "tutor", label: "Tutor" },
    { key: "subject", label: "Subject" },
    { key: "grade", label: "Grade", hideBelow: "md" },
    { key: "board", label: "Board", hideBelow: "lg" },
    { key: "slot", label: "Preferred slot", hideBelow: "xl" },
    { key: "status", label: "Status", render: statusCell("status") },
    { key: "createdAt", label: "Requested", hideBelow: "lg", render: dateCell("createdAt") },
  ] as Column[],
  editFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    { name: "notes", label: "Notes", type: "textarea", full: true },
  ],
  bulkFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
  ],
};

export const classConfig: EntityConfig = {
  entity: "classes",
  titleSingular: "Class",
  titlePlural: "Classes",
  description: "Every scheduled live class across all mentors — reschedule, cancel or gate recording access.",
  nameKey: "title",
  canDelete: true,
  columns: [
    { key: "title", label: "Title", className: "font-medium" },
    { key: "mentor", label: "Mentor" },
    { key: "subject", label: "Subject", hideBelow: "md" },
    { key: "startsAt", label: "Starts", hideBelow: "lg", render: dateTimeCell("startsAt") },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "").toLowerCase()} /> },
    {
      key: "recordingAccessTier",
      label: "Recording tier",
      hideBelow: "xl",
      render: (r) => <StatusBadge status={String(r.recordingAccessTier ?? "").toLowerCase()} />,
    },
    { key: "bookings", label: "Enrolled", align: "right", hideBelow: "sm" },
    { key: "recordings", label: "Recordings", align: "right", hideBelow: "lg" },
  ] as Column[],
  editFields: [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Scheduled", value: "SCHEDULED" },
        { label: "Live", value: "LIVE" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
    { name: "recordingAccessTier", label: "Recording access tier", type: "select", options: FEE_TIER_OPTIONS },
  ],
  bulkFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Scheduled", value: "SCHEDULED" },
        { label: "Live", value: "LIVE" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
  ],
};

export const mentorClassConfig: EntityConfig = {
  entity: "classes",
  basePath: "/api/mentor",
  titleSingular: "Class",
  titlePlural: "My classes",
  description: "Classes you're scheduled to teach — synced to your Google Calendar once connected.",
  nameKey: "title",
  columns: [
    { key: "title", label: "Title", className: "font-medium" },
    { key: "subject", label: "Subject" },
    { key: "startsAt", label: "Starts", hideBelow: "md", render: dateTimeCell("startsAt") },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status ?? "").toLowerCase()} /> },
    { key: "recordingAccessTier", label: "Recording tier", hideBelow: "lg", render: (r) => <StatusBadge status={String(r.recordingAccessTier ?? "").toLowerCase()} /> },
    { key: "bookings", label: "Enrolled", align: "right", hideBelow: "sm" },
  ] as Column[],
  createFields: [
    { name: "title", label: "Class title", type: "text", required: true },
    { name: "subject", label: "Subject", type: "select", options: SUBJECT_OPTIONS, required: true },
    { name: "startsAt", label: "Starts at", type: "datetime-local", required: true },
    { name: "endsAt", label: "Ends at", type: "datetime-local", required: true },
    { name: "recordingAccessTier", label: "Recording access tier", type: "select", options: FEE_TIER_OPTIONS },
    { name: "description", label: "Description", type: "textarea", full: true },
  ],
  editFields: [
    { name: "title", label: "Class title", type: "text", required: true },
    { name: "subject", label: "Subject", type: "select", options: SUBJECT_OPTIONS, required: true },
    { name: "startsAt", label: "Starts at", type: "datetime-local", required: true },
    { name: "endsAt", label: "Ends at", type: "datetime-local", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Scheduled", value: "SCHEDULED" },
        { label: "Live", value: "LIVE" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
    { name: "recordingAccessTier", label: "Recording access tier", type: "select", options: FEE_TIER_OPTIONS },
    { name: "description", label: "Description", type: "textarea", full: true },
  ],
  createDefaults: { subject: SUBJECT_OPTIONS[0].value, recordingAccessTier: "FREE" },
};

export const leadConfig: EntityConfig = {
  entity: "leads",
  titleSingular: "Client request",
  titlePlural: "Client requests",
  description: "Service inquiries from the contact form — keep their status current.",
  nameKey: "name",
  columns: [
    { key: "name", label: "Name", className: "font-medium" },
    { key: "email", label: "Email", hideBelow: "md", className: "text-muted" },
    { key: "phone", label: "Phone", hideBelow: "lg" },
    { key: "service", label: "Service" },
    { key: "status", label: "Status", render: statusCell("status") },
    { key: "createdAt", label: "Received", hideBelow: "lg", render: dateCell("createdAt") },
  ] as Column[],
  editFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Closed", value: "closed" },
      ],
    },
  ],
  bulkFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Closed", value: "closed" },
      ],
    },
  ],
};

export const paymentConfig: EntityConfig = {
  entity: "payments",
  titleSingular: "Payment",
  titlePlural: "Payments",
  description: "Every Razorpay order with its live status. Records are never deleted.",
  nameKey: "user",
  canDelete: false,
  columns: [
    { key: "user", label: "User", className: "font-medium" },
    { key: "course", label: "Course" },
    { key: "amount", label: "Amount", align: "right", render: rupeeCell("amount") },
    { key: "status", label: "Status", render: statusCell("status") },
    { key: "orderId", label: "Order ID", hideBelow: "xl", className: "text-muted text-xs" },
    { key: "createdAt", label: "Date", hideBelow: "md", render: dateCell("createdAt") },
  ] as Column[],
  editFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Created", value: "created" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
    },
  ],
  bulkFields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Created", value: "created" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
    },
  ],
};

const thumbCell = (key: string) => (row: Row) => {
  const url = String(row[key] ?? "");
  if (!url) return <span className="text-muted">—</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- admin table thumbnail of an uploaded asset
    <img src={url} alt="" className="h-10 w-10 rounded-lg object-cover" />
  );
};

const TEAM_CATEGORY_OPTIONS = [
  { label: "Founder", value: "FOUNDER" },
  { label: "CEO", value: "CEO" },
  { label: "Staff", value: "STAFF" },
];

export const offeringConfig: EntityConfig = {
  entity: "offerings",
  titleSingular: "Offering",
  titlePlural: "Key Offerings",
  description: "The bullet-point offerings shown near the top of the About Us page.",
  nameKey: "title",
  columns: [
    { key: "title", label: "Title", className: "font-medium" },
    { key: "description", label: "Description", className: "text-muted" },
    { key: "sortOrder", label: "Order", align: "right", hideBelow: "md" },
  ] as Column[],
  createFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true, full: true },
  ],
  editFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", full: true },
    { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
  ],
};

export const teamConfig: EntityConfig = {
  entity: "team",
  titleSingular: "Team member",
  titlePlural: "Team",
  description:
    "Founders and the CEO appear as cinematic cards; staff are listed with their specialization. Photos should be cropped from hip to shoulders.",
  nameKey: "name",
  columns: [
    { key: "photoUrl", label: "Photo", render: thumbCell("photoUrl") },
    { key: "name", label: "Name", className: "font-medium" },
    { key: "role", label: "Role" },
    { key: "category", label: "Category", render: (r) => <StatusBadge status={String(r.category ?? "").toLowerCase()} /> },
    { key: "specialization", label: "Specialization", hideBelow: "md" },
    { key: "experienceYears", label: "Exp (yrs)", align: "right", hideBelow: "lg" },
    { key: "sortOrder", label: "Order", align: "right", hideBelow: "xl" },
  ] as Column[],
  createFields: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "role", label: "Role / title", type: "text", required: true, placeholder: "Co-Founder, CEO, Full-Stack Developer…" },
    { name: "category", label: "Category", type: "select", options: TEAM_CATEGORY_OPTIONS, required: true },
    { name: "experienceYears", label: "Experience (years)", type: "number", min: 0, max: 60 },
    { name: "specialization", label: "Specialization", type: "text", placeholder: "e.g. Full-stack development" },
    { name: "photoUrl", label: "Photo", type: "image", hint: "PNG cropped from hip to shoulders works best for founder/CEO cards." },
    { name: "linkedinUrl", label: "LinkedIn URL", type: "text" },
    { name: "bio", label: "Bio", type: "textarea", full: true },
  ],
  editFields: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "role", label: "Role / title", type: "text", required: true },
    { name: "category", label: "Category", type: "select", options: TEAM_CATEGORY_OPTIONS, required: true },
    { name: "experienceYears", label: "Experience (years)", type: "number", min: 0, max: 60 },
    { name: "specialization", label: "Specialization", type: "text" },
    { name: "photoUrl", label: "Photo", type: "image", hint: "PNG cropped from hip to shoulders works best for founder/CEO cards." },
    { name: "linkedinUrl", label: "LinkedIn URL", type: "text" },
    { name: "bio", label: "Bio", type: "textarea", full: true },
    { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
  ],
  createDefaults: { category: "STAFF" },
};

export const partnerConfig: EntityConfig = {
  entity: "partners",
  titleSingular: "Partner",
  titlePlural: "Partners",
  description: "Business partners shown with their logo and website link.",
  nameKey: "name",
  columns: [
    { key: "logoUrl", label: "Logo", render: thumbCell("logoUrl") },
    { key: "name", label: "Name", className: "font-medium" },
    { key: "websiteUrl", label: "Website", className: "text-muted", hideBelow: "md" },
    { key: "sortOrder", label: "Order", align: "right", hideBelow: "lg" },
  ] as Column[],
  createFields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "logoUrl", label: "Logo", type: "image" },
    { name: "websiteUrl", label: "Website URL", type: "text", placeholder: "https://…" },
  ],
  editFields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "logoUrl", label: "Logo", type: "image" },
    { name: "websiteUrl", label: "Website URL", type: "text" },
    { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
  ],
};

export const clientConfig: EntityConfig = {
  entity: "clients",
  titleSingular: "Client",
  titlePlural: "Clients",
  description: "Clients shown with their logo, link and a short description.",
  nameKey: "name",
  columns: [
    { key: "logoUrl", label: "Logo", render: thumbCell("logoUrl") },
    { key: "name", label: "Name", className: "font-medium" },
    { key: "description", label: "Description", className: "text-muted", hideBelow: "md" },
    { key: "sortOrder", label: "Order", align: "right", hideBelow: "lg" },
  ] as Column[],
  createFields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "logoUrl", label: "Logo", type: "image" },
    { name: "websiteUrl", label: "Website URL", type: "text", placeholder: "https://…" },
    { name: "description", label: "Description", type: "textarea", full: true },
  ],
  editFields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "logoUrl", label: "Logo", type: "image" },
    { name: "websiteUrl", label: "Website URL", type: "text" },
    { name: "description", label: "Description", type: "textarea", full: true },
    { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
  ],
};

const RATING_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ label: `${n} star${n > 1 ? "s" : ""}`, value: String(n) }));

export const testimonialConfig: EntityConfig = {
  entity: "testimonials",
  titleSingular: "Testimonial",
  titlePlural: "Testimonials",
  description: "Quotes shown in the homepage testimonials carousel.",
  nameKey: "authorName",
  columns: [
    { key: "avatarUrl", label: "Photo", render: thumbCell("avatarUrl") },
    { key: "authorName", label: "Author", className: "font-medium" },
    { key: "authorRole", label: "Role", className: "text-muted", hideBelow: "md" },
    { key: "quote", label: "Quote", className: "text-muted", hideBelow: "lg" },
    { key: "rating", label: "Rating", align: "right", hideBelow: "md" },
    { key: "sortOrder", label: "Order", align: "right", hideBelow: "lg" },
  ] as Column[],
  createFields: [
    { name: "authorName", label: "Author name", type: "text", required: true },
    { name: "authorRole", label: "Author role", type: "text", placeholder: "e.g. Software Engineer, Batch of 2025" },
    { name: "avatarUrl", label: "Photo", type: "image" },
    { name: "rating", label: "Rating", type: "select", options: RATING_OPTIONS },
    { name: "quote", label: "Quote", type: "textarea", required: true, full: true },
  ],
  editFields: [
    { name: "authorName", label: "Author name", type: "text", required: true },
    { name: "authorRole", label: "Author role", type: "text" },
    { name: "avatarUrl", label: "Photo", type: "image" },
    { name: "rating", label: "Rating", type: "select", options: RATING_OPTIONS },
    { name: "quote", label: "Quote", type: "textarea", required: true, full: true },
    { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
  ],
};

const EVENT_MODE_OPTIONS = [
  { label: "Online", value: "ONLINE" },
  { label: "Offline", value: "OFFLINE" },
  { label: "Hybrid", value: "HYBRID" },
];

export const eventConfig: EntityConfig = {
  entity: "events",
  titleSingular: "Event",
  titlePlural: "Events",
  description: "Workshops, webinars and meetups shown on the public Events page.",
  nameKey: "title",
  columns: [
    { key: "coverImageUrl", label: "Cover", render: thumbCell("coverImageUrl") },
    { key: "title", label: "Title", className: "font-medium" },
    { key: "category", label: "Category", hideBelow: "md" },
    { key: "mode", label: "Mode", render: (r) => <StatusBadge status={String(r.mode ?? "").toLowerCase()} /> },
    { key: "startsAt", label: "Starts", render: dateTimeCell("startsAt") },
    { key: "location", label: "Location", className: "text-muted", hideBelow: "lg" },
    { key: "sortOrder", label: "Order", align: "right", hideBelow: "xl" },
  ] as Column[],
  createFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true, full: true },
    { name: "category", label: "Category", type: "text", placeholder: "Workshop, Webinar, Meetup…" },
    { name: "mode", label: "Mode", type: "select", options: EVENT_MODE_OPTIONS, required: true },
    { name: "startsAt", label: "Starts at", type: "datetime-local", required: true },
    { name: "endsAt", label: "Ends at", type: "datetime-local" },
    { name: "location", label: "Location", type: "text", placeholder: "Venue address or meeting link" },
    { name: "coverImageUrl", label: "Cover image", type: "image" },
    { name: "registerUrl", label: "Register URL", type: "text", placeholder: "https://…" },
  ],
  editFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", full: true },
    { name: "category", label: "Category", type: "text" },
    { name: "mode", label: "Mode", type: "select", options: EVENT_MODE_OPTIONS, required: true },
    { name: "startsAt", label: "Starts at", type: "datetime-local", required: true },
    { name: "endsAt", label: "Ends at", type: "datetime-local" },
    { name: "location", label: "Location", type: "text" },
    { name: "coverImageUrl", label: "Cover image", type: "image" },
    { name: "registerUrl", label: "Register URL", type: "text" },
    { name: "sortOrder", label: "Sort order", type: "number", min: 0 },
  ],
  createDefaults: { mode: "ONLINE" },
};

export const astrologyReportConfig: EntityConfig = {
  entity: "astrologyReports",
  titleSingular: "Horoscope report",
  titlePlural: "Horoscope reports",
  description: "Every generated horoscope report — read-only, for support and QA purposes.",
  nameKey: "subject",
  canDelete: true,
  columns: [
    { key: "subject", label: "Subject", className: "font-medium" },
    { key: "birthPlace", label: "Birth place", hideBelow: "lg", className: "text-muted" },
    { key: "depth", label: "Depth", hideBelow: "sm" },
    { key: "chartStyle", label: "Chart style", hideBelow: "md" },
    { key: "language", label: "Language", hideBelow: "md" },
    { key: "ayanamsaUsed", label: "Ayanamsa", hideBelow: "xl", className: "text-muted text-xs" },
    { key: "createdAt", label: "Generated", hideBelow: "lg", render: dateCell("createdAt") },
  ] as Column[],
};

export const astrologyMatchConfig: EntityConfig = {
  entity: "astrologyMatches",
  titleSingular: "Compatibility match",
  titlePlural: "Compatibility matches",
  description: "Every marriage-compatibility check — read-only, for support and QA purposes.",
  nameKey: "partnerA",
  canDelete: true,
  columns: [
    { key: "partnerA", label: "Partner A", className: "font-medium" },
    { key: "partnerB", label: "Partner B", className: "font-medium" },
    { key: "score", label: "Score", align: "right" },
    { key: "verdict", label: "Verdict", hideBelow: "sm" },
    { key: "language", label: "Language", hideBelow: "md" },
    { key: "createdAt", label: "Checked", hideBelow: "lg", render: dateCell("createdAt") },
  ] as Column[],
};

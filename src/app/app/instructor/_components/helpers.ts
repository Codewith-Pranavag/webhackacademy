import type { Course } from "@/types";

/** Shared input styling for the instructor forms (dark-mode safe). */
export const fieldClass =
  "h-11 w-full rounded-[var(--radius)] border border-line bg-surface-soft px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-violet";

export const COURSE_CATEGORIES = [
  "Design",
  "Development",
  "Data",
  "Motion",
  "Security",
  "Marketing",
] as const;

export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

/**
 * The mock `Course` shape carries no publish status, so we derive a stable,
 * deterministic one from the course id purely for display.
 */
export type CourseStatus = "published" | "draft" | "pending";

const COURSE_STATUS_CYCLE: CourseStatus[] = [
  "published",
  "published",
  "draft",
  "pending",
  "published",
  "published",
];

export function courseStatusFor(course: Course): CourseStatus {
  const idx = Number(course.id.replace(/\D/g, "")) - 1;
  return COURSE_STATUS_CYCLE[((idx % COURSE_STATUS_CYCLE.length) + COURSE_STATUS_CYCLE.length) % COURSE_STATUS_CYCLE.length] ?? "published";
}

export const STATUS_TONE: Record<CourseStatus, "green" | "neutral" | "amber"> = {
  published: "green",
  draft: "neutral",
  pending: "amber",
};

/**
 * Assignments in the mock data have no attached student, so we fabricate a
 * stable reviewer identity from the assignment id for the review queue UI.
 */
const STUDENT_POOL = [
  "Elena Petrova",
  "Kwame Mensah",
  "Yuki Tanaka",
  "Marco Rossi",
  "Sofia Lindqvist",
  "Priya Sharma",
  "Diego Santos",
  "Nadia Rahman",
] as const;

export function studentForId(id: string): string {
  const sum = id.split("").reduce((n, ch) => n + ch.charCodeAt(0), 0);
  return STUDENT_POOL[sum % STUDENT_POOL.length];
}

/* ------------------------------------------------------------------ *
 * WebHack Academy — Domain types
 * Shared contract for the mock API layer and (future) real backend.
 * ------------------------------------------------------------------ */

export type Role = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  bio?: string;
  headline?: string;
  location?: string;
  skills?: string[];
  joinedAt: string;
  twoFactorEnabled?: boolean;
  emailVerified?: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Lesson {
  id: string;
  title: string;
  duration: number; // seconds
  type: "video" | "reading" | "quiz";
  preview?: boolean;
  videoUrl?: string;
  transcript?: string;
  resources?: { label: string; url: string; size: string }[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  price: string;
  level: CourseLevel;
  rating: number;
  reviews: number;
  students: number;
  lessons: number;
  durationHours: number;
  instructorId: string;
  updatedAt: string;
  tags: string[];
}

export interface Course extends CourseSummary {
  description: string;
  outcomes: string[];
  requirements: string[];
  modules: Module[];
}

export interface Enrollment {
  courseId: string;
  progress: number; // 0-100
  completedLessonIds: string[];
  lastLessonId: string;
  lastAccessedAt: string;
  status: "in-progress" | "completed" | "not-started";
}

export type QuizQuestionType =
  | "single"
  | "multi"
  | "boolean"
  | "fill"
  | "code";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options?: string[];
  correct: number[] | string; // indices, or text for fill/code
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  quizId: string;
  score: number;
  passed: boolean;
  takenAt: string;
  answers: Record<string, number[] | string>;
}

export type AssignmentStatus = "pending" | "submitted" | "graded" | "overdue";

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  status: AssignmentStatus;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  attachments?: { name: string; size: string }[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  category: string;
  issuedAt: string;
  credentialId: string;
  grade: string;
  image: string;
}

export type NotificationType =
  | "course"
  | "assignment"
  | "quiz"
  | "message"
  | "system"
  | "achievement";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participant: { id: string; name: string; avatar: string; online: boolean };
  messages: Message[];
  unread: number;
}

export type CalendarEventType =
  | "deadline"
  | "live-class"
  | "assignment"
  | "quiz";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO
  type: CalendarEventType;
  courseTitle?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: { name: string; avatar: string };
  points: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface Note {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  timestamp: number;
  content: string;
  createdAt: string;
}

export interface StudyAnalytics {
  weeklyHours: { day: string; hours: number }[];
  monthlyProgress: { week: string; completed: number }[];
  quizScores: { label: string; score: number }[];
  completionRate: number;
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
  goalHours: number;
  goalProgress: number;
}

export interface DashboardData {
  stats: { label: string; value: string; delta: string; trend: "up" | "down" }[];
  continueLearning: (Enrollment & { course: CourseSummary })[];
  recommended: CourseSummary[];
  deadlines: Assignment[];
  activity: { id: string; text: string; time: string; type: NotificationType }[];
  streak: number;
}

/* --- Admin / Instructor --- */

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  status: "active" | "suspended" | "invited";
  courses: number;
  joinedAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  at: string;
}

export interface AdminStats {
  kpis: { label: string; value: string; delta: string; trend: "up" | "down" }[];
  revenue: { month: string; amount: number }[];
  signups: { month: string; count: number }[];
  usersByRole: { label: string; value: number }[];
  topCourses: { title: string; sales: number; revenue: number }[];
}

export interface InstructorStats {
  kpis: { label: string; value: string; delta: string; trend: "up" | "down" }[];
  earnings: { month: string; amount: number }[];
  enrollments: { month: string; count: number }[];
  ratings: { label: string; value: number }[];
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

export interface LoginHistoryEntry {
  id: string;
  at: string;
  device: string;
  location: string;
  ip: string;
  status: "success" | "failed";
}

/** Standard paginated envelope returned by list services. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

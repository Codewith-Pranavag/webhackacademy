import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Award,
  ClipboardList,
  ListChecks,
  Bell,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Heart,
  Download,
  StickyNote,
  Bookmark,
  User,
  Settings,
  Users,
  FolderTree,
  FileBarChart,
  ShieldCheck,
  ScrollText,
  DollarSign,
  Megaphone,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: "notifications";
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

const student: NavGroup[] = [
  {
    title: "Learn",
    links: [
      { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
      { label: "My Learning", href: "/app/my-learning", icon: BookOpen },
      { label: "Quizzes", href: "/app/quizzes", icon: ListChecks },
      { label: "Assignments", href: "/app/assignments", icon: ClipboardList },
      { label: "Certificates", href: "/app/certificates", icon: Award },
    ],
  },
  {
    title: "Progress",
    links: [
      { label: "Analytics", href: "/app/analytics", icon: BarChart3 },
      { label: "Achievements", href: "/app/achievements", icon: Trophy },
      { label: "Calendar", href: "/app/calendar", icon: CalendarDays },
    ],
  },
  {
    title: "Library",
    links: [
      { label: "Wishlist", href: "/app/wishlist", icon: Heart },
      { label: "Bookmarks", href: "/app/bookmarks", icon: Bookmark },
      { label: "Notes", href: "/app/notes", icon: StickyNote },
      { label: "Downloads", href: "/app/downloads", icon: Download },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Notifications", href: "/app/notifications", icon: Bell, badge: "notifications" },
      { label: "Messages", href: "/app/messages", icon: MessageSquare },
      { label: "Profile", href: "/app/profile", icon: User },
      { label: "Settings", href: "/app/settings", icon: Settings },
    ],
  },
];

const instructor: NavGroup[] = [
  {
    title: "Teach",
    links: [
      { label: "Dashboard", href: "/app/instructor", icon: LayoutDashboard },
      { label: "My Courses", href: "/app/instructor/courses", icon: BookOpen },
      { label: "Students", href: "/app/instructor/students", icon: GraduationCap },
      { label: "Submissions", href: "/app/instructor/submissions", icon: ClipboardList },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Analytics", href: "/app/instructor/analytics", icon: BarChart3 },
      { label: "Earnings", href: "/app/instructor/earnings", icon: DollarSign },
      { label: "Announcements", href: "/app/instructor/announcements", icon: Megaphone },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Messages", href: "/app/messages", icon: MessageSquare },
      { label: "Settings", href: "/app/settings", icon: Settings },
    ],
  },
];

const admin: NavGroup[] = [
  {
    title: "Overview",
    links: [
      { label: "Dashboard", href: "/app/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/app/admin/analytics", icon: BarChart3 },
      { label: "Reports", href: "/app/admin/reports", icon: FileBarChart },
    ],
  },
  {
    title: "Manage",
    links: [
      { label: "Users", href: "/app/admin/users", icon: Users },
      { label: "Courses", href: "/app/admin/courses", icon: BookOpen },
      { label: "Categories", href: "/app/admin/categories", icon: FolderTree },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Roles & Permissions", href: "/app/admin/roles", icon: ShieldCheck },
      { label: "Audit Logs", href: "/app/admin/audit-logs", icon: ScrollText },
      { label: "Settings", href: "/app/settings", icon: Settings },
    ],
  },
];

export const navByRole: Record<Role, NavGroup[]> = { student, instructor, admin };

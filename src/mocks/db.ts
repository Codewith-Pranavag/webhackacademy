/* ------------------------------------------------------------------ *
 * WebHack Academy — Mock database
 * Realistic sample data consumed by the service layer.
 * ------------------------------------------------------------------ */

import type {
  Achievement,
  AdminStats,
  AdminUserRow,
  Assignment,
  AuditLog,
  Certificate,
  Conversation,
  Course,
  CalendarEvent,
  Enrollment,
  InstructorStats,
  LeaderboardEntry,
  LoginHistoryEntry,
  Module,
  Note,
  Notification,
  Quiz,
  Role,
  Session,
  StudyAnalytics,
  User,
} from "@/types";

const IMG = "/images";

/* ----------------------------- Users ----------------------------- */

export const currentUser: User = {
  id: "u_1",
  name: "Rahul Kaushik",
  email: "rahul.kaushik@acme.in",
  avatar: `${IMG}/cd5b8318-nestlearn-rectangle-39823.jpg`,
  role: "student",
  headline: "Aspiring Full-Stack Developer",
  bio: "Lifelong learner focused on web development, design systems and data.",
  location: "Bengaluru, India",
  skills: ["React", "TypeScript", "UI Design", "Python"],
  joinedAt: "2025-01-14",
  twoFactorEnabled: false,
  emailVerified: true,
};

export const instructors: User[] = [
  {
    id: "in_1",
    name: "Alicia Moreno",
    email: "alicia@webhackacademy.com",
    avatar: `${IMG}/486c4179-nestlearn-rectangle-39823-1.jpg`,
    role: "instructor",
    headline: "Product Design Lead",
    joinedAt: "2023-03-02",
  },
  {
    id: "in_2",
    name: "David Okafor",
    email: "david@webhackacademy.com",
    avatar: `${IMG}/3a1d96ca-nestlearn-rectangle-39823-2.jpg`,
    role: "instructor",
    headline: "Senior Software Engineer",
    joinedAt: "2022-09-19",
  },
];

/* ---------------------------- Courses ---------------------------- */

const COURSE_IMAGES = [
  `${IMG}/80ed5538-nextlearn-course-image-1.jpg`,
  `${IMG}/44c8f23c-nextlearn-course-image-2.jpg`,
  `${IMG}/d474de99-nextlearn-course-image-3.jpg`,
  `${IMG}/e96e471f-nextlearn-course-image-4.jpg`,
  `${IMG}/7ea5fc0d-nextlearn-course-image-5.jpg`,
  `${IMG}/48d52d11-nextlearn-course-image-6.jpg`,
];

function buildModules(courseId: string, count = 4): Module[] {
  const lessonTitles = [
    "Introduction & setup",
    "Core concepts",
    "Hands-on walkthrough",
    "Building the project",
    "Best practices",
    "Common pitfalls",
    "Advanced techniques",
    "Wrap-up & next steps",
  ];
  return Array.from({ length: count }, (_, m) => ({
    id: `${courseId}_m${m + 1}`,
    title: `Module ${m + 1}: ${["Foundations", "Core Skills", "Real Projects", "Mastery"][m % 4]}`,
    lessons: Array.from({ length: 4 }, (_, l) => {
      const idx = (m * 4 + l) % lessonTitles.length;
      const isQuiz = l === 3 && m % 2 === 1;
      return {
        id: `${courseId}_m${m + 1}_l${l + 1}`,
        title: isQuiz ? "Module quiz" : lessonTitles[idx],
        duration: isQuiz ? 600 : 360 + ((idx * 97) % 600),
        type: isQuiz ? ("quiz" as const) : ("video" as const),
        preview: m === 0 && l === 0,
        videoUrl: "mock",
        transcript:
          "In this lesson we walk through the key ideas step by step, with practical examples you can follow along with in your own editor. We start from the fundamentals and build up to a working result.",
        resources: [
          { label: "Lesson slides (PDF)", url: "#", size: "2.4 MB" },
          { label: "Starter files (ZIP)", url: "#", size: "8.1 MB" },
        ],
      };
    }),
  }));
}

const COURSE_SEED = [
  { slug: "product-design", title: "Product Design Masterclass", subtitle: "From wireframe to polished, shippable product UI.", category: "Design", price: "Free", level: "Beginner", instructorId: "in_1" },
  { slug: "branding-design", title: "Branding & Identity Design", subtitle: "Craft memorable brands with a systematic approach.", category: "Design", price: "Free", level: "Intermediate", instructorId: "in_1" },
  { slug: "3d-motion-design", title: "3D Motion Design in Blender", subtitle: "Create stunning 3D motion graphics from scratch.", category: "Motion", price: "Free", level: "Advanced", instructorId: "in_1" },
  { slug: "fullstack-web", title: "Full-Stack Web Development", subtitle: "Ship production web apps with React & Node.", category: "Development", price: "$49", level: "Intermediate", instructorId: "in_2" },
  { slug: "data-science", title: "Data Science with Python", subtitle: "Turn raw data into insight and prediction.", category: "Data", price: "$59", level: "Intermediate", instructorId: "in_2" },
  { slug: "cybersecurity", title: "Ethical Hacking & Security", subtitle: "Think like an attacker to defend like a pro.", category: "Security", price: "$69", level: "Advanced", instructorId: "in_2" },
] as const;

export const courses: Course[] = COURSE_SEED.map((c, i) => {
  const modules = buildModules(`c_${i + 1}`);
  const lessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  return {
    id: `c_${i + 1}`,
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    category: c.category,
    image: COURSE_IMAGES[i],
    price: c.price,
    level: c.level,
    rating: 4.7 + ((i * 7) % 4) / 10,
    reviews: 320 + i * 214,
    students: 1200 + i * 940,
    lessons,
    durationHours: 6 + i * 2,
    instructorId: c.instructorId,
    updatedAt: "2026-05-12",
    tags: [c.category, c.level, "Certificate"],
    description:
      "This course gives you a practical, hands-on path from fundamentals to shipping real work. Taught by expert mentors, it combines video lessons with real-time guidance and a growing library of resources you can implement immediately into your workflow.",
    outcomes: [
      "Build real-world, portfolio-ready projects",
      "Understand industry best practices",
      "Get personalised mentor feedback",
      "Earn a shareable certificate",
    ],
    requirements: [
      "A computer with internet access",
      "No prior experience required — we start from the basics",
    ],
    modules,
  };
});

/* -------------------------- Enrollments -------------------------- */

export const enrollments: Enrollment[] = [
  { courseId: "c_1", progress: 68, completedLessonIds: [], lastLessonId: "c_1_m3_l1", lastAccessedAt: "2026-07-21", status: "in-progress" },
  { courseId: "c_4", progress: 34, completedLessonIds: [], lastLessonId: "c_4_m2_l1", lastAccessedAt: "2026-07-20", status: "in-progress" },
  { courseId: "c_5", progress: 12, completedLessonIds: [], lastLessonId: "c_5_m1_l2", lastAccessedAt: "2026-07-18", status: "in-progress" },
  { courseId: "c_2", progress: 100, completedLessonIds: [], lastLessonId: "c_2_m4_l4", lastAccessedAt: "2026-06-30", status: "completed" },
];

/* ----------------------------- Quiz ------------------------------ */

export const quizzes: Quiz[] = [
  {
    id: "q_1",
    courseId: "c_1",
    title: "Product Design Fundamentals",
    description: "Check your understanding of core product-design concepts.",
    durationMinutes: 15,
    passingScore: 70,
    questions: [
      { id: "q_1_1", type: "single", prompt: "What is the primary goal of a wireframe?", options: ["Final visual design", "Layout & structure exploration", "Writing production code", "Choosing brand colours"], correct: [1], explanation: "Wireframes explore layout and structure before visual polish.", points: 10 },
      { id: "q_1_2", type: "multi", prompt: "Which are principles of good UI design? (select all)", options: ["Consistency", "Visual hierarchy", "Random spacing", "Feedback"], correct: [0, 1, 3], explanation: "Consistency, hierarchy and feedback are core; spacing should be systematic.", points: 15 },
      { id: "q_1_3", type: "boolean", prompt: "Accessibility should be considered from the start of a project.", options: ["True", "False"], correct: [0], explanation: "Accessibility is far cheaper to build in from the beginning.", points: 10 },
      { id: "q_1_4", type: "fill", prompt: "The 8-point ___ system keeps spacing consistent.", correct: "grid", explanation: "An 8-point grid system standardises spacing.", points: 10 },
      { id: "q_1_5", type: "code", prompt: "Write a CSS rule to center a flex container's children on both axes.", correct: "display:flex;align-items:center;justify-content:center", explanation: "Flexbox with align-items and justify-content centered.", points: 15 },
    ],
  },
];

/* -------------------------- Assignments -------------------------- */

export const assignments: Assignment[] = [
  { id: "a_1", courseId: "c_1", courseTitle: "Product Design Masterclass", title: "Design a mobile onboarding flow", description: "Create a 3-screen onboarding flow for a fictional fintech app. Submit as a PDF or Figma link.", dueDate: "2026-07-26", points: 100, status: "pending" },
  { id: "a_2", courseId: "c_4", courseTitle: "Full-Stack Web Development", title: "Build a REST API endpoint", description: "Implement a CRUD endpoint with validation and tests.", dueDate: "2026-07-24", points: 100, status: "overdue" },
  { id: "a_3", courseId: "c_5", courseTitle: "Data Science with Python", title: "Exploratory data analysis notebook", description: "Analyse the provided dataset and present three insights.", dueDate: "2026-08-02", points: 100, status: "submitted", submittedAt: "2026-07-19", attachments: [{ name: "eda-notebook.ipynb", size: "1.2 MB" }] },
  { id: "a_4", courseId: "c_2", courseTitle: "Branding & Identity Design", title: "Brand style guide", description: "Deliver a one-page brand style guide.", dueDate: "2026-06-28", points: 100, status: "graded", grade: 92, feedback: "Excellent typographic hierarchy. Consider adding usage do/don't examples next time.", submittedAt: "2026-06-27", attachments: [{ name: "style-guide.pdf", size: "4.8 MB" }] },
];

/* -------------------------- Certificates ------------------------- */

export const certificates: Certificate[] = [
  { id: "cert_1", courseId: "c_2", courseTitle: "Branding & Identity Design", category: "Design", issuedAt: "2026-06-30", credentialId: "WHA-2026-BID-0092", grade: "Distinction", image: `${IMG}/44c8f23c-nextlearn-course-image-2.jpg` },
  { id: "cert_2", courseId: "c_3", courseTitle: "3D Motion Design in Blender", category: "Motion", issuedAt: "2026-05-15", credentialId: "WHA-2026-3MD-0341", grade: "Merit", image: `${IMG}/d474de99-nextlearn-course-image-3.jpg` },
];

/* ------------------------- Notifications ------------------------- */

export const notifications: Notification[] = [
  { id: "n_1", type: "assignment", title: "Assignment due soon", body: "“Design a mobile onboarding flow” is due in 4 days.", createdAt: "2026-07-22T08:10:00Z", read: false, href: "/app/assignments" },
  { id: "n_2", type: "achievement", title: "New achievement unlocked!", body: "You earned the “7-day streak” badge. Keep it up!", createdAt: "2026-07-22T06:30:00Z", read: false, href: "/app/achievements" },
  { id: "n_3", type: "course", title: "New lesson available", body: "A new lesson was added to Full-Stack Web Development.", createdAt: "2026-07-21T15:45:00Z", read: false, href: "/app/my-learning" },
  { id: "n_4", type: "quiz", title: "Quiz graded", body: "You scored 85% on Product Design Fundamentals.", createdAt: "2026-07-20T11:20:00Z", read: true, href: "/app/quizzes" },
  { id: "n_5", type: "message", title: "New message from Alicia Moreno", body: "“Great progress on your latest submission!”", createdAt: "2026-07-19T09:05:00Z", read: true, href: "/app/messages" },
  { id: "n_6", type: "system", title: "New device sign-in", body: "A new sign-in from Chrome on Windows was detected.", createdAt: "2026-07-18T22:00:00Z", read: true, href: "/app/settings/security" },
];

/* -------------------------- Conversations ------------------------ */

export const conversations: Conversation[] = [
  {
    id: "conv_1",
    participant: { id: "in_1", name: "Alicia Moreno", avatar: `${IMG}/486c4179-nestlearn-rectangle-39823-1.jpg`, online: true },
    unread: 2,
    messages: [
      { id: "m1", senderId: "in_1", text: "Hi Rahul! How are you finding the product design course?", createdAt: "2026-07-22T09:00:00Z" },
      { id: "m2", senderId: "u_1", text: "Loving it! The wireframing module was really clear.", createdAt: "2026-07-22T09:02:00Z" },
      { id: "m3", senderId: "in_1", text: "Great to hear. Your onboarding flow submission is looking strong 👏", createdAt: "2026-07-22T09:05:00Z" },
    ],
  },
  {
    id: "conv_2",
    participant: { id: "in_2", name: "David Okafor", avatar: `${IMG}/3a1d96ca-nestlearn-rectangle-39823-2.jpg`, online: false },
    unread: 0,
    messages: [
      { id: "m4", senderId: "in_2", text: "Remember the API assignment is due tomorrow.", createdAt: "2026-07-21T14:00:00Z" },
      { id: "m5", senderId: "u_1", text: "Thanks for the reminder — almost done!", createdAt: "2026-07-21T14:30:00Z" },
    ],
  },
];

/* ---------------------------- Calendar --------------------------- */

export const calendarEvents: CalendarEvent[] = [
  { id: "e_1", title: "Onboarding flow assignment due", date: "2026-07-26", type: "deadline", courseTitle: "Product Design Masterclass" },
  { id: "e_2", title: "Live Q&A: State management", date: "2026-07-24T17:00:00", type: "live-class", courseTitle: "Full-Stack Web Development" },
  { id: "e_3", title: "REST API assignment due", date: "2026-07-24", type: "assignment", courseTitle: "Full-Stack Web Development" },
  { id: "e_4", title: "Product Design quiz", date: "2026-07-28", type: "quiz", courseTitle: "Product Design Masterclass" },
  { id: "e_5", title: "EDA notebook due", date: "2026-08-02", type: "assignment", courseTitle: "Data Science with Python" },
];

/* -------------------------- Achievements ------------------------- */

export const achievements: Achievement[] = [
  { id: "ach_1", title: "First Steps", description: "Completed your first lesson", icon: "footprints", unlocked: true, unlockedAt: "2026-01-15" },
  { id: "ach_2", title: "7-Day Streak", description: "Learned 7 days in a row", icon: "flame", unlocked: true, unlockedAt: "2026-07-22" },
  { id: "ach_3", title: "Quiz Ace", description: "Scored 90%+ on a quiz", icon: "brain", unlocked: true, unlockedAt: "2026-06-12" },
  { id: "ach_4", title: "Course Champion", description: "Completed a full course", icon: "trophy", unlocked: true, unlockedAt: "2026-06-30" },
  { id: "ach_5", title: "Night Owl", description: "Studied after midnight 5 times", icon: "moon", unlocked: false },
  { id: "ach_6", title: "Marathon", description: "30-day learning streak", icon: "medal", unlocked: false },
];

/* -------------------------- Leaderboard -------------------------- */

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user: { name: "Elena Petrova", avatar: `${IMG}/e96e471f-nextlearn-course-image-4.jpg` }, points: 4820, streak: 42 },
  { rank: 2, user: { name: "Kwame Mensah", avatar: `${IMG}/7ea5fc0d-nextlearn-course-image-5.jpg` }, points: 4510, streak: 30 },
  { rank: 3, user: { name: "Yuki Tanaka", avatar: `${IMG}/80ed5538-nextlearn-course-image-1.jpg` }, points: 4190, streak: 21 },
  { rank: 4, user: { name: "Rahul Kaushik", avatar: currentUser.avatar }, points: 3980, streak: 7, isCurrentUser: true },
  { rank: 5, user: { name: "Marco Rossi", avatar: `${IMG}/d474de99-nextlearn-course-image-3.jpg` }, points: 3720, streak: 12 },
  { rank: 6, user: { name: "Sofia Lindqvist", avatar: `${IMG}/44c8f23c-nextlearn-course-image-2.jpg` }, points: 3410, streak: 9 },
];

/* ----------------------------- Notes ----------------------------- */

export const notes: Note[] = [
  { id: "note_1", courseId: "c_1", courseTitle: "Product Design Masterclass", lessonTitle: "Core concepts", timestamp: 184, content: "The 8-point grid keeps everything aligned — start every layout with it.", createdAt: "2026-07-20" },
  { id: "note_2", courseId: "c_4", courseTitle: "Full-Stack Web Development", lessonTitle: "Building the project", timestamp: 512, content: "Remember to validate request bodies with Zod before hitting the DB.", createdAt: "2026-07-19" },
];

export const wishlistIds = ["c_3", "c_6"];
export const bookmarkedLessonIds = ["c_1_m2_l2", "c_4_m1_l3"];

/* --------------------------- Analytics --------------------------- */

export const studyAnalytics: StudyAnalytics = {
  weeklyHours: [
    { day: "Mon", hours: 1.5 },
    { day: "Tue", hours: 2.2 },
    { day: "Wed", hours: 0.8 },
    { day: "Thu", hours: 3.1 },
    { day: "Fri", hours: 1.9 },
    { day: "Sat", hours: 2.7 },
    { day: "Sun", hours: 1.2 },
  ],
  monthlyProgress: [
    { week: "W1", completed: 4 },
    { week: "W2", completed: 7 },
    { week: "W3", completed: 5 },
    { week: "W4", completed: 9 },
  ],
  quizScores: [
    { label: "Design", score: 85 },
    { label: "Web Dev", score: 72 },
    { label: "Data", score: 91 },
    { label: "Branding", score: 88 },
  ],
  completionRate: 64,
  totalHours: 128,
  currentStreak: 7,
  longestStreak: 21,
  goalHours: 15,
  goalProgress: 13.4,
};

/* -------------------------- Admin / Instructor ------------------- */

const NAMES = ["Elena Petrova", "Kwame Mensah", "Yuki Tanaka", "Marco Rossi", "Sofia Lindqvist", "Liam O'Brien", "Nadia Rahman", "James Carter", "Priya Sharma", "Alicia Moreno", "David Okafor", "Chen Wei", "Fatima Zahra", "Diego Santos", "Anna Kowalski"];

export const adminUsers: AdminUserRow[] = NAMES.map((name, i) => ({
  id: `au_${i + 1}`,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}@example.com`,
  avatar: COURSE_IMAGES[i % COURSE_IMAGES.length],
  role: (i < 2 ? "instructor" : i === 2 ? "admin" : "student") as Role,
  status: (i % 7 === 0 ? "suspended" : i % 5 === 0 ? "invited" : "active") as AdminUserRow["status"],
  courses: (i * 3) % 12,
  joinedAt: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
}));

export const auditLogs: AuditLog[] = Array.from({ length: 24 }, (_, i) => ({
  id: `log_${i + 1}`,
  actor: NAMES[i % NAMES.length],
  action: ["logged in", "updated course", "deleted user", "changed role", "published course", "reset password", "exported report"][i % 7],
  target: ["Course #1042", "User au_7", "Settings", "Report Q2", "Role: Instructor"][i % 5],
  ip: `192.168.${i % 5}.${(i * 7) % 255}`,
  at: `2026-07-${String(22 - (i % 20)).padStart(2, "0")}T${String((i % 24)).padStart(2, "0")}:12:00Z`,
}));

export const adminStats: AdminStats = {
  kpis: [
    { label: "Total Users", value: "48,210", delta: "+12.4%", trend: "up" },
    { label: "Active Courses", value: "1,204", delta: "+3.1%", trend: "up" },
    { label: "Monthly Revenue", value: "$284k", delta: "+8.9%", trend: "up" },
    { label: "Refund Rate", value: "1.8%", delta: "-0.3%", trend: "down" },
  ],
  revenue: [
    { month: "Jan", amount: 182 }, { month: "Feb", amount: 205 }, { month: "Mar", amount: 221 },
    { month: "Apr", amount: 240 }, { month: "May", amount: 262 }, { month: "Jun", amount: 258 },
    { month: "Jul", amount: 284 },
  ],
  signups: [
    { month: "Jan", count: 3200 }, { month: "Feb", count: 3800 }, { month: "Mar", count: 4100 },
    { month: "Apr", count: 3900 }, { month: "May", count: 4700 }, { month: "Jun", count: 5200 },
    { month: "Jul", count: 5850 },
  ],
  usersByRole: [
    { label: "Students", value: 44120 },
    { label: "Instructors", value: 3810 },
    { label: "Admins", value: 280 },
  ],
  topCourses: [
    { title: "Full-Stack Web Development", sales: 5100, revenue: 249900 },
    { title: "Data Science with Python", sales: 3700, revenue: 218300 },
    { title: "Ethical Hacking & Security", sales: 2900, revenue: 200100 },
    { title: "3D Motion Design in Blender", sales: 2400, revenue: 0 },
  ],
};

export const instructorStats: InstructorStats = {
  kpis: [
    { label: "Total Students", value: "12,480", delta: "+6.2%", trend: "up" },
    { label: "Active Courses", value: "8", delta: "+1", trend: "up" },
    { label: "Avg. Rating", value: "4.8", delta: "+0.1", trend: "up" },
    { label: "This Month", value: "$8,240", delta: "+14%", trend: "up" },
  ],
  earnings: [
    { month: "Jan", amount: 5.2 }, { month: "Feb", amount: 6.1 }, { month: "Mar", amount: 5.8 },
    { month: "Apr", amount: 7.0 }, { month: "May", amount: 7.6 }, { month: "Jun", amount: 7.2 },
    { month: "Jul", amount: 8.24 },
  ],
  enrollments: [
    { month: "Jan", count: 420 }, { month: "Feb", count: 510 }, { month: "Mar", count: 480 },
    { month: "Apr", count: 620 }, { month: "May", count: 700 }, { month: "Jun", count: 660 },
    { month: "Jul", count: 785 },
  ],
  ratings: [
    { label: "5★", value: 68 }, { label: "4★", value: 22 }, { label: "3★", value: 7 },
    { label: "2★", value: 2 }, { label: "1★", value: 1 },
  ],
};

/* --------------------------- Security ---------------------------- */

export const sessions: Session[] = [
  { id: "s_1", device: "Windows PC", browser: "Chrome 121", location: "Bengaluru, IN", ip: "103.42.11.8", lastActive: "Active now", current: true },
  { id: "s_2", device: "iPhone 15", browser: "Safari", location: "Bengaluru, IN", ip: "103.42.11.9", lastActive: "2 hours ago", current: false },
  { id: "s_3", device: "MacBook Pro", browser: "Firefox", location: "Mumbai, IN", ip: "49.36.220.4", lastActive: "Yesterday", current: false },
];

export const loginHistory: LoginHistoryEntry[] = [
  { id: "lh_1", at: "2026-07-22T08:00:00Z", device: "Chrome · Windows", location: "Bengaluru, IN", ip: "103.42.11.8", status: "success" },
  { id: "lh_2", at: "2026-07-21T19:20:00Z", device: "Safari · iPhone", location: "Bengaluru, IN", ip: "103.42.11.9", status: "success" },
  { id: "lh_3", at: "2026-07-20T02:14:00Z", device: "Unknown · Linux", location: "Kyiv, UA", ip: "185.22.9.1", status: "failed" },
  { id: "lh_4", at: "2026-07-19T11:05:00Z", device: "Firefox · macOS", location: "Mumbai, IN", ip: "49.36.220.4", status: "success" },
];

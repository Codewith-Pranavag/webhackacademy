import { mockRequest } from "@/lib/mock/client";
import { courses, enrollments, assignments } from "@/mocks/db";
import type { CourseSummary, DashboardData, Enrollment } from "@/types";

export const dashboardService = {
  async get(): Promise<DashboardData> {
    return mockRequest(() => {
      const continueLearning = enrollments
        .filter((e) => e.status === "in-progress")
        .map((e) => {
          const c = courses.find((x) => x.id === e.courseId)!;
          const { description, outcomes, requirements, modules, ...summary } = c;
          void description; void outcomes; void requirements; void modules;
          return { ...e, course: summary as CourseSummary } as Enrollment & {
            course: CourseSummary;
          };
        });

      const recommended = courses
        .filter((c) => !enrollments.some((e) => e.courseId === c.id))
        .slice(0, 3)
        .map((c) => {
          const { description, outcomes, requirements, modules, ...summary } = c;
          void description; void outcomes; void requirements; void modules;
          return summary as CourseSummary;
        });

      return {
        stats: [
          { label: "Courses in progress", value: "3", delta: "+1", trend: "up" },
          { label: "Hours learned", value: "128", delta: "+12", trend: "up" },
          { label: "Certificates", value: "2", delta: "+1", trend: "up" },
          { label: "Current streak", value: "7 days", delta: "+2", trend: "up" },
        ],
        continueLearning,
        recommended,
        deadlines: assignments
          .filter((a) => a.status === "pending" || a.status === "overdue")
          .slice(0, 4),
        activity: [
          { id: "act_1", text: "Completed “Core concepts” in Product Design", time: "2h ago", type: "course" },
          { id: "act_2", text: "Scored 85% on Product Design Fundamentals", time: "1d ago", type: "quiz" },
          { id: "act_3", text: "Unlocked the 7-day streak badge", time: "1d ago", type: "achievement" },
          { id: "act_4", text: "Submitted EDA notebook assignment", time: "3d ago", type: "assignment" },
        ],
        streak: 7,
      };
    });
  },
};

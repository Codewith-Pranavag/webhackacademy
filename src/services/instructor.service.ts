import { mockRequest } from "@/lib/mock/client";
import { instructorStats, courses, assignments, adminUsers } from "@/mocks/db";
import type { Assignment, Course, InstructorStats, AdminUserRow } from "@/types";

export const instructorService = {
  async stats(): Promise<InstructorStats> {
    return mockRequest(instructorStats);
  },
  async courses(): Promise<Course[]> {
    return mockRequest(() => courses.filter((c) => c.instructorId === "in_1"));
  },
  async students(): Promise<AdminUserRow[]> {
    return mockRequest(() => adminUsers.filter((u) => u.role === "student"));
  },
  async submissions(): Promise<Assignment[]> {
    return mockRequest(() =>
      assignments.filter((a) => a.status === "submitted" || a.status === "graded"),
    );
  },
};

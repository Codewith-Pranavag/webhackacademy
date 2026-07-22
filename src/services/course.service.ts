import { mockRequest, paginate } from "@/lib/mock/client";
import { courses, enrollments, instructors } from "@/mocks/db";
import type { Course, CourseSummary, Enrollment, Paginated, User } from "@/types";

function toSummary(c: Course): CourseSummary {
  // Course extends CourseSummary, so the extra fields are simply carried.
  const { description, outcomes, requirements, modules, ...summary } = c;
  void description; void outcomes; void requirements; void modules;
  return summary;
}

export const courseService = {
  async list(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    query?: string;
  }): Promise<Paginated<CourseSummary>> {
    const { page = 1, pageSize = 12, category, query } = params ?? {};
    let filtered = courses.map(toSummary);
    if (category && category !== "All")
      filtered = filtered.filter((c) => c.category === category);
    if (query)
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase()),
      );
    return mockRequest(() => paginate(filtered, page, pageSize));
  },

  async getBySlug(slug: string): Promise<Course | null> {
    return mockRequest(() => courses.find((c) => c.slug === slug) ?? null);
  },

  async getById(id: string): Promise<Course | null> {
    return mockRequest(() => courses.find((c) => c.id === id) ?? null);
  },

  async enrollments(): Promise<(Enrollment & { course: CourseSummary })[]> {
    return mockRequest(() =>
      enrollments
        .map((e) => {
          const course = courses.find((c) => c.id === e.courseId);
          return course ? { ...e, course: toSummary(course) } : null;
        })
        .filter((x): x is Enrollment & { course: CourseSummary } => x !== null),
    );
  },

  async instructor(id: string): Promise<User | null> {
    return mockRequest(() => instructors.find((i) => i.id === id) ?? null);
  },
};

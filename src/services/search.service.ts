import { mockRequest } from "@/lib/mock/client";
import { courses, instructors } from "@/mocks/db";
import type { CourseSummary, User } from "@/types";

export interface SearchResults {
  courses: CourseSummary[];
  instructors: User[];
  blog: { title: string; excerpt: string; href: string }[];
}

export const popularSearches = [
  "React",
  "Python",
  "UI Design",
  "Data Science",
  "Cybersecurity",
  "Blender",
];

export const searchService = {
  async query(q: string): Promise<SearchResults> {
    return mockRequest(() => {
      const term = q.toLowerCase().trim();
      const match = (s: string) => s.toLowerCase().includes(term);
      const courseResults = courses
        .filter((c) => !term || match(c.title) || match(c.category) || c.tags.some(match))
        .map((c) => {
          const { description, outcomes, requirements, modules, ...s } = c;
          void description; void outcomes; void requirements; void modules;
          return s as CourseSummary;
        });
      const instructorResults = instructors.filter(
        (i) => !term || match(i.name) || match(i.headline ?? ""),
      );
      const blog = [
        { title: "10 tips to learn faster online", excerpt: "Evidence-based strategies for effective self-study.", href: "#" },
        { title: "How to build a portfolio that gets hired", excerpt: "What hiring managers actually look for.", href: "#" },
      ].filter((b) => !term || match(b.title));
      return { courses: courseResults, instructors: instructorResults, blog };
    });
  },
};

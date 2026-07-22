import { mockRequest } from "@/lib/mock/client";
import { assignments } from "@/mocks/db";
import type { Assignment } from "@/types";

export const assignmentService = {
  async list(): Promise<Assignment[]> {
    return mockRequest(assignments);
  },
  async get(id: string): Promise<Assignment | null> {
    return mockRequest(() => assignments.find((a) => a.id === id) ?? null);
  },
  async submit(
    id: string,
    files: { name: string; size: string }[],
  ): Promise<Assignment> {
    return mockRequest(() => {
      const a = assignments.find((x) => x.id === id)!;
      return {
        ...a,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        attachments: files,
      };
    });
  },
};

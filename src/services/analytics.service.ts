import { mockRequest } from "@/lib/mock/client";
import { studyAnalytics } from "@/mocks/db";
import type { StudyAnalytics } from "@/types";

export const analyticsService = {
  async student(): Promise<StudyAnalytics> {
    return mockRequest(studyAnalytics);
  },
};

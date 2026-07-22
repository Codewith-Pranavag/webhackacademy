import { mockRequest } from "@/lib/mock/client";
import {
  achievements,
  bookmarkedLessonIds,
  calendarEvents,
  certificates,
  courses,
  currentUser,
  leaderboard,
  loginHistory,
  notes,
  sessions,
  wishlistIds,
} from "@/mocks/db";
import type {
  Achievement,
  CalendarEvent,
  CourseSummary,
  LeaderboardEntry,
  LoginHistoryEntry,
  Note,
  Session,
  User,
} from "@/types";

function summarize(ids: string[]): CourseSummary[] {
  return ids
    .map((id) => courses.find((c) => c.id === id))
    .filter((c): c is (typeof courses)[number] => Boolean(c))
    .map((c) => {
      const { description, outcomes, requirements, modules, ...s } = c;
      void description; void outcomes; void requirements; void modules;
      return s as CourseSummary;
    });
}

export const userService = {
  async profile(): Promise<User> {
    return mockRequest(currentUser);
  },
  async updateProfile(patch: Partial<User>): Promise<User> {
    return mockRequest(() => ({ ...currentUser, ...patch }));
  },
  async achievements(): Promise<Achievement[]> {
    return mockRequest(achievements);
  },
  async leaderboard(): Promise<LeaderboardEntry[]> {
    return mockRequest(leaderboard);
  },
  async wishlist(): Promise<CourseSummary[]> {
    return mockRequest(() => summarize(wishlistIds));
  },
  async bookmarks(): Promise<{ ids: string[] }> {
    return mockRequest({ ids: bookmarkedLessonIds });
  },
  async notes(): Promise<Note[]> {
    return mockRequest(notes);
  },
  async downloads(): Promise<CourseSummary[]> {
    return mockRequest(() => summarize(["c_1", "c_2"]));
  },
  async calendar(): Promise<CalendarEvent[]> {
    return mockRequest(calendarEvents);
  },
  async sessions(): Promise<Session[]> {
    return mockRequest(sessions);
  },
  async loginHistory(): Promise<LoginHistoryEntry[]> {
    return mockRequest(loginHistory);
  },
  async certificatesCount(): Promise<number> {
    return mockRequest(certificates.length);
  },
};

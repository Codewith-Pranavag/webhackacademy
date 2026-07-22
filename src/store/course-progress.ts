"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProgressState {
  /** courseId -> set of completed lesson ids */
  completed: Record<string, string[]>;
  /** courseId -> last viewed lesson id */
  lastLesson: Record<string, string>;
  bookmarks: string[];
  toggleLesson: (courseId: string, lessonId: string) => void;
  isComplete: (courseId: string, lessonId: string) => boolean;
  setLastLesson: (courseId: string, lessonId: string) => void;
  progressFor: (courseId: string, totalLessons: number) => number;
  toggleBookmark: (lessonId: string) => void;
  isBookmarked: (lessonId: string) => boolean;
}

export const useCourseProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      lastLesson: {},
      bookmarks: [],

      toggleLesson(courseId, lessonId) {
        const list = get().completed[courseId] ?? [];
        const next = list.includes(lessonId)
          ? list.filter((id) => id !== lessonId)
          : [...list, lessonId];
        set({ completed: { ...get().completed, [courseId]: next } });
      },

      isComplete: (courseId, lessonId) =>
        (get().completed[courseId] ?? []).includes(lessonId),

      setLastLesson(courseId, lessonId) {
        set({ lastLesson: { ...get().lastLesson, [courseId]: lessonId } });
      },

      progressFor(courseId, totalLessons) {
        if (!totalLessons) return 0;
        const done = (get().completed[courseId] ?? []).length;
        return Math.round((done / totalLessons) * 100);
      },

      toggleBookmark(lessonId) {
        const b = get().bookmarks;
        set({
          bookmarks: b.includes(lessonId)
            ? b.filter((id) => id !== lessonId)
            : [...b, lessonId],
        });
      },

      isBookmarked: (lessonId) => get().bookmarks.includes(lessonId),
    }),
    { name: "wha-progress", storage: createJSONStorage(() => localStorage) },
  ),
);

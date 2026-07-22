"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, Circle, PlayCircle, FileText, HelpCircle, X } from "lucide-react";
import { ProgressBar } from "@/components/ui/Progress";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Course, Lesson } from "@/types";

const typeIcon = {
  video: PlayCircle,
  reading: FileText,
  quiz: HelpCircle,
};

export function LessonSidebar({
  course,
  currentLessonId,
  isComplete,
  progress,
  onSelect,
  onClose,
}: {
  course: Course;
  currentLessonId: string;
  isComplete: (lessonId: string) => boolean;
  progress: number;
  onSelect: (lesson: Lesson) => void;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(course.modules.map((m) => [m.id, true])),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line p-5">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{course.title}</p>
          <p className="mt-1 text-xs text-muted">{progress}% complete</p>
          <ProgressBar value={progress} className="mt-2" tone="green" />
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-3 text-muted lg:hidden" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {course.modules.map((m, mi) => (
          <div key={m.id} className="border-b border-line">
            <button
              onClick={() => setOpen((s) => ({ ...s, [m.id]: !s[m.id] }))}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="min-w-0">
                <span className="block text-xs text-muted">Module {mi + 1}</span>
                <span className="block truncate text-sm font-semibold text-ink">
                  {m.title.replace(/^Module \d+: /, "")}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted transition-transform",
                  open[m.id] && "rotate-180",
                )}
              />
            </button>
            {open[m.id] && (
              <ul className="pb-2">
                {m.lessons.map((lesson) => {
                  const Icon = typeIcon[lesson.type];
                  const done = isComplete(lesson.id);
                  const active = lesson.id === currentLessonId;
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => onSelect(lesson)}
                        className={cn(
                          "flex w-full items-start gap-3 px-5 py-2.5 text-left text-sm transition-colors",
                          active ? "bg-violet-50" : "hover:bg-surface-soft",
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                        ) : (
                          <Circle className="mt-0.5 h-4 w-4 shrink-0 text-line" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block truncate",
                              active ? "font-medium text-violet-deep" : "text-ink/80",
                            )}
                          >
                            {lesson.title}
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                            <Icon className="h-3.5 w-3.5" />
                            {lesson.type === "quiz" ? "Quiz" : formatDuration(lesson.duration)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

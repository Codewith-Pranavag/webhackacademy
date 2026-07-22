import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { ProgressBar } from "@/components/ui/Progress";
import type { CourseSummary, Enrollment } from "@/types";

export function ContinueLearningCard({
  item,
}: {
  item: Enrollment & { course: CourseSummary };
}) {
  const { course, progress, lastLessonId } = item;
  return (
    <Link
      href={`/app/learn/${course.slug}?lesson=${lastLessonId}`}
      className="group flex gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-3 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-[var(--radius)]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="128px"
          className="object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-ink/30 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-violet-deep">
            <Play className="h-4 w-4 fill-current" />
          </span>
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-violet">
          {course.category}
        </span>
        <h4 className="truncate font-semibold text-ink">{course.title}</h4>
        <div className="flex items-center gap-3">
          <ProgressBar value={progress} className="flex-1" />
          <span className="text-sm font-medium text-ink">{progress}%</span>
        </div>
      </div>
    </Link>
  );
}

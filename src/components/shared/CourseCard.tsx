import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users } from "lucide-react";
import type { Course } from "@/constants/data";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

export function CourseCard({ course }: { course: Course }) {
  const isFree = course.price.toLowerCase() === "free";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-[var(--shadow-card)] transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5">
      <Link href={`/courses/${course.slug}`} className="relative block overflow-hidden">
        <div className="relative aspect-[16/11] w-full">
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <span
          className={cn(
            "absolute left-4 top-4 rounded-pill px-3 py-1 text-xs font-semibold text-white",
            isFree ? "bg-green" : "bg-violet-deep",
          )}
        >
          {course.price}
        </span>
        <span className="absolute right-4 top-4 rounded-pill bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
          {course.level}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-violet">
          {course.category}
        </span>
        <h4 className="text-lg font-semibold leading-snug">
          <Link
            href={`/courses/${course.slug}`}
            className="transition-colors hover:text-violet-deep"
          >
            {course.title}
          </Link>
        </h4>

        <div className="flex items-center gap-2 text-sm text-muted">
          <StarRating rating={course.rating} size={15} />
          <span className="font-medium text-ink">{course.rating.toFixed(1)}</span>
        </div>

        <div className="mt-auto flex items-center gap-5 border-t border-line pt-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-violet" />
            {course.lessons} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-violet" />
            {course.students}
          </span>
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className="mt-1 inline-flex items-center justify-center rounded-pill border border-violet-deep/20 py-2.5 text-sm font-semibold text-violet-deep transition-all hover:bg-violet-deep hover:text-white"
        >
          Enroll Now
        </Link>
      </div>
    </article>
  );
}

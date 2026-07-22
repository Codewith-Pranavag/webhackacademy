"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, PlayCircle, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { courseService } from "@/services/course.service";
import type { CourseSummary, Enrollment } from "@/types";

type EnrolledCourse = Enrollment & { course: CourseSummary };
type TabId = "all" | "in-progress" | "completed";

export default function MyLearningPage() {
  const [tab, setTab] = useState<TabId>("all");
  const { data, loading, error, refetch } = useAsync(() =>
    courseService.enrollments(),
  );

  const items = data ?? [];
  const inProgress = items.filter((e) => e.status === "in-progress");
  const completed = items.filter((e) => e.status === "completed");
  const shown =
    tab === "in-progress" ? inProgress : tab === "completed" ? completed : items;

  return (
    <div>
      <PageHeader
        title="My Learning"
        description="Pick up where you left off and keep the momentum going."
      />

      <Tabs
        className="mb-6"
        active={tab}
        onChange={(id) => setTab(id as TabId)}
        tabs={[
          { id: "all", label: "All", icon: <BookOpen className="h-4 w-4" />, count: items.length },
          { id: "in-progress", label: "In progress", icon: <PlayCircle className="h-4 w-4" />, count: inProgress.length },
          { id: "completed", label: "Completed", icon: <CheckCircle2 className="h-4 w-4" />, count: completed.length },
        ]}
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-7 w-7" />}
          title="No courses here yet"
          description="Enrol in a course to start learning and it will show up in this list."
          action={
            <Button href="/courses" size="sm">
              Browse courses
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((item) => (
            <LearningCard key={item.courseId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function LearningCard({ item }: { item: EnrolledCourse }) {
  const { course, progress, status } = item;
  const done = status === "completed";
  return (
    <Card className="flex flex-col gap-4 p-0">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[var(--radius-lg)]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
        <span className="absolute left-3 top-3">
          <Badge tone={done ? "green" : "violet"}>
            {done ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Completed
              </>
            ) : (
              <>
                <Clock className="h-3.5 w-3.5" /> In progress
              </>
            )}
          </Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <span className="text-xs font-medium uppercase tracking-wide text-violet">
          {course.category}
        </span>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink">
          {course.title}
        </h3>

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Progress</span>
            <span className="font-semibold text-ink">{progress}%</span>
          </div>
          <ProgressBar value={progress} tone={done ? "green" : "violet"} />
        </div>

        <Button
          href={`/app/learn/${course.slug}`}
          variant={done ? "outline" : "primary"}
          size="sm"
          className="mt-2 w-full"
        >
          {done ? "Review course" : "Continue"}
        </Button>
      </div>
    </Card>
  );
}

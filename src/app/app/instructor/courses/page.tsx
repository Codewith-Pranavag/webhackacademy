"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Star, Users, PlayCircle, BookOpen, Pencil } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { instructorService } from "@/services/instructor.service";
import { toast } from "@/store/toast";
import { formatNumber } from "@/lib/format";
import { CreateCourseDialog } from "./_components/CreateCourseDialog";
import { courseStatusFor, STATUS_TONE } from "../_components/helpers";

export default function InstructorCoursesPage() {
  const { data, loading, error, refetch } = useAsync(() => instructorService.courses());
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageHeader
        title="My courses"
        description="Manage the courses you teach and publish new ones."
        action={
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> New course
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : data && data.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((course) => {
            const status = courseStatusFor(course);
            return (
              <Card key={course.id} className="flex flex-col gap-4 p-0">
                <div className="relative h-40 w-full overflow-hidden rounded-t-[var(--radius-lg)]">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3">
                    <Badge tone={STATUS_TONE[status]} className="capitalize">
                      {status}
                    </Badge>
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
                  <div>
                    <p className="text-xs font-medium text-muted">{course.category}</p>
                    <h3 className="mt-1 line-clamp-2 font-semibold text-ink">{course.title}</h3>
                  </div>

                  <dl className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col items-center gap-1 rounded-[var(--radius)] bg-surface-soft py-2">
                      <dt className="flex items-center gap-1 text-xs text-muted">
                        <Users className="h-3.5 w-3.5" /> Students
                      </dt>
                      <dd className="font-semibold text-ink">{formatNumber(course.students)}</dd>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-[var(--radius)] bg-surface-soft py-2">
                      <dt className="flex items-center gap-1 text-xs text-muted">
                        <Star className="h-3.5 w-3.5" /> Rating
                      </dt>
                      <dd className="font-semibold text-ink">{course.rating.toFixed(1)}</dd>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-[var(--radius)] bg-surface-soft py-2">
                      <dt className="flex items-center gap-1 text-xs text-muted">
                        <PlayCircle className="h-3.5 w-3.5" /> Lessons
                      </dt>
                      <dd className="font-semibold text-ink">{course.lessons}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-bold text-violet-deep">
                      {course.price}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        href={`/courses/${course.slug}`}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          toast.info("Course editor", `Opening “${course.title}” for editing.`)
                        }
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No courses yet"
          description="Create your first course to start teaching."
          icon={<BookOpen className="h-7 w-7" />}
          action={
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> New course
            </Button>
          }
        />
      )}

      <CreateCourseDialog open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}

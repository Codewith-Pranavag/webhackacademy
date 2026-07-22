"use client";

import Image from "next/image";
import { Download, HardDriveDownload, CheckCircle2, WifiOff } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/user.service";
import type { CourseSummary } from "@/types";

/** Deterministic pseudo-size derived from the course so the UI stays stable. */
function courseSize(course: CourseSummary): string {
  const mb = 180 + (course.lessons % 9) * 65 + course.durationHours * 12;
  return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
}

export default function DownloadsPage() {
  const { data, loading, error, refetch } = useAsync(() =>
    userService.downloads(),
  );

  return (
    <div>
      <PageHeader
        title="Downloads"
        description="Courses saved to this device for offline learning."
      />

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<HardDriveDownload className="h-7 w-7" />}
          title="No downloads yet"
          description="Download lessons to keep learning even when you're offline."
        />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {data.map((course) => (
              <li
                key={course.id}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-soft sm:p-5"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[var(--radius)]">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {course.title}
                  </p>
                  <p className="truncate text-xs text-muted">{course.category}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge tone="green">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Downloaded for offline
                    </Badge>
                    <Badge tone="neutral">
                      <WifiOff className="h-3.5 w-3.5" /> {course.lessons} lessons
                    </Badge>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-deep">
                    <Download className="h-4 w-4" />
                    {courseSize(course)}
                  </span>
                  <span className="text-xs text-muted">Saved on device</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

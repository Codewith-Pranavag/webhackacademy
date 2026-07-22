"use client";

import { Users, BookOpen, Star, DollarSign, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Skeleton, ErrorState } from "@/components/ui/feedback";
import { AreaChart, BarChart, DonutChart } from "@/components/ui/charts";
import { ProgressBar } from "@/components/ui/Progress";
import { useAsync } from "@/hooks/useAsync";
import { instructorService } from "@/services/instructor.service";
import { formatNumber } from "@/lib/format";

const KPI_ICONS = [
  <Users key="u" className="h-5 w-5" />,
  <BookOpen key="b" className="h-5 w-5" />,
  <Star key="s" className="h-5 w-5" />,
  <DollarSign key="d" className="h-5 w-5" />,
];

export default function InstructorAnalyticsPage() {
  const { data, loading, error, refetch } = useAsync(() => instructorService.stats());
  const courses = useAsync(() => instructorService.courses());

  const topContent = [...(courses.data ?? [])]
    .sort((a, b) => b.students - a.students)
    .slice(0, 5);
  const maxStudents = topContent[0]?.students ?? 1;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="A deeper look at how your courses are performing."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          : data?.kpis.map((k, i) => (
              <StatCard
                key={k.label}
                label={k.label}
                value={k.value}
                delta={k.delta}
                trend={k.trend}
                icon={KPI_ICONS[i]}
              />
            ))}
      </div>

      {error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="grid gap-7 lg:grid-cols-3">
          <div className="flex flex-col gap-7 lg:col-span-2">
            <Card>
              <CardHeader title="Earnings over time" />
              {loading ? (
                <Skeleton className="h-56" />
              ) : data ? (
                <AreaChart
                  data={data.earnings.map((e) => ({ label: e.month, value: e.amount }))}
                  valueSuffix="k"
                />
              ) : null}
            </Card>

            <Card>
              <CardHeader title="Enrollments" />
              {loading ? (
                <Skeleton className="h-56" />
              ) : data ? (
                <BarChart
                  data={data.enrollments.map((e) => ({ label: e.month, value: e.count }))}
                />
              ) : null}
            </Card>

            <Card>
              <CardHeader title="Top performing content" />
              {courses.loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {topContent.map((c, i) => (
                    <li key={c.id} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-sm font-bold text-violet-deep">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-medium text-ink">{c.title}</p>
                          <span className="shrink-0 text-xs text-muted">
                            {formatNumber(c.students)} students
                          </span>
                        </div>
                        <ProgressBar value={(c.students / maxStudents) * 100} className="mt-1.5" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-7">
            <Card>
              <CardHeader title="Ratings breakdown" />
              {loading ? (
                <Skeleton className="h-56" />
              ) : data ? (
                <DonutChart
                  data={data.ratings}
                  centerLabel="Avg. rating"
                  centerValue={data.kpis[2]?.value ?? "—"}
                />
              ) : null}
            </Card>

            <Card className="bg-gradient-to-br from-violet-deep to-violet text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-xl font-bold">Momentum is up</p>
                  <p className="text-sm text-white/80">
                    Enrollments grew steadily over the last quarter.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

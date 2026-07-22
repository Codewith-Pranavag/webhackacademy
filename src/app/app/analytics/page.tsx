"use client";

import { Clock, Target, Flame, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { ProgressBar, ProgressRing } from "@/components/ui/Progress";
import { AreaChart, BarChart, DonutChart } from "@/components/ui/charts";
import { Skeleton, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { analyticsService } from "@/services/analytics.service";

export default function AnalyticsPage() {
  const { data, loading, error, refetch } = useAsync(() =>
    analyticsService.student(),
  );

  return (
    <div>
      <PageHeader
        title="Learning analytics"
        description="Track your study habits, progress and quiz performance."
      />

      {loading ? (
        <div className="flex flex-col gap-7">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-7 lg:grid-cols-3">
            <Skeleton className="h-72 lg:col-span-2" />
            <Skeleton className="h-72" />
          </div>
        </div>
      ) : error || !data ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          {/* Stats */}
          <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total hours"
              value={`${data.totalHours}h`}
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              label="Completion rate"
              value={`${data.completionRate}%`}
              icon={<Target className="h-5 w-5" />}
            />
            <StatCard
              label="Current streak"
              value={`${data.currentStreak} days`}
              icon={<Flame className="h-5 w-5" />}
            />
            <StatCard
              label="Longest streak"
              value={`${data.longestStreak} days`}
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>

          <div className="grid gap-7 lg:grid-cols-3">
            {/* Main column */}
            <div className="flex flex-col gap-7 lg:col-span-2">
              <Card>
                <CardHeader title="Study hours this week" />
                <AreaChart
                  data={data.weeklyHours.map((d) => ({
                    label: d.day,
                    value: d.hours,
                  }))}
                  valueSuffix="h"
                />
              </Card>

              <Card>
                <CardHeader title="Lessons completed by week" />
                <BarChart
                  data={data.monthlyProgress.map((d) => ({
                    label: d.week,
                    value: d.completed,
                  }))}
                />
              </Card>

              <Card>
                <CardHeader title="Quiz scores by topic" />
                <DonutChart
                  data={data.quizScores.map((d) => ({
                    label: d.label,
                    value: d.score,
                  }))}
                  centerLabel="topics"
                  centerValue={String(data.quizScores.length)}
                />
              </Card>
            </div>

            {/* Side column */}
            <div className="flex flex-col gap-7">
              <Card className="flex flex-col items-center gap-4">
                <CardHeader title="Overall completion" className="w-full" />
                <ProgressRing value={data.completionRate} size={160} label="complete" />
                <p className="text-center text-sm text-body">
                  You&apos;ve completed {data.completionRate}% of your enrolled
                  course content.
                </p>
              </Card>

              <Card>
                <CardHeader title="Weekly goal" />
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-display text-3xl font-bold text-ink">
                      {data.goalProgress}h
                    </span>
                    <span className="text-sm text-muted"> / {data.goalHours}h</span>
                  </div>
                  <span className="text-sm font-semibold text-violet-deep">
                    {Math.round((data.goalProgress / data.goalHours) * 100)}%
                  </span>
                </div>
                <ProgressBar
                  className="mt-3"
                  value={(data.goalProgress / data.goalHours) * 100}
                />
                <p className="mt-3 text-sm text-body">
                  {data.goalProgress >= data.goalHours
                    ? "Goal reached — great work this week!"
                    : `${(data.goalHours - data.goalProgress).toFixed(1)}h left to hit your weekly goal.`}
                </p>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

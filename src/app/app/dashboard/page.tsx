"use client";

import Link from "next/link";
import {
  BookOpen,
  Clock,
  Award,
  Flame,
  ArrowRight,
  CalendarClock,
  Trophy,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { ContinueLearningCard } from "@/components/app/ContinueLearningCard";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { AreaChart } from "@/components/ui/charts";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { CourseCard } from "@/components/shared/CourseCard";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/store/auth";
import { dashboardService } from "@/services/dashboard.service";
import { analyticsService } from "@/services/analytics.service";
import { userService } from "@/services/user.service";
import { formatDate } from "@/lib/format";
import type { Course } from "@/constants/data";

const STAT_ICONS = [
  <BookOpen key="b" className="h-5 w-5" />,
  <Clock key="c" className="h-5 w-5" />,
  <Award key="a" className="h-5 w-5" />,
  <Flame key="f" className="h-5 w-5" />,
];

export default function DashboardPage() {
  const user = useAuth((s) => s.user);
  const { data, loading, error, refetch } = useAsync(() => dashboardService.get());
  const analytics = useAsync(() => analyticsService.student());
  const board = useAsync(() => userService.leaderboard());

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"} 👋`}
        description="Here's what's happening with your learning today."
      />

      {/* Stats */}
      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))
          : data?.stats.map((s, i) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                delta={s.delta}
                trend={s.trend}
                icon={STAT_ICONS[i]}
              />
            ))}
      </div>

      <div className="grid gap-7 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-7 lg:col-span-2">
          {/* Continue learning */}
          <Card>
            <CardHeader
              title="Continue Learning"
              action={
                <Link
                  href="/app/my-learning"
                  className="inline-flex items-center gap-1 text-sm font-medium text-violet-deep hover:underline"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            {loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-28" />
                ))}
              </div>
            ) : error ? (
              <ErrorState onRetry={refetch} />
            ) : data && data.continueLearning.length > 0 ? (
              <div className="flex flex-col gap-3">
                {data.continueLearning.map((item) => (
                  <ContinueLearningCard key={item.courseId} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nothing in progress"
                description="Enroll in a course to start learning."
                icon={<BookOpen className="h-7 w-7" />}
              />
            )}
          </Card>

          {/* Study analytics */}
          <Card>
            <CardHeader
              title="Study time this week"
              action={
                <Link
                  href="/app/analytics"
                  className="text-sm font-medium text-violet-deep hover:underline"
                >
                  Details
                </Link>
              }
            />
            {analytics.loading ? (
              <Skeleton className="h-56" />
            ) : analytics.data ? (
              <AreaChart
                data={analytics.data.weeklyHours.map((d) => ({
                  label: d.day,
                  value: d.hours,
                }))}
                valueSuffix="h"
              />
            ) : null}
          </Card>

          {/* Recommended */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-deep" />
              <h3 className="text-lg font-semibold text-ink">Recommended for you</h3>
            </div>
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-80" />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data?.recommended.map((c) => (
                  <CourseCard key={c.id} course={c as unknown as Course} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-7">
          {/* Streak */}
          <Card className="bg-gradient-to-br from-violet-deep to-violet text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Flame className="h-6 w-6 text-amber" />
              </span>
              <div>
                <p className="font-display text-3xl font-bold">{data?.streak ?? 7} days</p>
                <p className="text-sm text-white/80">Current learning streak</p>
              </div>
            </div>
            <div className="mt-5 flex justify-between gap-1.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <span
                    className={`flex h-9 w-full items-center justify-center rounded-lg text-xs font-semibold ${
                      i < 5 ? "bg-white/25 text-white" : "bg-white/10 text-white/50"
                    }`}
                  >
                    {i < 5 ? "✓" : ""}
                  </span>
                  <span className="text-[0.65rem] text-white/70">{d}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Deadlines */}
          <Card>
            <CardHeader title="Upcoming deadlines" />
            {loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : data && data.deadlines.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {data.deadlines.map((a) => (
                  <li key={a.id}>
                    <Link
                      href="/app/assignments"
                      className="flex items-start gap-3 rounded-[var(--radius)] p-2 transition-colors hover:bg-surface-soft"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-deep">
                        <CalendarClock className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                        <p className="truncate text-xs text-muted">{a.courseTitle}</p>
                      </div>
                      <Badge tone={a.status === "overdue" ? "orange" : "amber"}>
                        {formatDate(a.dueDate, { year: undefined })}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="All caught up!" description="No upcoming deadlines." />
            )}
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader title="Recent activity" />
            {loading ? (
              <Skeleton className="h-40" />
            ) : (
              <ol className="relative flex flex-col gap-4 border-l border-line pl-5">
                {data?.activity.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[1.42rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-violet-deep" />
                    <p className="text-sm text-ink">{a.text}</p>
                    <p className="text-xs text-muted">{a.time}</p>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          {/* Mini leaderboard */}
          <Card>
            <CardHeader
              title="Leaderboard"
              action={
                <span className="inline-flex items-center gap-1 text-sm text-muted">
                  <Trophy className="h-4 w-4 text-amber" /> This week
                </span>
              }
            />
            {board.loading ? (
              <Skeleton className="h-40" />
            ) : (
              <ul className="flex flex-col gap-2">
                {board.data?.slice(0, 5).map((entry) => (
                  <li
                    key={entry.rank}
                    className={`flex items-center gap-3 rounded-[var(--radius)] px-2 py-1.5 ${
                      entry.isCurrentUser ? "bg-violet-50" : ""
                    }`}
                  >
                    <span className="w-5 text-center text-sm font-bold text-muted">
                      {entry.rank}
                    </span>
                    <Avatar src={entry.user.avatar} name={entry.user.name} size={32} />
                    <span className="flex-1 truncate text-sm font-medium text-ink">
                      {entry.user.name}
                      {entry.isCurrentUser && (
                        <span className="ml-1 text-xs text-violet-deep">(You)</span>
                      )}
                    </span>
                    <span className="text-sm font-semibold text-violet-deep">
                      {entry.points.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

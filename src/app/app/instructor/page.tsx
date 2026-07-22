"use client";

import Link from "next/link";
import {
  Users,
  BookOpen,
  Star,
  DollarSign,
  ArrowRight,
  FileText,
  ClipboardCheck,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { AreaChart, BarChart, DonutChart } from "@/components/ui/charts";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useAsync } from "@/hooks/useAsync";
import { instructorService } from "@/services/instructor.service";
import { studentForId } from "./_components/helpers";
import type { AssignmentStatus } from "@/types";

const KPI_ICONS = [
  <Users key="u" className="h-5 w-5" />,
  <BookOpen key="b" className="h-5 w-5" />,
  <Star key="s" className="h-5 w-5" />,
  <DollarSign key="d" className="h-5 w-5" />,
];

const SUBMISSION_TONE: Record<AssignmentStatus, "amber" | "green" | "sky" | "orange"> = {
  submitted: "amber",
  graded: "green",
  pending: "sky",
  overdue: "orange",
};

export default function InstructorDashboardPage() {
  const { data, loading, error, refetch } = useAsync(() => instructorService.stats());
  const submissions = useAsync(() => instructorService.submissions());

  return (
    <div>
      <PageHeader
        title="Instructor dashboard"
        description="Track your students, earnings and course performance at a glance."
      />

      {/* KPIs */}
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

      <div className="grid gap-7 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-7 lg:col-span-2">
          <Card>
            <CardHeader
              title="Earnings"
              action={
                <Link
                  href="/app/instructor/earnings"
                  className="inline-flex items-center gap-1 text-sm font-medium text-violet-deep hover:underline"
                >
                  Details <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            {loading ? (
              <Skeleton className="h-56" />
            ) : error ? (
              <ErrorState onRetry={refetch} />
            ) : data ? (
              <AreaChart
                data={data.earnings.map((e) => ({ label: e.month, value: e.amount }))}
                valueSuffix="k"
              />
            ) : null}
          </Card>

          <Card>
            <CardHeader
              title="Monthly enrollments"
              action={
                <Link
                  href="/app/instructor/analytics"
                  className="text-sm font-medium text-violet-deep hover:underline"
                >
                  Analytics
                </Link>
              }
            />
            {loading ? (
              <Skeleton className="h-56" />
            ) : data ? (
              <BarChart
                data={data.enrollments.map((e) => ({ label: e.month, value: e.count }))}
              />
            ) : null}
          </Card>

          <Card>
            <CardHeader
              title="Recent submissions to review"
              action={
                <Link
                  href="/app/instructor/submissions"
                  className="inline-flex items-center gap-1 text-sm font-medium text-violet-deep hover:underline"
                >
                  Review queue <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            {submissions.loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : submissions.error ? (
              <ErrorState onRetry={submissions.refetch} />
            ) : submissions.data && submissions.data.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {submissions.data.slice(0, 4).map((a) => (
                  <li key={a.id}>
                    <Link
                      href="/app/instructor/submissions"
                      className="flex items-center gap-3 rounded-[var(--radius)] p-2 transition-colors hover:bg-surface-soft"
                    >
                      <Avatar name={studentForId(a.id)} size={38} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                        <p className="truncate text-xs text-muted">
                          {studentForId(a.id)} · {a.courseTitle}
                        </p>
                      </div>
                      <Badge tone={SUBMISSION_TONE[a.status]}>{a.status}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="Nothing to review"
                description="Submissions from your students will appear here."
                icon={<ClipboardCheck className="h-7 w-7" />}
              />
            )}
          </Card>
        </div>

        {/* Side column */}
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
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <FileText className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-2xl font-bold">Grow your audience</p>
                <p className="text-sm text-white/80">
                  Post an announcement to keep learners engaged.
                </p>
              </div>
            </div>
            <Link
              href="/app/instructor/announcements"
              className="mt-5 inline-flex items-center gap-1 rounded-pill bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
            >
              New announcement <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

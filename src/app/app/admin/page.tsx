"use client";

import { Users, BookOpen, DollarSign, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Skeleton, ErrorState } from "@/components/ui/feedback";
import { AreaChart, BarChart, DonutChart } from "@/components/ui/charts";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/admin.service";
import { formatMoney, formatNumber } from "@/lib/format";
import type { AdminStats } from "@/types";

const KPI_ICONS = [
  <Users key="u" className="h-5 w-5" />,
  <BookOpen key="b" className="h-5 w-5" />,
  <DollarSign key="d" className="h-5 w-5" />,
  <TrendingDown key="t" className="h-5 w-5" />,
];

type TopCourse = AdminStats["topCourses"][number];

const topColumns: Column<TopCourse & { id: string }>[] = [
  {
    key: "title",
    header: "Course",
    render: (r) => <span className="font-medium text-ink">{r.title}</span>,
  },
  {
    key: "sales",
    header: "Sales",
    align: "right",
    render: (r) => formatNumber(r.sales),
  },
  {
    key: "revenue",
    header: "Revenue",
    align: "right",
    render: (r) => (
      <span className="font-semibold text-violet-deep">{formatMoney(r.revenue)}</span>
    ),
  },
];

export default function AdminDashboardPage() {
  const { data, loading, error, refetch } = useAsync(() => adminService.stats());

  return (
    <div>
      <PageHeader
        title="Admin overview"
        description="Platform health, revenue and growth at a glance."
      />

      {error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          {/* KPIs */}
          <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))
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
            {/* Revenue */}
            <Card className="lg:col-span-2">
              <CardHeader title="Revenue" />
              {loading ? (
                <Skeleton className="h-56" />
              ) : (
                <AreaChart
                  data={
                    data?.revenue.map((r) => ({
                      label: r.month,
                      value: r.amount,
                    })) ?? []
                  }
                  valueSuffix="k"
                />
              )}
            </Card>

            {/* Users by role */}
            <Card>
              <CardHeader title="Users by role" />
              {loading ? (
                <Skeleton className="h-56" />
              ) : (
                <DonutChart
                  data={data?.usersByRole ?? []}
                  centerLabel="Total"
                  centerValue={formatNumber(
                    (data?.usersByRole ?? []).reduce((s, d) => s + d.value, 0),
                  )}
                />
              )}
            </Card>

            {/* Signups */}
            <Card className="lg:col-span-2">
              <CardHeader title="New signups" />
              {loading ? (
                <Skeleton className="h-56" />
              ) : (
                <BarChart
                  data={
                    data?.signups.map((s) => ({
                      label: s.month,
                      value: s.count,
                    })) ?? []
                  }
                />
              )}
            </Card>

            {/* Top courses */}
            <Card className="lg:col-span-1">
              <CardHeader title="Top courses" />
              {loading ? (
                <Skeleton className="h-56" />
              ) : (
                <DataTable
                  columns={topColumns}
                  rows={(data?.topCourses ?? []).map((c, i) => ({
                    ...c,
                    id: `top_${i}`,
                  }))}
                  emptyLabel="No sales yet."
                />
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

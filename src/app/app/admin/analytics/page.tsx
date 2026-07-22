"use client";

import { Users, BookOpen, DollarSign, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Skeleton, ErrorState } from "@/components/ui/feedback";
import { AreaChart, BarChart, DonutChart } from "@/components/ui/charts";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/admin.service";
import { formatNumber } from "@/lib/format";

const KPI_ICONS = [
  <Users key="u" className="h-5 w-5" />,
  <BookOpen key="b" className="h-5 w-5" />,
  <DollarSign key="d" className="h-5 w-5" />,
  <TrendingDown key="t" className="h-5 w-5" />,
];

// Fabricated retention cohorts (week-over-week % still active).
const COHORTS: { cohort: string; size: number; weeks: number[] }[] = [
  { cohort: "Jun W1", size: 4200, weeks: [100, 68, 54, 47, 41] },
  { cohort: "Jun W2", size: 3980, weeks: [100, 71, 58, 49, 44] },
  { cohort: "Jun W3", size: 4510, weeks: [100, 66, 51, 45, 0] },
  { cohort: "Jun W4", size: 4340, weeks: [100, 73, 60, 0, 0] },
  { cohort: "Jul W1", size: 4890, weeks: [100, 70, 0, 0, 0] },
];

function retentionTone(v: number): string {
  if (v === 0) return "transparent";
  const alpha = 0.12 + (v / 100) * 0.55;
  return `rgba(86, 51, 209, ${alpha.toFixed(2)})`;
}

export default function AdminAnalyticsPage() {
  const { data, loading, error, refetch } = useAsync(() => adminService.stats());

  return (
    <div>
      <PageHeader
        title="Platform analytics"
        description="Revenue, acquisition and retention trends."
      />

      {error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
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

          <div className="mb-7 grid gap-7 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="Revenue trend" />
              {loading ? (
                <Skeleton className="h-56" />
              ) : (
                <AreaChart
                  data={
                    data?.revenue.map((r) => ({ label: r.month, value: r.amount })) ?? []
                  }
                  valueSuffix="k"
                />
              )}
            </Card>

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

            <Card className="lg:col-span-3">
              <CardHeader title="New signups" />
              {loading ? (
                <Skeleton className="h-56" />
              ) : (
                <BarChart
                  data={
                    data?.signups.map((s) => ({ label: s.month, value: s.count })) ?? []
                  }
                />
              )}
            </Card>
          </div>

          {/* Retention cohorts */}
          <Card>
            <CardHeader title="Weekly retention by cohort" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted">
                    <th className="px-3 py-2 font-medium">Cohort</th>
                    <th className="px-3 py-2 text-right font-medium">Users</th>
                    {["W0", "W1", "W2", "W3", "W4"].map((w) => (
                      <th key={w} className="px-3 py-2 text-center font-medium">
                        {w}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COHORTS.map((c) => (
                    <tr key={c.cohort} className="border-t border-line">
                      <td className="px-3 py-2.5 font-medium text-ink">{c.cohort}</td>
                      <td className="px-3 py-2.5 text-right text-body">
                        {formatNumber(c.size)}
                      </td>
                      {c.weeks.map((v, i) => (
                        <td key={i} className="px-1.5 py-1.5 text-center">
                          <span
                            className="flex h-9 items-center justify-center rounded-lg text-xs font-medium text-ink"
                            style={{ background: retentionTone(v) }}
                          >
                            {v === 0 ? "" : `${v}%`}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

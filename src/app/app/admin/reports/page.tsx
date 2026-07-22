"use client";

import {
  BarChart3,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Wallet,
  RefreshCw,
  Download,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton, ErrorState } from "@/components/ui/feedback";
import { BarChart } from "@/components/ui/charts";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/admin.service";
import { toast } from "@/store/toast";
import { formatDate } from "@/lib/format";

interface ReportDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  lastGenerated: string;
}

const REPORTS: ReportDef[] = [
  {
    id: "enrollment",
    title: "Enrollment report",
    description: "New enrollments broken down by course and cohort.",
    icon: GraduationCap,
    lastGenerated: "2026-07-21",
  },
  {
    id: "revenue",
    title: "Revenue report",
    description: "Gross and net revenue with refunds and taxes.",
    icon: DollarSign,
    lastGenerated: "2026-07-20",
  },
  {
    id: "completion",
    title: "Completion report",
    description: "Course completion and drop-off rates per module.",
    icon: BarChart3,
    lastGenerated: "2026-07-18",
  },
  {
    id: "growth",
    title: "User growth",
    description: "Signups, activations and churn over time.",
    icon: TrendingUp,
    lastGenerated: "2026-07-22",
  },
  {
    id: "payouts",
    title: "Instructor payouts",
    description: "Scheduled and paid earnings per instructor.",
    icon: Wallet,
    lastGenerated: "2026-07-15",
  },
];

export default function AdminReportsPage() {
  const { data, loading, error, refetch } = useAsync(() => adminService.stats());

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export platform reports."
      />

      <Card className="mb-7">
        <CardHeader title="Signups this period" />
        {error ? (
          <ErrorState onRetry={refetch} />
        ) : loading ? (
          <Skeleton className="h-56" />
        ) : (
          <BarChart
            data={
              data?.signups.map((s) => ({ label: s.month, value: s.count })) ?? []
            }
          />
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold text-ink">{r.title}</h3>
              </div>
              <p className="text-sm text-body">{r.description}</p>
              <p className="text-xs text-muted">
                Last generated {formatDate(r.lastGenerated)}
              </p>
              <div className="mt-auto flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info("Generating report", `${r.title} is being prepared.`)}
                >
                  <RefreshCw className="h-4 w-4" /> Generate
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success("Download started", `${r.title} CSV is downloading.`)}
                >
                  <Download className="h-4 w-4" /> CSV
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

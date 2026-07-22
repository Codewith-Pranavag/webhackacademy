"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, CalendarClock, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { assignmentService } from "@/services/assignment.service";
import { formatDate } from "@/lib/format";
import type { AssignmentStatus } from "@/types";

const statusTone: Record<AssignmentStatus, "amber" | "violet" | "green" | "orange"> = {
  pending: "amber",
  submitted: "violet",
  graded: "green",
  overdue: "orange",
};

export default function AssignmentsPage() {
  const { data, loading, error, refetch } = useAsync(() => assignmentService.list());
  const [tab, setTab] = useState("all");

  const filtered = data?.filter((a) => tab === "all" || a.status === tab) ?? [];

  const counts = (s: string) =>
    s === "all" ? data?.length ?? 0 : data?.filter((a) => a.status === s).length ?? 0;

  const tabs = [
    { id: "all", label: "All", count: counts("all") },
    { id: "pending", label: "Pending", count: counts("pending") },
    { id: "submitted", label: "Submitted", count: counts("submitted") },
    { id: "graded", label: "Graded", count: counts("graded") },
    { id: "overdue", label: "Overdue", count: counts("overdue") },
  ];

  return (
    <div>
      <PageHeader title="Assignments" description="Track, submit and review your coursework." />

      <Tabs tabs={tabs} active={tab} onChange={setTab} className="mb-6" />

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No assignments here" icon={<ClipboardList className="h-7 w-7" />} />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((a) => (
            <Card key={a.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                  {a.status === "graded" && (
                    <span className="text-sm font-semibold text-green">{a.grade}/{a.points}</span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-ink">{a.title}</h3>
                <p className="text-sm text-muted">{a.courseTitle}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-body">
                  <CalendarClock className="h-4 w-4 text-violet" />
                  Due {formatDate(a.dueDate)}
                </p>
              </div>
              <Link
                href={`/app/assignments/${a.id}`}
                className="inline-flex shrink-0 items-center gap-1 self-start rounded-pill border border-line px-4 py-2 text-sm font-medium text-violet-deep transition-colors hover:border-violet sm:self-center"
              >
                {a.status === "pending" || a.status === "overdue" ? "Submit" : "View"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ClipboardCheck, Paperclip } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Dialog } from "@/components/ui/Dialog";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { instructorService } from "@/services/instructor.service";
import { toast } from "@/store/toast";
import { formatDate } from "@/lib/format";
import { fieldClass, studentForId } from "../_components/helpers";
import type { Assignment, AssignmentStatus } from "@/types";

const STATUS_TONE: Record<AssignmentStatus, "amber" | "green" | "sky" | "orange"> = {
  submitted: "amber",
  graded: "green",
  pending: "sky",
  overdue: "orange",
};

export default function InstructorSubmissionsPage() {
  const { data, loading, error, refetch } = useAsync(() => instructorService.submissions());
  const [active, setActive] = useState<Assignment | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const openReview = (a: Assignment) => {
    setActive(a);
    setGrade(a.grade !== undefined ? String(a.grade) : "");
    setFeedback(a.feedback ?? "");
  };

  const saveGrade = () => {
    if (!active) return;
    toast.success("Grade saved", `${studentForId(active.id)} · ${active.title}`);
    setActive(null);
  };

  const columns: Column<Assignment>[] = [
    {
      key: "student",
      header: "Student",
      render: (a) => (
        <div className="flex items-center gap-3">
          <Avatar name={studentForId(a.id)} size={36} />
          <span className="font-medium text-ink">{studentForId(a.id)}</span>
        </div>
      ),
    },
    {
      key: "title",
      header: "Assignment",
      render: (a) => <span className="font-medium text-ink">{a.title}</span>,
    },
    { key: "courseTitle", header: "Course", render: (a) => <span className="text-body">{a.courseTitle}</span> },
    {
      key: "submittedAt",
      header: "Submitted",
      render: (a) => (
        <span className="text-body">{a.submittedAt ? formatDate(a.submittedAt) : "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (a) => (
        <Badge tone={STATUS_TONE[a.status]} className="capitalize">
          {a.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (a) => (
        <Button variant="outline" size="sm" onClick={() => openReview(a)}>
          {a.status === "graded" ? "View" : "Review"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Submissions"
        description="Review and grade work submitted by your students."
      />

      {error ? (
        <ErrorState onRetry={refetch} />
      ) : !loading && (!data || data.length === 0) ? (
        <EmptyState
          title="Review queue is empty"
          description="You're all caught up — new submissions will show here."
          icon={<ClipboardCheck className="h-7 w-7" />}
        />
      ) : (
        <DataTable
          columns={columns}
          rows={data ?? []}
          loading={loading}
          emptyLabel="No submissions to review."
        />
      )}

      <Dialog
        open={active !== null}
        onClose={() => setActive(null)}
        title={active ? active.title : "Review submission"}
        footer={
          <>
            <Button variant="outline" size="sm" type="button" onClick={() => setActive(null)}>
              Cancel
            </Button>
            <Button size="sm" type="button" onClick={saveGrade}>
              Save grade
            </Button>
          </>
        }
      >
        {active && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Avatar name={studentForId(active.id)} size={44} />
              <div>
                <p className="font-medium text-ink">{studentForId(active.id)}</p>
                <p className="text-sm text-muted">{active.courseTitle}</p>
              </div>
              <Badge tone={STATUS_TONE[active.status]} className="ml-auto capitalize">
                {active.status}
              </Badge>
            </div>

            <p className="text-sm text-body">{active.description}</p>

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Attachments</p>
              {active.attachments && active.attachments.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {active.attachments.map((f) => (
                    <li
                      key={f.name}
                      className="flex items-center gap-3 rounded-[var(--radius)] border border-line bg-surface-soft px-3 py-2 text-sm"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-deep">
                        <Paperclip className="h-4 w-4" />
                      </span>
                      <span className="flex-1 truncate text-ink">{f.name}</span>
                      <span className="text-xs text-muted">{f.size}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">No files attached.</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <label htmlFor="grade" className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">Grade (/{active.points})</span>
                <input
                  id="grade"
                  type="number"
                  min={0}
                  max={active.points}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="0"
                  className={fieldClass}
                />
              </label>
              <label htmlFor="feedback" className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">Feedback</span>
                <textarea
                  id="feedback"
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share constructive feedback…"
                  className={`${fieldClass} h-auto py-2.5`}
                />
              </label>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

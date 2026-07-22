"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  Award,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  MessageSquareText,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingBlock, EmptyState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { assignmentService } from "@/services/assignment.service";
import { toast } from "@/store/toast";
import { formatDate } from "@/lib/format";
import type { Assignment } from "@/types";

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useAsync(() => assignmentService.get(id), [id]);

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const current = assignment ?? data;

  if (loading) return <LoadingBlock label="Loading assignment…" />;
  if (!current)
    return <EmptyState title="Assignment not found" action={<Button href="/app/assignments">Back</Button>} />;

  const canSubmit = current.status === "pending" || current.status === "overdue";

  const addMockFile = () => {
    const names = ["submission.pdf", "project.zip", "notebook.ipynb", "design.fig"];
    const name = names[files.length % names.length];
    setFiles((f) => [...f, { name, size: `${(1 + files.length * 0.7).toFixed(1)} MB` }]);
  };

  const doSubmit = async () => {
    if (files.length === 0) {
      toast.error("Add a file first", "Attach at least one file to submit.");
      return;
    }
    setSubmitting(true);
    const updated = await assignmentService.submit(current.id, files);
    setAssignment(updated);
    setSubmitting(false);
    toast.success("Assignment submitted", "Your instructor will review it soon.");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/app/assignments" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-body hover:text-violet-deep">
        <ArrowLeft className="h-4 w-4" /> All assignments
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <Badge tone={current.status === "graded" ? "green" : current.status === "overdue" ? "orange" : "violet"}>
              {current.status}
            </Badge>
            <h1 className="mt-3 text-2xl font-bold text-ink">{current.title}</h1>
            <p className="mt-1 text-sm text-muted">{current.courseTitle}</p>
            <p className="mt-4 text-body">{current.description}</p>
          </Card>

          {/* Grade + feedback */}
          {current.status === "graded" && (
            <Card>
              <CardHeader title="Grade & feedback" />
              <div className="flex items-center gap-4 rounded-[var(--radius)] bg-green-soft p-4">
                <span className="font-display text-3xl font-bold text-green">
                  {current.grade}
                  <span className="text-lg text-green/70">/{current.points}</span>
                </span>
                <CheckCircle2 className="h-6 w-6 text-green" />
              </div>
              {current.feedback && (
                <div className="mt-4 flex gap-3">
                  <Avatar name="Instructor" size={36} />
                  <div className="flex-1 rounded-[var(--radius)] border border-line p-4">
                    <p className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                      <MessageSquareText className="h-4 w-4 text-violet-deep" /> Instructor feedback
                    </p>
                    <p className="text-sm text-body">{current.feedback}</p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Submission */}
          <Card>
            <CardHeader title={canSubmit ? "Your submission" : "Submitted work"} />
            {canSubmit ? (
              <>
                <button
                  onClick={addMockFile}
                  className="flex w-full flex-col items-center gap-2 rounded-[var(--radius-lg)] border-2 border-dashed border-line bg-surface-soft px-6 py-10 text-center transition-colors hover:border-violet"
                >
                  <UploadCloud className="h-8 w-8 text-violet-deep" />
                  <span className="text-sm font-medium text-ink">Click to upload files</span>
                  <span className="text-xs text-muted">PDF, ZIP, images or notebooks up to 25 MB</span>
                </button>

                {files.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between rounded-[var(--radius)] border border-line p-3">
                        <span className="flex items-center gap-3 text-sm">
                          <FileText className="h-5 w-5 text-violet-deep" />
                          <span className="font-medium text-ink">{f.name}</span>
                          <span className="text-xs text-muted">{f.size}</span>
                        </span>
                        <button onClick={() => setFiles((prev) => prev.filter((_, x) => x !== i))} aria-label="Remove">
                          <X className="h-4 w-4 text-muted hover:text-orange" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Add a comment for your instructor (optional)…"
                  className="mt-4 w-full rounded-[var(--radius)] border border-line bg-surface-soft px-4 py-3 text-sm text-ink outline-none focus:border-violet"
                />
                <Button className="mt-4" onClick={doSubmit} disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit assignment"}
                </Button>
              </>
            ) : (
              <ul className="flex flex-col gap-2">
                {(current.attachments ?? []).map((f, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-[var(--radius)] border border-line p-3 text-sm">
                    <FileText className="h-5 w-5 text-violet-deep" />
                    <span className="font-medium text-ink">{f.name}</span>
                    <span className="text-xs text-muted">{f.size}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Sidebar meta */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="flex flex-col gap-4">
            <Meta icon={<CalendarClock className="h-4 w-4" />} label="Due date" value={formatDate(current.dueDate)} />
            <Meta icon={<Award className="h-4 w-4" />} label="Points" value={`${current.points} pts`} />
            {current.submittedAt && (
              <Meta icon={<CheckCircle2 className="h-4 w-4" />} label="Submitted" value={formatDate(current.submittedAt)} />
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-deep">
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

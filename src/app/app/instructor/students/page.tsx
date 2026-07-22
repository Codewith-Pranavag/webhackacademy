"use client";

import { useMemo, useState } from "react";
import { Search, MessageSquare, Users } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { instructorService } from "@/services/instructor.service";
import { toast } from "@/store/toast";
import { formatDate } from "@/lib/format";
import { fieldClass } from "../_components/helpers";
import type { AdminUserRow } from "@/types";

type StatusFilter = "all" | AdminUserRow["status"];

const STATUS_TONE: Record<AdminUserRow["status"], "green" | "orange" | "sky"> = {
  active: "green",
  suspended: "orange",
  invited: "sky",
};

export default function InstructorStudentsPage() {
  const { data, loading, error, refetch } = useAsync(() => instructorService.students());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const all = data ?? [];
    const q = query.trim().toLowerCase();
    return all.filter((u) => {
      const matchesQuery =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesStatus = status === "all" || u.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [data, query, status]);

  const columns: Column<AdminUserRow>[] = [
    {
      key: "name",
      header: "Student",
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar src={u.avatar} name={u.name} size={38} />
          <span className="font-medium text-ink">{u.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email", render: (u) => <span className="text-body">{u.email}</span> },
    {
      key: "courses",
      header: "Courses",
      align: "center",
      render: (u) => <span className="font-medium text-ink">{u.courses}</span>,
    },
    {
      key: "joinedAt",
      header: "Joined",
      render: (u) => <span className="text-body">{formatDate(u.joinedAt)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <Badge tone={STATUS_TONE[u.status]} className="capitalize">
          {u.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (u) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Message sent to compose", `Start a chat with ${u.name}.`)}
        >
          <MessageSquare className="h-4 w-4" /> Message
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        description="Everyone enrolled across your courses."
      />

      <Card className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className={`${fieldClass} pl-9`}
            aria-label="Search students"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className={`${fieldClass} sm:w-48`}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="invited">Invited</option>
          <option value="suspended">Suspended</option>
        </select>
      </Card>

      {error ? (
        <ErrorState onRetry={refetch} />
      ) : !loading && rows.length === 0 ? (
        <EmptyState
          title="No students found"
          description="Try adjusting your search or filter."
          icon={<Users className="h-7 w-7" />}
        />
      ) : (
        <DataTable columns={columns} rows={rows} loading={loading} emptyLabel="No students found." />
      )}
    </div>
  );
}

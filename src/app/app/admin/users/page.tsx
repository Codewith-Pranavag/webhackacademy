"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus, Pencil, Ban } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ErrorState } from "@/components/ui/feedback";
import { DataTable, Pagination, type Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/admin.service";
import { toast } from "@/store/toast";
import { formatDate } from "@/lib/format";
import type { AdminUserRow, Role } from "@/types";
import { InviteUserDialog } from "./_components/InviteUserDialog";

const PAGE_SIZE = 8;

const ROLE_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "student", label: "Students" },
  { id: "instructor", label: "Instructors" },
  { id: "admin", label: "Admins" },
];

const ROLE_TONE: Record<Role, "violet" | "sky" | "amber"> = {
  admin: "violet",
  instructor: "sky",
  student: "amber",
};

const STATUS_TONE: Record<AdminUserRow["status"], "green" | "orange" | "amber"> = {
  active: "green",
  suspended: "orange",
  invited: "amber",
};

export default function AdminUsersPage() {
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);

  // Debounce the search input.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(rawQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const { data, loading, error, refetch } = useAsync(
    () => adminService.users({ page, pageSize: PAGE_SIZE, query, role }),
    [page, query, role],
  );

  const columns: Column<AdminUserRow>[] = [
    {
      key: "name",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar src={u.avatar} name={u.name} size={36} />
          <span className="font-medium text-ink">{u.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email", render: (u) => <span className="text-body">{u.email}</span> },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <Badge tone={ROLE_TONE[u.role]} className="capitalize">
          {u.role}
        </Badge>
      ),
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
    { key: "courses", header: "Courses", align: "center" },
    {
      key: "joinedAt",
      header: "Joined",
      render: (u) => <span className="text-muted">{formatDate(u.joinedAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (u) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => toast.info("Edit user", `Editing ${u.name}.`)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-soft hover:text-violet-deep"
            aria-label={`Edit ${u.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() =>
              toast.warning("User suspended", `${u.name} has been suspended.`)
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-orange/10 hover:text-orange"
            aria-label={`Suspend ${u.name}`}
          >
            <Ban className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User management"
        description="Search, filter and manage every account on the platform."
        action={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" /> Invite user
          </Button>
        }
      />

      <Card className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-pill border border-line bg-surface py-2.5 pl-9 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-violet"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setRole(f.id);
                setPage(1);
              }}
              className={`rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
                role === f.id
                  ? "bg-violet-deep text-white"
                  : "bg-surface-soft text-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={data?.items ?? []}
            loading={loading}
            emptyLabel="No users match your filters."
          />
          {data && (
            <Pagination
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
              onPage={setPage}
            />
          )}
        </>
      )}

      <InviteUserDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}

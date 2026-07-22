"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { DataTable, Pagination, type Column } from "@/components/ui/DataTable";
import { Avatar } from "@/components/ui/Avatar";
import { ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/admin.service";
import { formatDate, formatTime } from "@/lib/format";
import type { AuditLog } from "@/types";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const { data, loading, error, refetch } = useAsync(() => adminService.auditLogs(page), [page]);

  const rows = (data?.items ?? []).filter(
    (l) =>
      !query ||
      l.actor.toLowerCase().includes(query.toLowerCase()) ||
      l.action.toLowerCase().includes(query.toLowerCase()) ||
      l.target.toLowerCase().includes(query.toLowerCase()),
  );

  const columns: Column<AuditLog>[] = [
    {
      key: "actor",
      header: "Actor",
      render: (r) => (
        <span className="flex items-center gap-2">
          <Avatar name={r.actor} size={28} />
          <span className="font-medium text-ink">{r.actor}</span>
        </span>
      ),
    },
    { key: "action", header: "Action", render: (r) => <Badge tone="violet">{r.action}</Badge> },
    { key: "target", header: "Target" },
    { key: "ip", header: "IP address", render: (r) => <span className="font-mono text-xs">{r.ip}</span> },
    {
      key: "at",
      header: "Timestamp",
      align: "right",
      render: (r) => (
        <span className="text-right">
          <span className="block text-ink">{formatDate(r.at)}</span>
          <span className="text-xs text-muted">{formatTime(r.at)}</span>
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Audit Logs" description="A record of important actions across the platform." />

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by actor, action or target…"
          className="h-11 w-full rounded-pill border border-line bg-surface pl-11 pr-4 text-sm text-ink outline-none focus:border-violet"
        />
      </div>

      {error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <DataTable columns={columns} rows={rows} loading={loading} emptyLabel="No log entries match your filter." />
          {data && (
            <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
          )}
        </>
      )}
    </div>
  );
}

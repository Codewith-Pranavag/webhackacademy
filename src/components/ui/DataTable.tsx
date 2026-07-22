import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./feedback";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  emptyLabel = "No records found.",
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyLabel?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-surface">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-soft/60 text-left text-xs uppercase tracking-wide text-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-5 py-3.5 font-medium",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-14 text-center text-muted">
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-line transition-colors last:border-0 hover:bg-surface-soft/50"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-5 py-4 text-ink/80",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.className,
                    )}
                  >
                    {col.render ? col.render(row) : (row as Record<string, ReactNode>)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <p className="text-muted">
        Page <span className="font-medium text-ink">{page}</span> of {pages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:border-violet hover:text-violet-deep disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:border-violet hover:text-violet-deep disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

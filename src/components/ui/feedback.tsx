import type { ReactNode } from "react";
import { Loader2, Inbox, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shimmer skeleton block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius)] bg-line/70",
        className,
      )}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-violet-deep", className)} />;
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <Spinner className="h-7 w-7" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-line bg-surface-soft px-6 py-16 text-center",
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-deep">
        {icon ?? <Inbox className="h-7 w-7" />}
      </span>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-body">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-orange/20 bg-orange/5 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange/10 text-orange">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-body">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-pill border border-ink/15 px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-violet hover:text-violet-deep"
        >
          Try again
        </button>
      )}
    </div>
  );
}

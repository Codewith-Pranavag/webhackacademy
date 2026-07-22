import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(28,28,36,0.04)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex items-center justify-between gap-3", className)}>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  trend,
  icon,
  href,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon?: ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-deep">
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="font-display text-3xl font-bold text-ink">{value}</span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium",
              trend === "down" ? "text-orange" : "text-green",
            )}
          >
            {trend === "down" ? (
              <ArrowDownRight className="h-4 w-4" />
            ) : (
              <ArrowUpRight className="h-4 w-4" />
            )}
            {delta}
          </span>
        )}
      </div>
    </>
  );

  const cls =
    "block rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(28,28,36,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]";

  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

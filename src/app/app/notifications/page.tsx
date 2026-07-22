"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  FileText,
  HelpCircle,
  MessageSquare,
  Settings2,
  Trophy,
  Bell,
  CheckCheck,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton, EmptyState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/store/notifications";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const TYPE_META: Record<
  NotificationType,
  { icon: React.ReactNode; className: string }
> = {
  course: { icon: <BookOpen className="h-4 w-4" />, className: "bg-violet-50 text-violet-deep" },
  assignment: { icon: <FileText className="h-4 w-4" />, className: "bg-sky/10 text-sky" },
  quiz: { icon: <HelpCircle className="h-4 w-4" />, className: "bg-amber/15 text-[#b47a1e]" },
  message: { icon: <MessageSquare className="h-4 w-4" />, className: "bg-green-soft text-green" },
  system: { icon: <Settings2 className="h-4 w-4" />, className: "bg-line/70 text-ink/70" },
  achievement: { icon: <Trophy className="h-4 w-4" />, className: "bg-orange/10 text-orange" },
};

type Filter = "all" | "unread" | NotificationType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "course", label: "Courses" },
  { id: "assignment", label: "Assignments" },
  { id: "quiz", label: "Quizzes" },
  { id: "message", label: "Messages" },
  { id: "system", label: "System" },
  { id: "achievement", label: "Achievements" },
];

export default function NotificationsPage() {
  const { items, loading, loaded, load, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    void load();
  }, [load]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((n) => !n.read);
    return items.filter((n) => n.type === filter);
  }, [items, filter]);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay on top of your courses, deadlines and messages."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => void markAllRead()}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count =
            f.id === "all"
              ? items.length
              : f.id === "unread"
                ? unreadCount
                : items.filter((n) => n.type === f.id).length;
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-violet-deep bg-violet-deep text-white"
                  : "border-line text-body hover:border-violet hover:text-violet-deep",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-pill px-1.5 text-xs",
                  isActive ? "bg-white/20 text-white" : "bg-line/70 text-ink/60",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="p-0">
        {loading && !loaded ? (
          <div className="flex flex-col gap-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            className="border-0"
            icon={<Bell className="h-7 w-7" />}
            title="Nothing here"
            description={
              filter === "unread"
                ? "You're all caught up — no unread notifications."
                : "No notifications in this category yet."
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((n) => {
              const meta = TYPE_META[n.type];
              return (
                <li key={n.id}>
                  <button
                    onClick={() => !n.read && void markRead(n.id)}
                    className={cn(
                      "flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-soft",
                      !n.read && "bg-violet-50/40",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        meta.className,
                      )}
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "truncate text-sm text-ink",
                            !n.read ? "font-semibold" : "font-medium",
                          )}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-violet-deep" />
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-sm text-body">{n.body}</p>
                      <p className="mt-1 text-xs text-muted">{timeAgo(n.createdAt)}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

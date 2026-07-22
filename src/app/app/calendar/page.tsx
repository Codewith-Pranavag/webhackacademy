"use client";

import { CalendarDays, Clock } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/user.service";
import { formatDate, formatTime } from "@/lib/format";
import type { CalendarEvent, CalendarEventType } from "@/types";

/** Fixed reference month so events line up with the sample data (July 2026). */
const REF = new Date(2026, 6, 1);
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABEL = REF.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const TYPE_META: Record<
  CalendarEventType,
  { label: string; dot: string; pill: string }
> = {
  deadline: { label: "Deadline", dot: "bg-orange", pill: "bg-orange/10 text-orange" },
  "live-class": { label: "Live class", dot: "bg-violet-deep", pill: "bg-violet-50 text-violet-deep" },
  assignment: { label: "Assignment", dot: "bg-amber", pill: "bg-amber/15 text-[#b47a1e]" },
  quiz: { label: "Quiz", dot: "bg-sky", pill: "bg-sky/10 text-sky" },
};

/** Parse the day-of-month for the reference month; returns null if out of month. */
function dayInRefMonth(iso: string): number | null {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (y !== REF.getFullYear() || m - 1 !== REF.getMonth()) return null;
  return d;
}

export default function CalendarPage() {
  const { data, loading, error, refetch } = useAsync(() =>
    userService.calendar(),
  );

  const events = data ?? [];
  const daysInMonth = new Date(REF.getFullYear(), REF.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(REF.getFullYear(), REF.getMonth(), 1).getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsByDay = new Map<number, CalendarEvent[]>();
  for (const ev of events) {
    const day = dayInRefMonth(ev.date);
    if (day === null) continue;
    const list = eventsByDay.get(day) ?? [];
    list.push(ev);
    eventsByDay.set(day, list);
  }

  const upcoming = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Deadlines, live classes, assignments and quizzes at a glance."
      />

      {loading ? (
        <div className="grid gap-7 lg:grid-cols-3">
          <Skeleton className="h-[30rem] lg:col-span-2" />
          <Skeleton className="h-[30rem]" />
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="grid gap-7 lg:grid-cols-3">
          {/* Month grid */}
          <Card className="lg:col-span-2">
            <CardHeader
              title={MONTH_LABEL}
              action={
                <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                  <CalendarDays className="h-4 w-4 text-violet-deep" /> Month
                </span>
              }
            />

            <div className="grid grid-cols-7 gap-1.5">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted"
                >
                  {d}
                </div>
              ))}

              {cells.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className="min-h-20" />;
                const dayEvents = eventsByDay.get(day) ?? [];
                return (
                  <div
                    key={day}
                    className="flex min-h-20 flex-col gap-1 rounded-[var(--radius)] border border-line bg-surface-soft p-1.5"
                  >
                    <span className="text-xs font-semibold text-ink/70">{day}</span>
                    <div className="flex flex-col gap-1">
                      {dayEvents.map((ev) => (
                        <span
                          key={ev.id}
                          title={ev.title}
                          className={`flex items-center gap-1 truncate rounded px-1.5 py-0.5 text-[0.65rem] font-medium ${TYPE_META[ev.type].pill}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${TYPE_META[ev.type].dot}`}
                          />
                          <span className="truncate">{ev.title}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4">
              {(Object.keys(TYPE_META) as CalendarEventType[]).map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1.5 text-xs text-body"
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${TYPE_META[type].dot}`} />
                  {TYPE_META[type].label}
                </span>
              ))}
            </div>
          </Card>

          {/* Upcoming events */}
          <Card>
            <CardHeader title="Upcoming" />
            {upcoming.length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="h-7 w-7" />}
                title="Nothing scheduled"
                description="You have no upcoming events."
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {upcoming.map((ev) => {
                  const hasTime = ev.date.includes("T");
                  return (
                    <li
                      key={ev.id}
                      className="flex items-start gap-3 rounded-[var(--radius)] border border-line p-3"
                    >
                      <span
                        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_META[ev.type].dot}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{ev.title}</p>
                        {ev.courseTitle && (
                          <p className="truncate text-xs text-muted">
                            {ev.courseTitle}
                          </p>
                        )}
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-body">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(ev.date, { year: undefined })}
                          {hasTime && <> · {formatTime(ev.date)}</>}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

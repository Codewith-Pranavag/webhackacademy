"use client";

import { useMemo, useState } from "react";
import { StickyNote, Search, Clock, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/user.service";
import { formatDate, formatDuration } from "@/lib/format";
import type { Note } from "@/types";

export default function NotesPage() {
  const { data, loading, error, refetch } = useAsync(() => userService.notes());
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const notes = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) =>
      [n.courseTitle, n.lessonTitle, n.content].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [data, query]);

  return (
    <div>
      <PageHeader
        title="Notes"
        description="Everything you've jotted down while learning."
      />

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes, courses or lessons…"
          className="h-11 w-full rounded-pill border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-violet focus:outline-none focus:ring-2 focus:ring-violet/30"
        />
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<StickyNote className="h-7 w-7" />}
          title="No notes yet"
          description="Take notes during lessons and they'll appear here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-7 w-7" />}
          title="No matching notes"
          description={`Nothing matched "${query}". Try a different search.`}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-deep">
            <StickyNote className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {note.courseTitle}
            </p>
            <p className="truncate text-xs text-muted">{note.lessonTitle}</p>
          </div>
        </div>
        <Badge tone="sky">
          <PlayCircle className="h-3.5 w-3.5" /> {formatDuration(note.timestamp)}
        </Badge>
      </div>

      <p className="rounded-[var(--radius)] border-l-2 border-violet-deep/40 bg-surface-soft px-4 py-3 text-sm leading-relaxed text-body">
        {note.content}
      </p>

      <p className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Clock className="h-3.5 w-3.5" /> {formatDate(note.createdAt)}
      </p>
    </Card>
  );
}

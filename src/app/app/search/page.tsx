"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search as SearchIcon,
  X,
  Clock,
  TrendingUp,
  Sparkles,
  BookOpen,
  Users,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton, EmptyState } from "@/components/ui/feedback";
import { Tabs } from "@/components/ui/Tabs";
import { Avatar } from "@/components/ui/Avatar";
import { CourseCard } from "@/components/shared/CourseCard";
import { useAsync } from "@/hooks/useAsync";
import { searchService, popularSearches, type SearchResults } from "@/services/search.service";
import type { Course } from "@/constants/data";

const RECENT_KEY = "wha-recent-searches";
const SUGGESTIONS = ["Beginner friendly", "Free courses", "Certification", "Web development"];

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";

  const [input, setInput] = useState(initial);
  const [query, setQuery] = useState(initial);
  const [recent, setRecent] = useState<string[]>([]);
  const [tab, setTab] = useState<"courses" | "instructors" | "blog">("courses");

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  // Debounce input -> query + URL sync
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(input.trim());
      const next = input.trim() ? `/app/search?q=${encodeURIComponent(input.trim())}` : "/app/search";
      router.replace(next, { scroll: false });
    }, 300);
    return () => clearTimeout(t);
  }, [input, router]);

  const commitRecent = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecent((prev) => {
      const next = [clean, ...prev.filter((r) => r.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clearRecent = () => {
    setRecent([]);
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  };

  const { data, loading } = useAsync<SearchResults | null>(
    () => (query ? searchService.query(query) : Promise.resolve(null)),
    [query],
  );

  const runSearch = (term: string) => {
    setInput(term);
    commitRecent(term);
  };

  const tabs = useMemo(
    () => [
      { id: "courses", label: "Courses", count: data?.courses.length },
      { id: "instructors", label: "Instructors", count: data?.instructors.length },
      { id: "blog", label: "Blog", count: data?.blog.length },
    ],
    [data],
  );

  const hasQuery = query.length > 0;

  return (
    <div>
      <PageHeader title="Search" description="Find courses, instructors and articles." />

      {/* Search bar */}
      <div className="relative mb-8">
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitRecent(input)}
          placeholder="Search for anything…"
          className="w-full rounded-pill border border-line bg-surface py-4 pl-14 pr-12 text-base text-ink shadow-[0_1px_2px_rgba(28,28,36,0.04)] outline-none transition-colors placeholder:text-muted focus:border-violet focus:ring-2 focus:ring-violet/30"
        />
        {input && (
          <button
            onClick={() => setInput("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {!hasQuery ? (
        <div className="flex flex-col gap-6">
          {/* Recent */}
          {recent.length > 0 && (
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <Clock className="h-4 w-4 text-muted" /> Recent searches
                </h3>
                <button
                  onClick={clearRecent}
                  className="text-xs font-medium text-muted transition-colors hover:text-violet-deep"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => runSearch(r)}
                    className="inline-flex items-center gap-1.5 rounded-pill border border-line px-3.5 py-1.5 text-sm text-body transition-colors hover:border-violet hover:text-violet-deep"
                  >
                    <Clock className="h-3.5 w-3.5 text-muted" />
                    {r}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Popular */}
          <Card>
            <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <TrendingUp className="h-4 w-4 text-violet-deep" /> Popular searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((p) => (
                <button
                  key={p}
                  onClick={() => runSearch(p)}
                  className="rounded-pill bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-deep transition-colors hover:bg-violet-100"
                >
                  {p}
                </button>
              ))}
            </div>
          </Card>

          {/* Suggestions */}
          <Card>
            <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <Sparkles className="h-4 w-4 text-amber" /> Try searching for
            </h3>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => runSearch(s)}
                  className="rounded-pill border border-line px-4 py-1.5 text-sm text-body transition-colors hover:border-violet hover:text-violet-deep"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div>
          <Tabs
            tabs={tabs}
            active={tab}
            onChange={(id) => setTab(id as typeof tab)}
            className="mb-6"
          />

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : tab === "courses" ? (
            data && data.courses.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.courses.map((c) => (
                  <CourseCard key={c.id} course={c as unknown as Course} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="h-7 w-7" />}
                title="No courses found"
                description={`No courses match "${query}".`}
              />
            )
          ) : tab === "instructors" ? (
            data && data.instructors.length > 0 ? (
              <div className="flex flex-col gap-3">
                {data.instructors.map((i) => (
                  <Card key={i.id} className="flex items-center gap-4 py-4">
                    <Avatar src={i.avatar} name={i.name} size={52} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{i.name}</p>
                      <p className="truncate text-sm text-muted">
                        {i.headline ?? "Instructor"}
                      </p>
                    </div>
                    <Link
                      href="/mentors"
                      className="inline-flex items-center gap-1.5 rounded-pill border border-line px-4 py-2 text-sm font-medium text-violet-deep transition-colors hover:border-violet"
                    >
                      <Users className="h-4 w-4" /> View
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Users className="h-7 w-7" />}
                title="No instructors found"
                description={`No instructors match "${query}".`}
              />
            )
          ) : data && data.blog.length > 0 ? (
            <div className="flex flex-col gap-3">
              {data.blog.map((b) => (
                <Link key={b.title} href={b.href}>
                  <Card className="flex items-start gap-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-deep">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{b.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-body">{b.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="h-7 w-7" />}
              title="No articles found"
              description={`No blog posts match "${query}".`}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex flex-col gap-4"><Skeleton className="h-14" /><Skeleton className="h-64" /></div>}>
      <SearchInner />
    </Suspense>
  );
}

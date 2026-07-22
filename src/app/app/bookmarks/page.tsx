"use client";

import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/user.service";

export default function BookmarksPage() {
  const { data, loading, error, refetch } = useAsync(() =>
    userService.bookmarks(),
  );

  const ids = data?.ids ?? [];

  return (
    <div>
      <PageHeader
        title="Bookmarks"
        description="Lessons you've saved to return to quickly."
      />

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : ids.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-7 w-7" />}
          title="No bookmarks yet"
          description="Bookmark lessons while you learn and they'll show up here."
          action={
            <Button href="/app/my-learning" size="sm">
              Go to My Learning
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {ids.map((id) => (
            <Link key={id} href="/app/my-learning" className="group">
              <Card className="flex items-center gap-4 py-4 transition-colors group-hover:border-violet/40 group-hover:bg-surface-soft">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-deep">
                  <Bookmark className="h-5 w-5 fill-current" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">Bookmarked lesson</p>
                  <p className="truncate font-mono text-xs text-muted">{id}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-violet-deep" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

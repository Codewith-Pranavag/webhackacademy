"use client";

import type { ComponentType } from "react";
import {
  Footprints,
  Flame,
  Brain,
  Trophy,
  Moon,
  Medal,
  Lock,
  Award,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/user.service";
import { formatDate } from "@/lib/format";
import type { Achievement } from "@/types";

type IconType = ComponentType<{ className?: string }>;

const ICONS: Record<string, IconType> = {
  footprints: Footprints,
  flame: Flame,
  brain: Brain,
  trophy: Trophy,
  moon: Moon,
  medal: Medal,
};

export default function AchievementsPage() {
  const badges = useAsync(() => userService.achievements());
  const board = useAsync(() => userService.leaderboard());

  const unlockedCount = badges.data?.filter((b) => b.unlocked).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Achievements"
        description="Badges you've unlocked and how you rank against other learners."
      />

      {/* Badges */}
      <Card className="mb-7">
        <CardHeader
          title="Your badges"
          action={
            badges.data ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <Sparkles className="h-4 w-4 text-violet-deep" />
                {unlockedCount}/{badges.data.length} unlocked
              </span>
            ) : undefined
          }
        />
        {badges.loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : badges.error ? (
          <ErrorState onRetry={badges.refetch} />
        ) : !badges.data || badges.data.length === 0 ? (
          <EmptyState
            icon={<Award className="h-7 w-7" />}
            title="No achievements yet"
            description="Keep learning to start unlocking badges."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {badges.data.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        )}
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader title="Leaderboard" />
        {board.loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : board.error ? (
          <ErrorState onRetry={board.refetch} />
        ) : !board.data || board.data.length === 0 ? (
          <EmptyState
            icon={<Trophy className="h-7 w-7" />}
            title="Leaderboard unavailable"
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {board.data.map((entry) => (
              <li
                key={entry.rank}
                className={`flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 ${
                  entry.isCurrentUser ? "bg-violet-50" : "hover:bg-surface-soft"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    entry.rank <= 3
                      ? "bg-violet-deep text-white"
                      : "bg-line/60 text-ink/70"
                  }`}
                >
                  {entry.rank}
                </span>
                <Avatar src={entry.user.avatar} name={entry.user.name} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {entry.user.name}
                    {entry.isCurrentUser && (
                      <span className="ml-1 text-xs text-violet-deep">(You)</span>
                    )}
                  </p>
                  <p className="inline-flex items-center gap-1 text-xs text-muted">
                    <Flame className="h-3 w-3 text-orange" /> {entry.streak}-day streak
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-violet-deep">
                  {entry.points.toLocaleString()} pts
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Achievement }) {
  const Icon = ICONS[badge.icon] ?? Award;
  const locked = !badge.unlocked;

  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-line p-5 text-center transition-all ${
        locked ? "bg-surface-soft opacity-70 grayscale" : "bg-surface hover:-translate-y-0.5"
      }`}
    >
      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${
          locked ? "bg-line/60 text-muted" : "bg-violet-50 text-violet-deep"
        }`}
      >
        <Icon className="h-7 w-7" />
        {locked && (
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-ink text-white">
            <Lock className="h-3 w-3" />
          </span>
        )}
      </span>
      <h4 className="text-sm font-semibold text-ink">{badge.title}</h4>
      <p className="text-xs text-body">{badge.description}</p>
      {badge.unlocked && badge.unlockedAt ? (
        <span className="mt-1 text-xs font-medium text-green">
          Unlocked {formatDate(badge.unlockedAt)}
        </span>
      ) : (
        <span className="mt-1 text-xs font-medium text-muted">Locked</span>
      )}
    </div>
  );
}

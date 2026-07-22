"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Star, Users, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/user.service";
import { toast } from "@/store/toast";
import type { CourseSummary } from "@/types";

export default function WishlistPage() {
  const { data, loading, error, refetch } = useAsync(() =>
    userService.wishlist(),
  );
  const [items, setItems] = useState<CourseSummary[]>([]);

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const remove = (course: CourseSummary) => {
    setItems((prev) => prev.filter((c) => c.id !== course.id));
    toast.info("Removed from wishlist", course.title);
  };

  return (
    <div>
      <PageHeader
        title="Wishlist"
        description="Courses you've saved for later."
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-7 w-7" />}
          title="Your wishlist is empty"
          description="Save courses you're interested in and revisit them anytime."
          action={
            <Button href="/courses" size="sm">
              Browse courses
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((course) => (
            <WishlistCard key={course.id} course={course} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistCard({
  course,
  onRemove,
}: {
  course: CourseSummary;
  onRemove: (course: CourseSummary) => void;
}) {
  return (
    <Card className="flex flex-col gap-4 p-0">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[var(--radius-lg)]">
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => onRemove(course)}
          aria-label="Remove from wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-orange shadow-sm backdrop-blur transition-colors hover:bg-surface"
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
        <span className="absolute left-3 top-3 rounded-pill bg-violet-deep px-3 py-1 text-xs font-semibold text-white">
          {course.price}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <span className="text-xs font-medium uppercase tracking-wide text-violet">
          {course.category}
        </span>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink">
          {course.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber text-amber" />
            <span className="font-medium text-ink">{course.rating.toFixed(1)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-violet" />
            {course.lessons}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-violet" />
            {course.students.toLocaleString()}
          </span>
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <Button href={`/courses/${course.slug}`} size="sm" className="flex-1">
            View course
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(course)}
            aria-label="Remove"
          >
            <Heart className="h-4 w-4 fill-current text-orange" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

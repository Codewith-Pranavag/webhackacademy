"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Star, Sparkles, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/feedback";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { adminService } from "@/services/admin.service";
import { toast } from "@/store/toast";
import { formatNumber } from "@/lib/format";
import type { Course } from "@/types";

type CourseStatus = "published" | "draft" | "featured";

// Course has no persisted status; derive a stable one for the admin view.
function statusFor(c: Course): CourseStatus {
  if (c.rating >= 4.8) return "featured";
  if (c.students < 4000) return "draft";
  return "published";
}

const STATUS_TONE: Record<CourseStatus, "violet" | "green" | "neutral"> = {
  featured: "violet",
  published: "green",
  draft: "neutral",
};

export default function AdminCoursesPage() {
  const { data, loading, error, refetch } = useAsync(() => adminService.courses());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set((data ?? []).map((c) => c.category));
    return ["All", ...Array.from(set).sort()];
  }, [data]);

  const rows = useMemo(() => {
    let list = data ?? [];
    if (category !== "All") list = list.filter((c) => c.category === category);
    if (query)
      list = list.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase()),
      );
    return list;
  }, [data, category, query]);

  const columns: Column<Course>[] = [
    {
      key: "title",
      header: "Course",
      render: (c) => (
        <div className="flex items-center gap-3">
          <Image
            src={c.image}
            alt={c.title}
            width={64}
            height={40}
            className="h-10 w-16 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{c.title}</p>
            <p className="truncate text-xs text-muted">{c.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (c) => <Badge tone="sky">{c.category}</Badge>,
    },
    {
      key: "instructorId",
      header: "Instructor",
      render: (c) => <span className="text-muted">{c.instructorId}</span>,
    },
    {
      key: "students",
      header: "Students",
      align: "right",
      render: (c) => formatNumber(c.students),
    },
    {
      key: "rating",
      header: "Rating",
      align: "right",
      render: (c) => (
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber text-amber" />
          {c.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      render: (c) => <span className="font-medium text-ink">{c.price}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => {
        const s = statusFor(c);
        return (
          <Badge tone={STATUS_TONE[s]} className="capitalize">
            {s}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => toast.success("Course featured", `"${c.title}" is now featured.`)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-violet-50 hover:text-violet-deep"
            aria-label={`Feature ${c.title}`}
          >
            <Sparkles className="h-4 w-4" />
          </button>
          <button
            onClick={() => toast.warning("Course unpublished", `"${c.title}" is no longer public.`)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-orange/10 hover:text-orange"
            aria-label={`Unpublish ${c.title}`}
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Course catalog"
        description="Review, feature and moderate every course."
      />

      <Card className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
            className="w-full rounded-pill border border-line bg-surface py-2.5 pl-9 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-violet"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-violet-deep text-white"
                  : "bg-surface-soft text-muted hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          emptyLabel="No courses match your filters."
        />
      )}
    </div>
  );
}

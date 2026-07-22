"use client";

import { useMemo, useState } from "react";
import { courses } from "@/constants/data";
import { CourseCard } from "@/components/shared/CourseCard";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

export function CoursesCatalog() {
  const cats = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((c) => c.category)))],
    [],
  );
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? courses : courses.filter((c) => c.category === active);

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page flex flex-col gap-10">
        {/* Filter chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-pill border px-5 py-2.5 text-sm font-medium transition-all",
                active === cat
                  ? "border-violet-deep bg-violet-deep text-white shadow-[var(--shadow-btn)]"
                  : "border-line bg-white text-ink/70 hover:border-violet hover:text-violet-deep",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course, i) => (
            <Reveal key={course.slug} delay={(i % 3) * 0.08}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

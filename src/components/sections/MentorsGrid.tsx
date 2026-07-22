"use client";

import { useMemo, useState } from "react";
import { mentors } from "@/constants/data";
import { MentorGridCard } from "@/components/shared/MentorGridCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";

const PAGE = 8;

export function MentorsGrid() {
  const [visible, setVisible] = useState(PAGE);

  // Simulate a larger roster by cycling the base set with stable keys.
  const roster = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        ...mentors[i % mentors.length],
        key: `mentor-${i}`,
      })),
    [],
  );

  const shown = roster.slice(0, visible);
  const hasMore = visible < roster.length;

  return (
    <section className="py-20 lg:py-24">
      <div className="container-page flex flex-col items-center gap-12">
        <div className="grid w-full gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((m, i) => (
            <Reveal key={m.key} delay={(i % PAGE) * 0.05}>
              <MentorGridCard mentor={m} />
            </Reveal>
          ))}
        </div>

        {hasMore && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setVisible((v) => v + PAGE)}
          >
            Load More
          </Button>
        )}
      </div>
    </section>
  );
}

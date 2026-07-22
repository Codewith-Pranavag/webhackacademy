import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/Button";

const badges = ["Practical and Hands-on", "Real-world Learning"];

export function ResourcesFeature() {
  return (
    <section className="bg-surface-soft py-20 lg:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <Reveal direction="right" className="relative">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]">
            <Image
              src="/images/1a1d2651-nextline-image-2.png"
              alt="Learning resources"
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
            <StarRating rating={5} />
            <div className="leading-tight">
              <p className="font-display text-lg font-bold text-ink">4.9/5</p>
              <p className="text-xs text-muted">Average Rating</p>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal>
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.6rem] md:leading-tight">
              Alongside <span className="text-violet">our courses,</span> we also
              have a growing library of{" "}
              <span className="text-violet">resources</span> you can implement
              immediately into your workflow.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-3">
            {badges.map((b) => (
              <div key={b} className="flex items-center gap-3 text-lg text-ink">
                <CheckCircle2 className="h-6 w-6 text-green" />
                {b}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.2}>
            <Button href="/courses" size="lg">
              Browse Resources
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

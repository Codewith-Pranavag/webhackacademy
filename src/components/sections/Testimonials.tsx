import Image from "next/image";
import { testimonials } from "@/constants/data";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { StarRating } from "@/components/shared/StarRating";

export function Testimonials() {
  return (
    <section className="bg-surface-soft py-20 lg:py-28">
      <div className="container-page flex flex-col gap-14">
        <SectionHeading eyebrow="Loved by learners" lead="Students" highlight="Feedback" />

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {/* Summary panel */}
          <Reveal direction="right">
            <div className="flex flex-col gap-6 rounded-[var(--radius-xl)] bg-violet-deep p-9 text-white shadow-[var(--shadow-soft)]">
              <Image
                src="/images/7f53561c-trustpilot.png"
                alt="Trustpilot"
                width={130}
                height={32}
                className="h-8 w-auto brightness-0 invert"
              />
              <div className="flex items-end gap-3">
                <span className="font-display text-6xl font-bold leading-none">
                  <AnimatedCounter value={5} suffix=".0" />
                </span>
                <StarRating rating={5} size={22} className="mb-2" />
              </div>
              <p className="text-white/80">
                Based on <span className="font-semibold text-white">2,367</span>{" "}
                verified reviews
              </p>
              <div className="mt-2 flex items-center gap-8 border-t border-white/15 pt-6">
                <div>
                  <div className="font-display text-3xl font-bold">
                    <AnimatedCounter value={2000} suffix="+" />
                  </div>
                  <p className="text-sm text-white/70">Happy students</p>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold">98%</div>
                  <p className="text-sm text-white/70">Would recommend</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { stats } from "@/constants/data";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { Reveal } from "@/components/shared/Reveal";

export function StatsBand() {
  return (
    <section className="py-16">
      <div className="container-page">
        <div className="grid gap-8 rounded-[var(--radius-xl)] bg-ink px-8 py-12 text-white sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <div className="font-display text-4xl font-bold lg:text-5xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-white/70">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

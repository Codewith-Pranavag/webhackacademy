import Image from "next/image";
import { mentors, type Mentor } from "@/constants/data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";

function MentorAvatar({ mentor }: { mentor: Mentor }) {
  return (
    <figure className="group relative h-64 w-52 shrink-0 overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
      <Image
        src={mentor.image}
        alt={mentor.name}
        fill
        sizes="208px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur transition-all duration-300 group-hover:bg-white">
        <p className="font-semibold text-ink">{mentor.name}</p>
        <p className="text-xs text-violet-deep">{mentor.role}</p>
      </figcaption>
    </figure>
  );
}

export function MentorsRail() {
  const rowA = [...mentors, ...mentors];
  const rowB = [...mentors.slice().reverse(), ...mentors.slice().reverse()];

  return (
    <section className="overflow-hidden py-20 lg:py-28">
      <div className="container-page mb-14 flex flex-col items-center gap-4">
        <SectionHeading eyebrow="Meet the team" lead="Expert" highlight="Mentors" />
        <p className="max-w-xl text-center text-body">
          Learn directly from 2,000+ industry practitioners who have shipped real
          products at world-class companies.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="marquee-paused [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="marquee-track marquee-left gap-6">
            {rowA.map((m, i) => (
              <MentorAvatar key={`a-${i}`} mentor={m} />
            ))}
          </div>
        </div>
        <div className="marquee-paused [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="marquee-track marquee-right gap-6">
            {rowB.map((m, i) => (
              <MentorAvatar key={`b-${i}`} mentor={m} />
            ))}
          </div>
        </div>
      </div>

      <Reveal className="mt-14 flex justify-center">
        <Button href="/mentors" size="lg">
          View All Mentors
        </Button>
      </Reveal>
    </section>
  );
}

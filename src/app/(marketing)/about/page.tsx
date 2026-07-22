import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, Twitter, Instagram, Linkedin } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { StatsBand } from "@/components/sections/StatsBand";
import { ResourcesFeature } from "@/components/sections/ResourcesFeature";
import { Testimonials } from "@/components/sections/Testimonials";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";
import { leadership } from "@/constants/data";
import { site } from "@/constants/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${site.name}, our mission, vision and the team behind the platform.`,
};

const pillars = [
  {
    Icon: Target,
    title: "Our Mission",
    body: "To make world-class, practical education accessible to everyone — helping learners develop real, job-ready skills through hands-on courses taught by industry experts.",
  },
  {
    Icon: Eye,
    title: "Our Vision",
    body: "A world where anyone, anywhere, can learn the skills they need to build the career and future they want — without barriers of cost, location, or background.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About"
        highlight="Us"
        crumb="About Us"
        subtitle={`${site.name} helps you develop skills with online courses from 200+ renowned universities and institutions.`}
      />

      {/* Vision & Mission */}
      <section className="py-20 lg:py-24">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]">
              <Image
                src="/images/6b6dc037-nextline-image-6.jpg"
                alt="The WebHack Academy team"
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="flex flex-col gap-8">
            <SectionHeading
              align="left"
              eyebrow="Who we are"
              lead="Vision and"
              highlight="Mission"
            />
            <p className="text-body">
              We started {site.name} with a simple belief: learning should be
              practical, hands-on, and genuinely enjoyable. Today we serve a global
              community of learners with a growing library of resources they can
              implement immediately into their workflow.
            </p>
            <div className="flex flex-col gap-6">
              {pillars.map(({ Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 0.1}>
                  <div className="flex gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-deep">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{title}</h3>
                      <p className="mt-1 text-body">{body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StatsBand />

      {/* Leadership */}
      <section className="py-20 lg:py-24">
        <div className="container-page flex flex-col items-center gap-12">
          <SectionHeading eyebrow="Leadership" lead="Meet Our" highlight="Team" />
          <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((leader, i) => (
              <Reveal key={leader.name} delay={i * 0.1}>
                <article className="group overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-[var(--shadow-card)] transition-transform duration-500 hover:-translate-y-1.5">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="text-lg font-semibold">{leader.name}</h3>
                      <p className="text-sm text-violet-deep">{leader.role}</p>
                    </div>
                    <div className="flex gap-2">
                      {[Twitter, Instagram, Linkedin].map((Icon, k) => (
                        <span
                          key={k}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-deep transition-colors hover:bg-violet-deep hover:text-white"
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ResourcesFeature />
      <Testimonials />
      <NewsletterCTA />
    </>
  );
}

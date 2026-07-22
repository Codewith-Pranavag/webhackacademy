import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { MentorsGrid } from "@/components/sections/MentorsGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";
import { site } from "@/constants/site";

export const metadata: Metadata = {
  title: "Mentors",
  description: `Meet the honourable mentors of ${site.name} — 2,000+ industry practitioners ready to guide your learning journey.`,
};

export default function MentorsPage() {
  return (
    <>
      <PageHero
        title="Honourable"
        highlight="Mentors"
        crumb="Mentors"
        subtitle="Learn directly from 2,000+ industry practitioners who have shipped real products at world-class companies."
      />
      <MentorsGrid />
      <Testimonials />
      <NewsletterCTA />
    </>
  );
}

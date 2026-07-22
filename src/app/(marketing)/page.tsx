import { Hero } from "@/components/sections/Hero";
import { PartnersStrip } from "@/components/sections/PartnersStrip";
import { TrendingCourses } from "@/components/sections/TrendingCourses";
import { ResourcesFeature } from "@/components/sections/ResourcesFeature";
import { Categories } from "@/components/sections/Categories";
import { Testimonials } from "@/components/sections/Testimonials";
import { MentorsRail } from "@/components/sections/MentorsRail";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersStrip />
      <TrendingCourses />
      <ResourcesFeature />
      <Categories />
      <Testimonials />
      <MentorsRail />
      <NewsletterCTA />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CoursesCatalog } from "@/components/sections/CoursesCatalog";
import { Categories } from "@/components/sections/Categories";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";
import { site } from "@/constants/site";

export const metadata: Metadata = {
  title: "Courses",
  description: `Browse online video and real-time courses on ${site.name} across design, development, data and more.`,
};

export default function CoursesPage() {
  return (
    <>
      <PageHero
        title="Our"
        highlight="Courses"
        crumb="Course"
        subtitle="Choose from 213k online video & real-time courses published every month."
      />
      <CoursesCatalog />
      <Categories />
      <NewsletterCTA />
    </>
  );
}

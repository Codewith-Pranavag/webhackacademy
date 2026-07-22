import { ArrowRight } from "lucide-react";
import { courses } from "@/constants/data";
import { CourseCard } from "@/components/shared/CourseCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";

export function TrendingCourses() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page flex flex-col gap-12">
        <div className="flex flex-col items-center gap-4">
          <SectionHeading
            eyebrow="Trending now"
            lead="Trending"
            highlight="Courses"
          />
          <p className="max-w-xl text-center text-body">
            Hand-picked courses our learners love the most this month.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 6).map((course, i) => (
            <Reveal key={course.slug} delay={i * 0.08}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>

        <Reveal className="flex justify-center">
          <Button href="/courses" variant="dark" size="lg">
            Explore More
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

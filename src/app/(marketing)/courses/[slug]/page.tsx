import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Users, Clock, Award, CheckCircle2, PlayCircle } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/Button";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";
import { courses } from "@/constants/data";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: `Enroll in ${course.title} on WebHack Academy — ${course.lessons} lessons, ${course.level} level.`,
  };
}

const curriculum = [
  "Getting started & environment setup",
  "Core concepts and fundamentals",
  "Hands-on project walkthrough",
  "Advanced techniques & best practices",
  "Final project & certification",
];

const outcomes = [
  "Build real-world, portfolio-ready projects",
  "Understand industry best practices",
  "Get personalised mentor feedback",
  "Earn a shareable certificate",
];

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <>
      <PageHero title={course.title} crumb="Course" />

      <section className="py-16 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          {/* Main */}
          <div className="flex flex-col gap-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
              <Image
                src={course.image}
                alt={course.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <StarRating rating={course.rating} />
                <span className="font-semibold text-ink">{course.rating.toFixed(1)}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-violet" /> {course.lessons} lessons
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-violet" /> {course.students} students
              </span>
              <span className="inline-flex items-center gap-2">
                <Award className="h-4 w-4 text-violet" /> {course.level}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold">Course overview</h2>
              <p className="text-body">
                This {course.level.toLowerCase()} {course.category.toLowerCase()} course
                gives you a practical, hands-on path from fundamentals to shipping
                real work. Taught by expert mentors, it combines video lessons with
                real-time guidance and a growing library of resources.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold">What you&apos;ll learn</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-ink/80">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold">Curriculum</h2>
              <ol className="flex flex-col gap-2">
                {curriculum.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 rounded-[var(--radius)] border border-line bg-white p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 font-semibold text-violet-deep">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-medium text-ink">{item}</span>
                    <PlayCircle className="h-5 w-5 text-muted" />
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-line bg-white p-7 shadow-[var(--shadow-card)]">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-ink">
                  {course.price}
                </span>
                {course.price !== "Free" && (
                  <span className="text-muted line-through">$129</span>
                )}
              </div>
              <Button href="/register" size="lg" className="w-full">
                Enroll Now
              </Button>
              <ul className="flex flex-col gap-3 text-sm text-body">
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-violet" /> Lifetime access
                </li>
                <li className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-violet" /> {course.lessons} on-demand lessons
                </li>
                <li className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-violet" /> Certificate of completion
                </li>
                <li className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-violet" /> Community &amp; mentor support
                </li>
              </ul>
              <Link
                href="/courses"
                className="text-center text-sm font-medium text-violet-deep hover:underline"
              >
                ← Back to all courses
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}

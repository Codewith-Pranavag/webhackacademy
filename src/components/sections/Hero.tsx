"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

const float = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-soft pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-violet-100/70 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-sky/10 blur-[120px]"
      />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <div className="flex flex-col items-start gap-7">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-pill border border-violet/20 bg-white px-4 py-2 text-sm font-medium text-violet-deep shadow-sm"
          >
            <Star className="h-4 w-4 fill-amber text-amber" />
            Rated 4.9/5 by 2,367 learners
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Learn From <br />
            <span className="text-gradient-violet">Experts</span>{" "}
            <span className="inline-block align-middle">
              <Image
                src="/images/2026f93f-nextline-star-1.png"
                alt=""
                width={44}
                height={44}
                className="inline h-9 w-9 lg:h-11 lg:w-11"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-xl text-lg text-body"
          >
            Choose from <span className="font-semibold text-ink">213k</span> online
            video &amp; real-time courses published every month. Develop skills with
            world-class mentors from 200+ renowned universities &amp; institutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button href="/courses" size="lg">
              Explore Our Courses
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/register" variant="outline" size="lg">
              <Play className="h-4 w-4 fill-current" />
              Join Community
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-4 flex items-center gap-8"
          >
            <div>
              <div className="font-display text-3xl font-bold text-ink">
                <AnimatedCounter value={2000} suffix="+" />
              </div>
              <p className="text-sm text-muted">Experts worldwide</p>
            </div>
            <div className="h-10 w-px bg-line" />
            <div>
              <div className="font-display text-3xl font-bold text-ink">
                <AnimatedCounter value={50} suffix="k+" />
              </div>
              <p className="text-sm text-muted">Active learners</p>
            </div>
          </motion.div>
        </div>

        {/* Visual collage */}
        <div className="relative mx-auto w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]"
          >
            <Image
              src="/images/6b6dc037-nextline-image-6.jpg"
              alt="A WebHack Academy learner"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
          </motion.div>

          {/* Floating stat card */}
          <motion.div
            variants={float}
            animate="animate"
            className="absolute -left-6 top-16 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-soft text-green">
              <Star className="h-5 w-5 fill-green text-green" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold text-ink">4.9/5</p>
              <p className="text-xs text-muted">Average rating</p>
            </div>
          </motion.div>

          {/* Floating course card */}
          <motion.div
            variants={float}
            animate="animate"
            transition={{ delay: 0.8 }}
            className="absolute -right-4 bottom-12 flex w-52 items-center gap-3 rounded-2xl bg-white p-3 shadow-[var(--shadow-card)]"
          >
            <Image
              src="/images/80ed5538-nextlearn-course-image-1.jpg"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">Product Design</p>
              <p className="text-xs text-green">Free · 24 lessons</p>
            </div>
          </motion.div>

          <Image
            src="/images/09993f99-nextline-obj02.png"
            alt=""
            width={90}
            height={90}
            className="pointer-events-none absolute -bottom-6 left-8 h-16 w-16 opacity-90"
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

export function NewsletterCTA() {
  const [done, setDone] = useState(false);

  return (
    <section className="pb-24">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-violet-deep to-violet px-8 py-14 text-center text-white shadow-[var(--shadow-soft)] md:px-16 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-sky/20 blur-3xl"
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
              <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                <span className="text-amber">Join now</span> to get a special offer
              </h2>
              <p className="max-w-lg text-white/80">
                Subscribe to our newsletter and get 20% off your first premium course,
                plus weekly learning resources.
              </p>

              {done ? (
                <p className="inline-flex items-center gap-2 rounded-pill bg-white/15 px-6 py-3 font-medium">
                  <CheckCircle2 className="h-5 w-5" /> You&apos;re subscribed — check
                  your inbox!
                </p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDone(true);
                  }}
                  className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="h-14 flex-1 rounded-pill bg-white px-6 text-ink outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-amber"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-ink px-7 font-medium text-white transition-transform hover:-translate-y-0.5"
                  >
                    Subscribe
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

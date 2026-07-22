import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { StarRating } from "@/components/shared/StarRating";

const perks = [
  "Access 213k+ video & real-time courses",
  "Learn from 2,000+ expert mentors",
  "Earn shareable certificates",
];

/** Split-screen auth layout: brand panel + form card. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-surface-soft pt-28 pb-16">
      <div className="container-page">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)] lg:grid-cols-2">
          {/* Brand panel */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-deep to-violet p-10 text-white lg:flex">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-sky/20 blur-3xl"
            />
            <Logo variant="light" />
            <div className="relative flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-white">
                Learn from the best. Grow every day.
              </h2>
              <ul className="flex flex-col gap-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-white/90">
                    <CheckCircle2 className="h-5 w-5 text-amber" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <StarRating rating={5} />
              <p className="text-sm text-white/90">
                Rated <span className="font-semibold text-white">4.9/5</span> by 2,367
                learners
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="flex flex-col justify-center gap-6 p-8 sm:p-12">
            <div className="flex flex-col gap-2 lg:hidden">
              <Logo />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-body">{subtitle}</p>
            </div>
            {children}
            <p className="text-center text-sm text-muted">{footer}</p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="font-medium text-violet-deep hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Inner-page banner with title + breadcrumb, in the template style. */
export function PageHero({
  title,
  highlight,
  subtitle,
  crumb,
}: {
  title: string;
  highlight?: string;
  subtitle?: string;
  crumb: string;
}) {
  return (
    <section className="relative overflow-hidden bg-surface-soft pt-36 pb-16 lg:pt-44 lg:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-100/70 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky/10 blur-[110px]"
      />
      <div className="container-page relative flex flex-col items-center gap-5 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
          {title}
          {highlight && <span className="text-violet"> {highlight}</span>}
        </h1>
        {subtitle && (
          <p className="max-w-2xl text-lg text-body">{subtitle}</p>
        )}
        <nav
          aria-label="Breadcrumb"
          className="inline-flex items-center gap-2 rounded-pill border border-line bg-white px-5 py-2 text-sm font-medium shadow-sm"
        >
          <Link href="/" className="text-muted transition-colors hover:text-violet-deep">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted" />
          <span className="text-violet-deep">{crumb}</span>
        </nav>
      </div>
    </section>
  );
}

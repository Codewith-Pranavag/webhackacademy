import Link from "next/link";
import { Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-soft px-5 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-100/70 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-sky/10 blur-[110px]"
      />
      <div className="relative flex flex-col items-center gap-6 text-center">
        <span className="font-display text-[7rem] font-bold leading-none text-gradient-violet sm:text-[10rem]">
          404
        </span>
        <h1 className="text-3xl font-bold sm:text-4xl">Page not found</h1>
        <p className="max-w-md text-body">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s
          get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/" size="lg">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
          <Button href="/courses" variant="outline" size="lg">
            <Compass className="h-5 w-5" />
            Browse Courses
          </Button>
        </div>
        <Link href="/contact" className="text-sm font-medium text-violet-deep hover:underline">
          Need help? Contact us
        </Link>
      </div>
    </section>
  );
}

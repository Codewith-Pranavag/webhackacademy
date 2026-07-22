import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/constants/site";

/**
 * WebHack Academy wordmark.
 * Keeps the template's playful multi-colour dot motif, rebranded.
 */
export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="34" height="34" rx="10" fill="var(--color-violet-deep)" />
        <circle cx="11" cy="26" r="2.3" fill="var(--color-amber)" />
        <circle cx="17" cy="26" r="2.3" fill="var(--color-pink)" />
        <circle cx="23" cy="26" r="2.3" fill="var(--color-sky)" />
        {/* </> code motif */}
        <path
          d="M13.4 8.8 8.6 13.6a1.2 1.2 0 0 0 0 1.7l4.8 4.8"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M20.6 8.8l4.8 4.8a1.2 1.2 0 0 1 0 1.7l-4.8 4.8"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.35rem] font-bold tracking-tight",
            variant === "light" ? "text-white" : "text-ink",
          )}
        >
          Web<span className="text-violet">Hack</span>
        </span>
        <span
          className={cn(
            "text-[0.62rem] font-medium uppercase tracking-[0.28em]",
            variant === "light" ? "text-white/70" : "text-muted",
          )}
        >
          Academy
        </span>
      </span>
    </Link>
  );
}

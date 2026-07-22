import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "violet" | "green" | "orange" | "sky" | "amber" | "neutral";

const tones: Record<Tone, string> = {
  violet: "bg-violet-50 text-violet-deep",
  green: "bg-green-soft text-green",
  orange: "bg-orange/10 text-orange",
  sky: "bg-sky/10 text-sky",
  amber: "bg-amber/15 text-[#b47a1e]",
  neutral: "bg-line/60 text-ink/70",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

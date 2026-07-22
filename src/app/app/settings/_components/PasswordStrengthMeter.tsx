"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface Strength {
  score: number; // 0-4
  label: string;
  barClass: string;
  textClass: string;
}

/** Scores a password on length + character-class variety. */
export function scorePassword(pw: string): Strength {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((re) =>
    re.test(pw),
  ).length;
  if (classes >= 2) score++;
  if (classes >= 4) score++;
  score = Math.min(4, score);

  if (!pw) {
    return { score: 0, label: "", barClass: "bg-line", textClass: "text-muted" };
  }
  const map: Record<number, Omit<Strength, "score">> = {
    0: { label: "Very weak", barClass: "bg-orange", textClass: "text-orange" },
    1: { label: "Weak", barClass: "bg-orange", textClass: "text-orange" },
    2: { label: "Fair", barClass: "bg-amber", textClass: "text-[#b47a1e]" },
    3: { label: "Good", barClass: "bg-sky", textClass: "text-sky" },
    4: { label: "Strong", barClass: "bg-green", textClass: "text-green" },
  };
  return { score, ...map[score] };
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = useMemo(() => scorePassword(password), [password]);

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-pill transition-colors",
              i < strength.score ? strength.barClass : "bg-line",
            )}
          />
        ))}
      </div>
      {strength.label && (
        <p className={cn("mt-1.5 text-xs font-medium", strength.textClass)}>
          Password strength: {strength.label}
        </p>
      )}
    </div>
  );
}

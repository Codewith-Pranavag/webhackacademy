"use client";

import { useRef } from "react";

/** 6-box one-time-code input with paste + arrow support. */
export function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (next: string) => void;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setChar = (i: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[i] = digit;
    const joined = next.join("").slice(0, length);
    onChange(joined);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value[i] ?? ""}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => setChar(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (pasted) onChange(pasted);
          }}
          className="h-14 w-11 rounded-[var(--radius)] border border-line bg-surface-soft text-center font-mono text-2xl text-ink outline-none transition-colors focus:border-violet focus:bg-surface sm:w-12"
        />
      ))}
    </div>
  );
}

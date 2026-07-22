"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const authInputClass =
  "h-12 w-full rounded-[var(--radius)] border border-line bg-surface-soft px-4 text-ink outline-none transition-colors placeholder:text-muted focus:border-violet focus:bg-white";

export function AuthField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-orange">{error}</span>}
    </label>
  );
}

export function PasswordInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const [show, setShow] = React.useState(false);
  return (
    <span className="relative flex items-center">
      <input {...props} type={show ? "text" : "password"} className={cn(authInputClass, "pr-16")} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 text-xs font-medium text-violet-deep"
      >
        {show ? "Hide" : "Show"}
      </button>
    </span>
  );
}

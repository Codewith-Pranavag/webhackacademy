import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  tone = "violet",
}: {
  value: number;
  className?: string;
  tone?: "violet" | "green" | "amber";
}) {
  const color =
    tone === "green" ? "bg-green" : tone === "amber" ? "bg-amber" : "bg-violet-deep";
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-pill bg-line", className)}>
      <div
        className={cn("h-full rounded-pill transition-[width] duration-700", color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 84,
  stroke = 8,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-line" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="fill-none stroke-[var(--color-violet-deep)] transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-bold text-ink">{Math.round(value)}%</span>
        {label && <span className="text-[0.65rem] text-muted">{label}</span>}
      </span>
    </div>
  );
}

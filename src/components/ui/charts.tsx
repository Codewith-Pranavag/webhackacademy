"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const VIOLET = "#5633d1";
const VIOLET_SOFT = "#855be2";

/* --------------------------- Area / line -------------------------- */

export function AreaChart({
  data,
  height = 220,
  className,
  valueSuffix = "",
}: {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
  valueSuffix?: string;
}) {
  const gid = useId();
  const W = 640;
  const H = height;
  const pad = { top: 16, right: 12, bottom: 28, left: 34 };
  const max = Math.max(...data.map((d) => d.value)) * 1.15 || 1;
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;
  const x = (i: number) => pad.left + (i / Math.max(1, data.length - 1)) * iw;
  const y = (v: number) => pad.top + ih - (v / max) * ih;

  const line = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area = `${pad.left},${pad.top + ih} ${line} ${x(data.length - 1)},${pad.top + ih}`;
  const ticks = 4;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("w-full", className)}
      role="img"
      aria-label="Area chart"
    >
      <defs>
        <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={VIOLET} stopOpacity="0.28" />
          <stop offset="100%" stopColor={VIOLET} stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const gy = pad.top + (ih / ticks) * i;
        return (
          <line
            key={i}
            x1={pad.left}
            y1={gy}
            x2={W - pad.right}
            y2={gy}
            stroke="#ececf1"
            strokeWidth="1"
          />
        );
      })}
      <polygon points={area} fill={`url(#area-${gid})`} />
      <polyline
        points={line}
        fill="none"
        stroke={VIOLET}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.value)} r="3.5" fill="#fff" stroke={VIOLET} strokeWidth="2" />
          <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-[#7a7a7a] text-[11px]">
            {d.label}
          </text>
        </g>
      ))}
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const v = (max / ticks) * (ticks - i);
        const gy = pad.top + (ih / ticks) * i;
        return (
          <text key={i} x={pad.left - 6} y={gy + 3} textAnchor="end" className="fill-[#a6a6ad] text-[10px]">
            {Math.round(v)}
            {valueSuffix}
          </text>
        );
      })}
    </svg>
  );
}

/* ------------------------------ Bars ------------------------------ */

export function BarChart({
  data,
  height = 220,
  className,
  tone = VIOLET,
}: {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
  tone?: string;
}) {
  const W = 640;
  const H = height;
  const pad = { top: 16, right: 12, bottom: 28, left: 34 };
  const max = Math.max(...data.map((d) => d.value)) * 1.15 || 1;
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;
  const bw = (iw / data.length) * 0.55;
  const gap = (iw / data.length) * 0.45;
  const ticks = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} role="img" aria-label="Bar chart">
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const gy = pad.top + (ih / ticks) * i;
        return <line key={i} x1={pad.left} y1={gy} x2={W - pad.right} y2={gy} stroke="#ececf1" />;
      })}
      {data.map((d, i) => {
        const h = (d.value / max) * ih;
        const bx = pad.left + i * (bw + gap) + gap / 2;
        const by = pad.top + ih - h;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={bw} height={h} rx="6" fill={tone} opacity={0.9}>
              <animate attributeName="height" from="0" to={h} dur="0.6s" fill="freeze" />
              <animate attributeName="y" from={pad.top + ih} to={by} dur="0.6s" fill="freeze" />
            </rect>
            <text x={bx + bw / 2} y={H - 8} textAnchor="middle" className="fill-[#7a7a7a] text-[11px]">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ----------------------------- Donut ------------------------------ */

const DONUT_COLORS = [VIOLET, VIOLET_SOFT, "#5ac0ff", "#ffb45a", "#ff7b8e", "#5dbe74"];

export function DonutChart({
  data,
  size = 180,
  thickness = 26,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {data.map((d, i) => {
            const frac = d.value / total;
            const dash = frac * c;
            const seg = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return seg;
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
            {centerValue && (
              <span className="font-display text-2xl font-bold text-ink">{centerValue}</span>
            )}
            {centerLabel && <span className="text-xs text-muted">{centerLabel}</span>}
          </div>
        )}
      </div>
      <ul className="flex flex-col gap-2 text-sm">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
            />
            <span className="text-body">{d.label}</span>
            <span className="ml-auto font-medium text-ink">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------- Sparkline ---------------------------- */

export function Sparkline({
  data,
  className,
  tone = VIOLET,
}: {
  data: number[];
  className?: string;
  tone?: string;
}) {
  const W = 120;
  const H = 36;
  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-9 w-28", className)} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
} from "lucide-react";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function VideoStage({
  lesson,
  poster,
  onEnded,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  lesson: Lesson;
  poster: string;
  onEnded: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const duration = lesson.duration;

  // Reset when the lesson changes.
  useEffect(() => {
    setTime(0);
    setPlaying(false);
  }, [lesson.id]);

  // Simulated playback clock.
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setTime((t) => {
        const next = t + speed;
        if (next >= duration) {
          clearInterval(interval);
          setPlaying(false);
          onEnded();
          return duration;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [playing, speed, duration, onEnded]);

  const pct = (time / duration) * 100;

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setTime(Math.max(0, Math.min(duration, ratio * duration)));
  };

  const fullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-ink"
    >
      <Image src={poster} alt={lesson.title} fill sizes="900px" className="object-cover opacity-40" />

      {/* Center play */}
      <button
        onClick={() => setPlaying((p) => !p)}
        className="absolute inset-0 flex items-center justify-center"
        aria-label={playing ? "Pause" : "Play"}
      >
        <span
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-violet-deep shadow-xl transition-transform",
            playing ? "scale-0 opacity-0" : "scale-100 group-hover:scale-105",
          )}
        >
          <Play className="h-9 w-9 translate-x-0.5 fill-current" />
        </span>
      </button>

      {/* Title chip */}
      <div className="absolute left-4 top-4 rounded-pill bg-black/40 px-3 py-1 text-sm font-medium text-white backdrop-blur">
        {lesson.title}
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
        {/* Seek bar */}
        <div
          onClick={seek}
          className="group/seek mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/25"
        >
          <div className="relative h-full rounded-full bg-violet" style={{ width: `${pct}%` }}>
            <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover/seek:opacity-100" />
          </div>
        </div>

        <div className="flex items-center gap-3 text-white">
          <button onClick={onPrev} disabled={!hasPrev} className="disabled:opacity-40" aria-label="Previous lesson">
            <SkipBack className="h-5 w-5" />
          </button>
          <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
          </button>
          <button onClick={onNext} disabled={!hasNext} className="disabled:opacity-40" aria-label="Next lesson">
            <SkipForward className="h-5 w-5" />
          </button>
          <button onClick={() => setMuted((m) => !m)} aria-label="Mute">
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <span className="text-xs tabular-nums text-white/90">
            {formatDuration(time)} / {formatDuration(duration)}
          </span>

          <div className="relative ml-auto">
            <button
              onClick={() => setSpeedOpen((o) => !o)}
              className="flex items-center gap-1 text-xs font-medium"
              aria-label="Playback speed"
            >
              <Settings className="h-4 w-4" /> {speed}×
            </button>
            {speedOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-24 overflow-hidden rounded-lg bg-ink/95 p-1 backdrop-blur">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSpeed(s);
                      setSpeedOpen(false);
                    }}
                    className={cn(
                      "block w-full rounded px-3 py-1.5 text-left text-xs hover:bg-white/10",
                      s === speed && "text-violet",
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={fullscreen} aria-label="Fullscreen">
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

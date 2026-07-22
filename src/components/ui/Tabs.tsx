"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: TabItem[];
  active?: string;
  onChange?: (id: string) => void;
  className?: string;
}) {
  const [internal, setInternal] = useState(tabs[0]?.id);
  const current = active ?? internal;

  const select = (id: string) => {
    setInternal(id);
    onChange?.(id);
  };

  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto no-scrollbar border-b border-line",
        className,
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === current;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => select(tab.id)}
            className={cn(
              "relative inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
              isActive ? "text-violet-deep" : "text-muted hover:text-ink",
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className="rounded-pill bg-line/70 px-1.5 text-xs text-ink/70">
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-pill bg-violet-deep" />
            )}
          </button>
        );
      })}
    </div>
  );
}

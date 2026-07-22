"use client";

import { useEffect, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { SessionExpired } from "./SessionScreens";
import { useUI } from "@/store/ui";
import { useAuth } from "@/store/auth";
import { useNotifications } from "@/store/notifications";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const theme = useUI((s) => s.theme);
  const status = useAuth((s) => s.status);
  const loadNotifications = useNotifications((s) => s.load);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <div className={cn(theme === "dark" && "dark")}>
      <div className="flex min-h-screen bg-surface-soft text-body">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            {status === "expired" ? <SessionExpired /> : children}
          </main>
        </div>
      </div>
    </div>
  );
}

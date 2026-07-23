"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { SessionExpired } from "./SessionScreens";
import { useUI } from "@/store/ui";
import { useAuth } from "@/store/auth";
import { useNotifications } from "@/store/notifications";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

/** Route-prefix → roles allowed to view it. */
const ROLE_GUARDS: { prefix: string; roles: Role[] }[] = [
  { prefix: "/app/admin", roles: ["admin"] },
  { prefix: "/app/instructor", roles: ["instructor", "admin"] },
];

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useUI((s) => s.theme);
  const status = useAuth((s) => s.status);
  const hydrated = useAuth((s) => s.hydrated);
  const hydrate = useAuth((s) => s.hydrate);
  const hasRole = useAuth((s) => s.hasRole);
  const loadNotifications = useNotifications((s) => s.load);

  // Validate persisted tokens against the backend on first mount.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Redirect unauthenticated visitors to the login page.
  useEffect(() => {
    if (hydrated && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [hydrated, status, router]);

  // Role-based protection for admin / instructor areas.
  useEffect(() => {
    if (status !== "authenticated") return;
    const guard = ROLE_GUARDS.find((g) => pathname.startsWith(g.prefix));
    if (guard && !hasRole(guard.roles)) {
      router.replace("/app/unauthorized");
    }
  }, [status, pathname, hasRole, router]);

  useEffect(() => {
    if (status === "authenticated") loadNotifications();
  }, [status, loadNotifications]);

  // Hold rendering until we know whether the visitor is signed in, so
  // protected content never flashes before a redirect.
  if (!hydrated && status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-soft">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-violet-deep" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-soft">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-violet-deep" />
      </div>
    );
  }

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

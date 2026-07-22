"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeft, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { navByRole } from "@/constants/nav";
import { useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";
import { useNotifications } from "@/store/notifications";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const role = useAuth((s) => s.user?.role ?? "student");
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebar } =
    useUI();
  const unread = useNotifications((s) => s.items.filter((n) => !n.read).length);

  const groups = navByRole[role];

  const isActive = (href: string) => {
    // exact for dashboards, prefix otherwise
    const exact = ["/app/dashboard", "/app/instructor", "/app/admin"];
    return exact.includes(href) ? pathname === href : pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebar(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-surface transition-all duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0",
          sidebarCollapsed ? "lg:w-[76px]" : "lg:w-64",
          "w-64",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-20 shrink-0 items-center justify-between px-5">
          {!sidebarCollapsed && <Logo />}
          <button
            onClick={() => setMobileSidebar(false)}
            className="text-muted lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={toggleSidebar}
            className="hidden text-muted transition-colors hover:text-violet-deep lg:block"
            aria-label="Collapse sidebar"
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6 no-scrollbar">
          {groups.map((group) => (
            <div key={group.title} className="mb-5">
              {!sidebarCollapsed && (
                <p className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-wider text-muted">
                  {group.title}
                </p>
              )}
              <ul className="flex flex-col gap-1">
                {group.links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileSidebar(false)}
                        title={sidebarCollapsed ? link.label : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-violet-deep text-white"
                            : "text-body hover:bg-violet-50 hover:text-violet-deep",
                          sidebarCollapsed && "justify-center",
                        )}
                      >
                        <link.icon className="h-[18px] w-[18px] shrink-0" />
                        {!sidebarCollapsed && <span className="flex-1">{link.label}</span>}
                        {link.badge === "notifications" && unread > 0 && (
                          <span
                            className={cn(
                              "flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1.5 text-[0.65rem] font-bold text-white",
                              sidebarCollapsed && "absolute right-1 top-1 h-4 min-w-4",
                            )}
                          >
                            {unread}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

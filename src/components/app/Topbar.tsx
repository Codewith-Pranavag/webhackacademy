"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Repeat,
  Check,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useUI } from "@/store/ui";
import { useAuth } from "@/store/auth";
import { useNotifications } from "@/store/notifications";
import { toast } from "@/store/toast";
import { timeAgo } from "@/lib/format";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

function useOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

export function Topbar() {
  const router = useRouter();
  const { setMobileSidebar, theme, toggleTheme } = useUI();
  const { user, logout, switchRole } = useAuth();
  const { items, markAllRead } = useNotifications();
  const unread = items.filter((n) => !n.read);

  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  const notifRef = useOutside(() => setNotifOpen(false));
  const menuRef = useOutside(() => setMenuOpen(false));

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/app/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  const doLogout = async () => {
    await logout();
    toast.success("Signed out", "You have been logged out.");
    router.push("/login");
  };

  const changeRole = (role: Role) => {
    switchRole(role);
    setMenuOpen(false);
    toast.info(`Viewing as ${role}`, "Demo role switch — navigation updated.");
    router.push(role === "student" ? "/app/dashboard" : role === "instructor" ? "/app/instructor" : "/app/admin");
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-md lg:px-6">
      <button
        onClick={() => setMobileSidebar(true)}
        className="text-ink lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Search */}
      <form onSubmit={submitSearch} className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses, mentors, lessons…"
          className="h-11 w-full rounded-pill border border-line bg-surface-soft pl-11 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-violet"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-10 w-10 items-center justify-center rounded-full text-body transition-colors hover:bg-violet-50 hover:text-violet-deep"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-body transition-colors hover:bg-violet-50 hover:text-violet-deep"
          >
            <Bell className="h-5 w-5" />
            {unread.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange px-1 text-[0.6rem] font-bold text-white">
                {unread.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="font-semibold text-ink">Notifications</p>
                <button
                  onClick={() => markAllRead()}
                  className="text-xs font-medium text-violet-deep hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {items.slice(0, 5).map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href ?? "/app/notifications"}
                      onClick={() => setNotifOpen(false)}
                      className={cn(
                        "block border-b border-line px-4 py-3 transition-colors last:border-0 hover:bg-surface-soft",
                        !n.read && "bg-violet-50/50",
                      )}
                    >
                      <p className="text-sm font-medium text-ink">{n.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-body">{n.body}</p>
                      <p className="mt-1 text-[0.68rem] text-muted">{timeAgo(n.createdAt)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/app/notifications"
                onClick={() => setNotifOpen(false)}
                className="block border-t border-line py-3 text-center text-sm font-medium text-violet-deep hover:bg-surface-soft"
              >
                View all
              </Link>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-pill py-1 pl-1 pr-2 transition-colors hover:bg-violet-50"
          >
            <Avatar src={user?.avatar} name={user?.name ?? "User"} size={36} />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-ink">
                {user?.name}
              </span>
              <span className="block text-xs capitalize leading-tight text-muted">
                {user?.role}
              </span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted sm:block" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface p-1.5 shadow-[var(--shadow-card)]">
              <MenuLink href="/app/profile" icon={<UserIcon className="h-4 w-4" />} onClick={() => setMenuOpen(false)}>
                Profile
              </MenuLink>
              <MenuLink href="/app/settings" icon={<SettingsIcon className="h-4 w-4" />} onClick={() => setMenuOpen(false)}>
                Settings
              </MenuLink>

              <div className="my-1.5 border-t border-line" />
              <p className="px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-muted">
                <span className="inline-flex items-center gap-1">
                  <Repeat className="h-3 w-3" /> Switch view (demo)
                </span>
              </p>
              {(["student", "instructor", "admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => changeRole(r)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm capitalize text-body transition-colors hover:bg-violet-50 hover:text-violet-deep"
                >
                  {r}
                  {user?.role === r && <Check className="h-4 w-4 text-violet-deep" />}
                </button>
              ))}

              <div className="my-1.5 border-t border-line" />
              <button
                onClick={doLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-orange transition-colors hover:bg-orange/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-body transition-colors hover:bg-violet-50 hover:text-violet-deep"
    >
      {icon}
      {children}
    </Link>
  );
}

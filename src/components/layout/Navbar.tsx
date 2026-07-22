"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";
import { mainNav } from "@/constants/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 shadow-[0_10px_40px_-24px_rgba(28,28,36,0.4)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav className="container-page flex h-20 items-center justify-between gap-6">
        <Logo />

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <li key={item.href} className="group relative">
              <Link
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1 rounded-pill px-4 py-2 text-[0.95rem] font-medium transition-colors",
                  isActive(item.href)
                    ? "text-violet-deep"
                    : "text-ink/80 hover:text-violet-deep",
                )}
              >
                {item.label}
                {item.children && (
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                )}
              </Link>
              {item.children && (
                <ul className="invisible absolute left-0 top-full min-w-48 translate-y-2 rounded-2xl border border-line bg-white p-2 opacity-0 shadow-[var(--shadow-card)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block rounded-xl px-4 py-2.5 text-sm text-ink/80 transition-colors hover:bg-violet-50 hover:text-violet-deep"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="text-[0.95rem] font-medium text-ink/80 transition-colors hover:text-violet-deep"
          >
            Login
          </Link>
          <Button href="/register" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-line bg-white transition-[max-height] duration-300",
          open ? "max-h-[80vh]" : "max-h-0",
        )}
      >
        <ul className="container-page flex flex-col gap-1 py-4">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-violet-50 text-violet-deep"
                    : "text-ink/80 hover:bg-violet-50",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-3 flex gap-3 px-1">
            <Button href="/login" variant="outline" size="sm" className="flex-1">
              Login
            </Button>
            <Button href="/register" size="sm" className="flex-1">
              Get Started
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}

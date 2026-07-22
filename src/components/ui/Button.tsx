import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "ghost" | "green";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-all duration-300 ease-[var(--ease-out-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/50 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-violet-deep text-white shadow-[var(--shadow-btn)] hover:-translate-y-0.5 hover:bg-violet",
  dark: "bg-ink text-white hover:-translate-y-0.5 hover:bg-ink-soft",
  green:
    "bg-green text-white shadow-[0_16px_30px_-14px_rgba(93,190,116,0.7)] hover:-translate-y-0.5",
  outline:
    "border border-ink/15 text-ink bg-transparent hover:border-violet hover:text-violet",
  ghost: "text-ink hover:text-violet",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-[0.95rem]",
  lg: "h-14 px-9 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props as ButtonAsLink;
    void _v; void _s; void _c; void _ch;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  void _v; void _s; void _c; void _ch;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

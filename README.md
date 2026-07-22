# WebHack Academy

A modern, enterprise-grade frontend for **WebHack Academy** — a Learning Management System — rebuilt from the *NextLearn* eLearning template with near pixel-perfect fidelity using a scalable Next.js 15 architecture.

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` design tokens)
- **Motion** (Framer Motion) — scroll reveals, counters, floating accents
- **Lenis** — smooth scrolling (respects `prefers-reduced-motion`)
- **React Hook Form** + **Zod** — accessible, validated forms
- **Lucide Icons**, `next/font` (Kanit + Roboto), `next/image`

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
npm run typecheck
```

## Project structure

```
src/
  app/                 # App Router pages (route = folder)
    page.tsx           # Home
    about/ courses/ courses/[slug]/ mentors/ contact/
    login/ register/ forgot-password/
    terms/ privacy/
    not-found.tsx      # 404
    sitemap.ts robots.ts
    layout.tsx globals.css
  components/
    layout/            # Navbar, Footer
    sections/          # Composable page sections (Hero, Testimonials, …)
    shared/            # Reusable UI (CourseCard, Reveal, PageHero, Logo, …)
    ui/                # Primitives (Button)
    auth/              # AuthShell + form components
  constants/           # site config (branding/nav) + demo data
  lib/                 # fonts, utils (cn)
public/images/         # template assets
```

## Design system

Design tokens live in [`src/app/globals.css`](src/app/globals.css) under `@theme`:

- **Brand:** violet `#5633d1` / `#855be2`, ink `#1c1c24`, green `#5dbe74`, warm accents (orange/pink/sky/amber)
- **Type:** Kanit (display) + Roboto (body)
- Radii, shadows, easing and layout width are all tokenized.

Rebranding is centralised in [`src/constants/site.ts`](src/constants/site.ts).

## Notes

- All content is demo data ([`src/constants/data.ts`](src/constants/data.ts)) — ready to swap for a real backend/API layer.
- Auth and contact forms validate client-side and are wired for a future backend.
- Every route is statically prerendered; course detail pages use `generateStaticParams` (SSG).

# WebHack Academy — Frontend conventions (Phase 2)

Read this before creating any page. Mirror the existing dashboard page at
`src/app/app/dashboard/page.tsx` for structure, spacing and polish.

## Golden rules
- **Do NOT modify existing shared files** (anything in `src/components/ui`, `src/components/app`,
  `src/components/shared`, `src/lib`, `src/store`, `src/services`, `src/mocks`, `src/types`,
  `src/constants`, `globals.css`). Only CREATE new page files (and, if truly needed, new
  colocated components under `src/components/app/`). If you need data that a service doesn't
  expose, use what exists — do not edit services.
- **Every page is a client component** (`"use client";`) that fetches via the service layer
  using the `useAsync` hook and renders **loading (Skeleton) / error (ErrorState) / empty
  (EmptyState) / data** states. Never render raw undefined data.
- Strict TypeScript. No `any`. No `console.log`. No unused imports/vars (prefix intentionally
  unused params with `_`). Keep it lint-clean.
- Use the design tokens via utilities: `text-ink`, `text-body`, `text-muted`, `text-violet`,
  `text-violet-deep`, `bg-surface`, `bg-surface-soft`, `border-line`, `bg-violet-50`,
  `text-green`, `text-orange`, `bg-amber`. **Use `bg-surface` (NOT `bg-white`)** for cards so
  dark mode works. Radii via `rounded-[var(--radius-lg)]` / `rounded-[var(--radius)]` /
  `rounded-pill`. Font: headings get `font-display` where appropriate.
- Wrap each page in a top-level `<div>`; start with `<PageHeader title=... description=... />`.

## Available building blocks (import paths)
- `@/components/app/PageHeader` → `<PageHeader title description action />`
- `@/components/ui/Card` → `Card`, `CardHeader` (`title`, `action`), `StatCard` (`label,value,delta,trend,icon,href`)
- `@/components/ui/feedback` → `Skeleton`, `Spinner`, `LoadingBlock`, `EmptyState` (`icon,title,description,action`), `ErrorState` (`onRetry`)
- `@/components/ui/Badge` → `Badge` (`tone`: violet|green|orange|sky|amber|neutral)
- `@/components/ui/Avatar` → `Avatar` (`src,name,size,online`)
- `@/components/ui/Progress` → `ProgressBar` (`value,tone`), `ProgressRing` (`value,size,label`)
- `@/components/ui/Tabs` → `Tabs` (`tabs:{id,label,icon?,count?}[]`, `active`, `onChange`)
- `@/components/ui/Dialog` → `Dialog` (`open,onClose,title,footer`)
- `@/components/ui/DataTable` → `DataTable` (`columns:Column<T>[]`, `rows`, `loading`, `emptyLabel`), `Pagination` (`page,pageSize,total,onPage`)
- `@/components/ui/charts` → `AreaChart` (`data:{label,value}[]`, `valueSuffix`), `BarChart` (`data`, `tone`), `DonutChart` (`data`, `centerLabel`, `centerValue`), `Sparkline` (`data:number[]`)
- `@/components/ui/Button` → `Button` (`variant`: primary|dark|outline|ghost|green, `size`: sm|md|lg, `href?`, `onClick?`)
- `@/hooks/useAsync` → `const { data, loading, error, refetch } = useAsync(() => svc.call(), [deps])`
- `@/store/toast` → `toast.success/error/info/warning(title, description?)`
- `@/store/auth` → `useAuth((s) => s.user)`, `.login/.logout/.hasRole/.switchRole`
- `@/lib/format` → `timeAgo`, `formatDate`, `formatTime`, `formatDuration`, `formatHoursMins`, `formatMoney`, `formatNumber`
- Icons: `lucide-react`.

## Services (all async, return typed data from `@/types`)
- `courseService` (`@/services/course.service`): `list({page,pageSize,category,query})→Paginated<CourseSummary>`, `getBySlug`, `getById`, `enrollments()→(Enrollment&{course:CourseSummary})[]`, `instructor(id)`
- `dashboardService.get()→DashboardData`
- `quizService`: `list()→Quiz[]`, `get(id)`, `submit(quizId, answers)`
- `assignmentService`: `list()→Assignment[]`, `get(id)`, `submit(id, files)`
- `certificateService`: `list()→Certificate[]`, `get(id)`, `verify(credentialId)`
- `notificationService`: `list()`, `markRead(id)`, `markAllRead()`  (prefer the `useNotifications` store: `@/store/notifications`)
- `messageService`: `conversations()→Conversation[]`, `get(id)`, `send(conversationId, text)`
- `analyticsService.student()→StudyAnalytics`
- `userService` (`@/services/user.service`): `profile()`, `updateProfile(patch)`, `achievements()→Achievement[]`, `leaderboard()→LeaderboardEntry[]`, `wishlist()→CourseSummary[]`, `bookmarks()→{ids}`, `notes()→Note[]`, `downloads()→CourseSummary[]`, `calendar()→CalendarEvent[]`, `sessions()→Session[]`, `loginHistory()→LoginHistoryEntry[]`
- `adminService`: `stats()→AdminStats`, `users({page,pageSize,query,role})→Paginated<AdminUserRow>`, `courses()→Course[]`, `auditLogs(page)→Paginated<AuditLog>`
- `instructorService`: `stats()→InstructorStats`, `courses()→Course[]`, `students()→AdminUserRow[]`, `submissions()→Assignment[]`
- `searchService`: `query(q)→{courses,instructors,blog}`, plus `popularSearches: string[]`

Types live in `@/types`. Read that file for exact shapes.

## Route → URL
Files under `src/app/app/<segment>/page.tsx` map to `/app/<segment>`. Use `"use client"`.
For dynamic routes use `[param]`. Read route params via `useParams()`/`useSearchParams()` from
`next/navigation` in client components.

## Example page skeleton
```tsx
"use client";
import { useAsync } from "@/hooks/useAsync";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { someService } from "@/services/some.service";

export default function Page() {
  const { data, loading, error, refetch } = useAsync(() => someService.list());
  return (
    <div>
      <PageHeader title="Title" description="Subtitle" />
      {loading ? <Skeleton className="h-64" />
        : error ? <ErrorState onRetry={refetch} />
        : !data?.length ? <EmptyState title="Nothing here yet" />
        : <Card>{/* render data */}</Card>}
    </div>
  );
}
```

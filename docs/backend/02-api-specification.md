# 2. API Specification

**Base URL:** `https://api.webhackacademy.com/v1`
**Format:** JSON. **Auth:** `Authorization: Bearer <access_token>` unless marked _public_.
**Spec source of truth:** OpenAPI 3.1 document generated from NestJS decorators (`/v1/openapi.json`, Swagger UI at `/v1/docs`). Frontend types are generated from it (`openapi-typescript`).

---

## 2.1 Conventions

### Pagination
List endpoints accept `?page=1&pageSize=20&sort=-created_at&q=term` and return:
```json
{ "items": [ /* ... */ ], "total": 132, "page": 1, "pageSize": 20 }
```
(Mirrors the frontend `Paginated<T>` type. Cursor pagination is used for high-volume feeds — messages, notifications, audit logs — via `?cursor=<opaque>&limit=`.)

### Standard success envelope
Single resources return the resource object directly. Mutations return the affected resource. `204 No Content` for pure deletes.

### Standard error envelope
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is already in use.",
    "details": [{ "field": "email", "message": "already_taken" }],
    "requestId": "req_01H...",
    "timestamp": "2026-07-22T10:00:00Z"
  }
}
```

| HTTP | code | when |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | body/query failed schema validation |
| 401 | `UNAUTHENTICATED` | missing/invalid/expired access token |
| 401 | `TOKEN_EXPIRED` | access token expired → client refreshes |
| 403 | `FORBIDDEN` | authenticated but lacks role/permission/ownership |
| 403 | `EMAIL_NOT_VERIFIED` / `ACCOUNT_LOCKED` | gated states |
| 404 | `NOT_FOUND` | resource missing or not visible to caller |
| 409 | `CONFLICT` | uniqueness / state conflict (e.g. already enrolled) |
| 422 | `UNPROCESSABLE` | semantically invalid (e.g. quiz already submitted) |
| 429 | `RATE_LIMITED` | see [Rate Limiting](./09-security-audit-ratelimit.md#rate-limiting); includes `Retry-After` |
| 500 | `INTERNAL` | unexpected; `requestId` for tracing |

### Idempotency
`POST` endpoints that create money movement or side effects accept `Idempotency-Key` header.

### Auth column legend
`P` public · `A` any authenticated user · `S` student · `I` instructor · `AD` admin · `own` resource-ownership check.

---

## 2.2 Auth & account — `/auth`

| Method | Path | Auth | Body → Response |
| --- | --- | --- | --- |
| POST | `/auth/register` | P | `{name,email,password}` → `{user, tokens}` (sends verification email) |
| POST | `/auth/login` | P | `{email,password,remember?}` → `{user, tokens}` or `{mfaRequired:true, mfaToken}` |
| POST | `/auth/refresh` | P (cookie/refresh) | `{refreshToken}` → `{tokens}` (rotates) |
| POST | `/auth/logout` | A | `{}` → `204` (revokes refresh family) |
| POST | `/auth/verify-email` | P | `{token}` → `204` |
| POST | `/auth/resend-verification` | A | `{}` → `202` |
| POST | `/auth/forgot-password` | P | `{email}` → `202` (always 202, no user enumeration) |
| POST | `/auth/reset-password` | P | `{token,password}` → `204` |
| POST | `/auth/change-password` | A | `{current,next}` → `204` |
| POST | `/auth/mfa/setup` | A | `{}` → `{secret, otpauthUrl, qrSvg}` |
| POST | `/auth/mfa/enable` | A | `{code}` → `{recoveryCodes}` |
| POST | `/auth/mfa/disable` | A | `{code}` → `204` |
| POST | `/auth/mfa/verify` | P (mfaToken) | `{mfaToken,code}` → `{user, tokens}` |
| GET | `/auth/me` | A | → `User` |

**`tokens`** shape: `{ accessToken, accessExpiresIn, refreshToken?, tokenType:"Bearer" }`. See [Auth & RBAC](./03-auth-and-rbac.md).

**Example — login (200):**
```json
{
  "user": { "id":"u_1","name":"Rahul Kaushik","email":"...","role":"student","avatar":"...","emailVerified":true },
  "tokens": { "accessToken":"eyJ...","accessExpiresIn":900,"tokenType":"Bearer" }
}
```

## 2.3 Sessions & security — `/security`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/security/sessions` | A/own | active devices |
| DELETE | `/security/sessions/:id` | A/own | revoke a device |
| DELETE | `/security/sessions` | A/own | revoke all except current |
| GET | `/security/login-history` | A/own | paginated |

## 2.4 Users & profile — `/users`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/users/me` | A | full profile + stats |
| PATCH | `/users/me` | A | `{name?,headline?,bio?,location?,skills?}` |
| PUT | `/users/me/avatar` | A | multipart or presigned confirm |
| GET | `/users/me/preferences` | A | notification/privacy prefs |
| PUT | `/users/me/preferences` | A | |
| GET | `/users/:id` | P | public profile (respects privacy setting) |
| GET | `/users/me/achievements` | A | `Achievement[]` |
| GET | `/users/me/statistics` | A | hours, streak, completion, certificates |

## 2.5 Catalog — `/courses`, `/categories`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/courses` | P | filters: `category,level,price,q,sort`, paginated |
| GET | `/courses/:slug` | P | full course + modules/lessons (locked lessons hide `mediaUrl`) |
| GET | `/courses/:id/reviews` | P | paginated |
| POST | `/courses/:id/reviews` | S/own-enrollment | `{rating,body}` |
| GET | `/categories` | P | tree |
| POST | `/courses` | I | create draft |
| PATCH | `/courses/:id` | I/own or AD | |
| POST | `/courses/:id/submit` | I/own | → in_review |
| POST | `/courses/:id/publish` | AD | moderation |
| DELETE | `/courses/:id` | I/own or AD | soft delete |
| POST | `/courses/:id/modules` | I/own | + `/modules/:id`, `/lessons` CRUD nested |

## 2.6 Enrollment & learning — `/enrollments`, `/learn`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/enrollments` | S | my enrollments (+ course summary + progress) |
| POST | `/enrollments` | S | `{courseId}` → enroll (free/subscription) or `409` if paid & unpaid |
| GET | `/learn/:courseId` | S/own | player payload: modules, lessons, my progress, resource URLs (signed) |
| POST | `/learn/:courseId/lessons/:lessonId/progress` | S/own | `{watchedSeconds,completed}` → updates `lesson_progress` + recomputes % |
| GET | `/enrollments/:courseId/progress` | S/own | completion %, last lesson |
| GET/POST/DELETE | `/bookmarks` | S | lesson bookmarks |
| GET/POST/PATCH/DELETE | `/notes` | S/own | lesson notes |
| GET/POST/DELETE | `/wishlist` | S | `{courseId}` |
| GET | `/downloads` | S | offline-available resources |

## 2.7 Quizzes — `/quizzes`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/quizzes` | S | available to me |
| GET | `/quizzes/:id` | S | questions **without** `correct` field |
| POST | `/quizzes/:id/attempts` | S | start attempt → `{attemptId, startedAt, endsAt}` |
| PATCH | `/quizzes/:id/attempts/:aid` | S/own | autosave answers `{answers}` |
| POST | `/quizzes/:id/attempts/:aid/submit` | S/own | `{answers}` → graded result + breakdown w/ explanations |
| GET | `/quizzes/:id/attempts` | S/own | attempt history |

**Submit response (200):**
```json
{ "attemptId":"qa_1","score":85,"passed":true,"takenAt":"...","breakdown":[
  {"questionId":"q1","correct":true,"pointsAwarded":10,"explanation":"..."} ] }
```

## 2.8 Assignments — `/assignments`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/assignments` | S | mine, filter by status |
| GET | `/assignments/:id` | S/own | detail + my submission |
| POST | `/assignments/:id/submissions` | S/own | `{attachments:[mediaId],comment}` |
| GET | `/instructor/submissions` | I | review queue |
| POST | `/instructor/submissions/:id/grade` | I/own-course | `{grade,feedback}` |

## 2.9 Certificates — `/certificates`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/certificates` | S | mine |
| GET | `/certificates/:id` | S/own | + signed PDF URL |
| GET | `/certificates/verify/:credentialId` | P | public verification |

## 2.10 Notifications & messaging

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/notifications` | A | cursor feed, `?unread=true` |
| POST | `/notifications/:id/read` | A/own | |
| POST | `/notifications/read-all` | A/own | |
| GET | `/conversations` | A | list + unread counts |
| POST | `/conversations` | A | `{participantId}` → find-or-create |
| GET | `/conversations/:id/messages` | A/own | cursor paginated |
| POST | `/conversations/:id/messages` | A/own | `{body,attachments?}` (also emits WS event) |
| POST | `/conversations/:id/read` | A/own | mark read |

Realtime: `WSS /v1/realtime` (see [Messaging](./05-notifications-and-messaging.md)).

## 2.11 Calendar — `/calendar`
`GET /calendar?from=&to=` → events (deadlines, live classes, quizzes, assignments) merged from multiple sources.

## 2.12 Search & analytics
`GET /search?q=&type=all|courses|instructors|blog` → grouped results (§19). `GET /search/suggestions?q=`, `GET /search/popular`.
`GET /analytics/me` (student), `GET /instructor/analytics`, `GET /admin/analytics` (§20).

## 2.13 Instructor — `/instructor`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/instructor/stats` | I | KPIs |
| GET | `/instructor/courses` | I/own | |
| GET | `/instructor/students` | I | enrolled across my courses |
| GET | `/instructor/earnings` | I | ledger + balance |
| POST | `/instructor/payouts` | I | request payout |
| GET/POST | `/instructor/announcements` | I | |

## 2.14 Admin — `/admin`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/admin/stats` | AD | dashboard KPIs, revenue, signups |
| GET | `/admin/users` | AD | filter `role,status,q`, paginated |
| POST | `/admin/users/invite` | AD | `{email,role}` |
| PATCH | `/admin/users/:id` | AD | status/role changes (audited) |
| GET | `/admin/courses` | AD | moderation queue |
| POST | `/admin/courses/:id/feature` | AD | |
| GET/POST/PATCH/DELETE | `/admin/categories` | AD | |
| GET | `/admin/reports` | AD | generate/download CSV (async job → link) |
| GET | `/admin/audit-logs` | AD | paginated, filterable |
| GET/PATCH | `/admin/roles` | AD | roles & permission matrix |
| GET/PATCH | `/admin/settings` | AD | platform settings, feature flags |

## 2.15 Payments & subscriptions — `/billing`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/billing/checkout` | S | `{items:[courseId] \| planId, couponCode?}` → `{checkoutUrl}` or `{clientSecret}` |
| GET | `/billing/orders` | A/own | order history |
| GET | `/billing/subscription` | A/own | current subscription |
| POST | `/billing/subscription/cancel` | A/own | `{atPeriodEnd:true}` |
| POST | `/billing/coupons/validate` | S | `{code}` |
| POST | `/webhooks/stripe` | P (signed) | Stripe events (idempotent) |

## 2.16 Media — `/media`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/media/uploads` | A | `{filename,mime,size,kind}` → `{uploadUrl (presigned), mediaId}` |
| POST | `/media/uploads/:id/complete` | A | finalize → enqueue processing |
| GET | `/media/:id` | A/authz | → signed, expiring URL (streaming for video) |

## 2.17 System
`GET /health` (liveness), `GET /ready` (readiness), `GET /v1/openapi.json`.

> **Coverage note:** Every screen in the frontend maps to endpoints above — e.g. the student dashboard composes `/users/me/statistics`, `/enrollments`, `/assignments?status=pending`, `/analytics/me`, `/users/me/achievements`; the course player uses `/learn/:courseId` + progress POSTs; admin/instructor dashboards use their `/stats` + list endpoints.

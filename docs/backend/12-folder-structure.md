# 21. Folder Structure

Modular monolith (NestJS) organized by **domain module**, split-ready into microservices later. One module per bounded context, mirroring the frontend service layer.

```text
webhack-academy-api/
├── src/
│   ├── main.ts                     # bootstrap (helmet, cors, versioning, swagger)
│   ├── app.module.ts
│   │
│   ├── common/                     # cross-cutting
│   │   ├── decorators/             # @CurrentUser, @RequirePermissions, @Public
│   │   ├── guards/                 # JwtAuthGuard, RolesGuard, PermissionsGuard, PolicyGuard
│   │   ├── interceptors/           # logging, audit, transform, timeout
│   │   ├── filters/                # global exception → error envelope
│   │   ├── pipes/                  # ZodValidationPipe / class-validator
│   │   ├── dto/                    # Paginated<T>, error DTOs
│   │   └── utils/
│   │
│   ├── config/                     # typed config (env schema, per-env)
│   │
│   ├── infra/                      # technical adapters
│   │   ├── prisma/                 # PrismaService, schema.prisma, migrations, seed
│   │   ├── redis/                  # cache + pubsub clients
│   │   ├── queue/                  # BullMQ setup, processors registry
│   │   ├── storage/                # S3 client, presign, signed URLs
│   │   ├── search/                 # Meilisearch/OpenSearch client
│   │   ├── mail/                   # email provider adapter + templates
│   │   ├── payments/               # Stripe adapter + webhook verifier
│   │   └── realtime/               # WebSocket gateway + Redis adapter
│   │
│   ├── modules/                    # DOMAIN MODULES (bounded contexts)
│   │   ├── auth/                   # login, tokens, mfa, sessions, guards wiring
│   │   ├── users/                  # profile, preferences, achievements, statistics
│   │   ├── rbac/                   # roles, permissions, policies
│   │   ├── catalog/                # courses, modules, lessons, categories, tags, reviews
│   │   ├── enrollment/             # enrollments, lesson_progress, bookmarks, notes, wishlist
│   │   ├── quiz/                   # quizzes, questions, attempts, grading engine
│   │   ├── assignment/             # assignments, submissions, grading
│   │   ├── certificate/            # generation, verification
│   │   ├── notification/           # events → channels, preferences
│   │   ├── messaging/              # conversations, messages, realtime
│   │   ├── calendar/               # events aggregation
│   │   ├── instructor/             # instructor dashboards, earnings, announcements
│   │   ├── admin/                  # user/course/category mgmt, reports, audit view
│   │   ├── billing/                # orders, payments, subscriptions, coupons, payouts
│   │   ├── media/                  # uploads, processing orchestration
│   │   ├── search/                 # query API + indexers
│   │   ├── analytics/              # rollups + dashboard endpoints
│   │   └── audit/                  # audit log write + query
│   │
│   ├── jobs/                       # queue processors (transcode, certs, emails, rollups…)
│   ├── events/                     # domain events + outbox relay
│   └── health/                     # /health, /ready
│
├── prisma/schema.prisma            # DB schema (§1) — single source
├── test/                           # e2e + integration
├── openapi/                        # generated spec artifacts
├── docker/                         # Dockerfile, compose (pg, redis, minio, meili)
├── .env.example
└── package.json
```

**Each module** contains: `*.controller.ts` (HTTP), `*.service.ts` (business logic), `*.repository.ts` (Prisma access), `dto/` (validated request/response), `entities/`, `policies/`, `*.events.ts`, and `*.spec.ts` tests. Controllers are thin; services own logic; repositories isolate persistence (swap-friendly).

**Boundaries:** modules communicate via the event bus / service interfaces, not by reaching into each other's repositories — so a module (e.g. `media`, `search`, `notification`) can later be extracted into its own service with minimal change.

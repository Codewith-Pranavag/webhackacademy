# 22. Recommended Backend Tech Stack

**Guiding choice:** TypeScript end-to-end so DTOs, validation, and types are shared with the Next.js frontend, minimizing integration friction.

| Concern | Recommendation | Why |
| --- | --- | --- |
| **Language** | TypeScript (Node 20 LTS) | shared types with frontend; large talent pool |
| **Framework** | **NestJS** | opinionated modules, DI, guards/interceptors map cleanly to RBAC & cross-cutting concerns; first-class OpenAPI |
| **API style** | REST (OpenAPI 3.1) + WebSockets for realtime | matches the frontend's REST-shaped service layer; GraphQL optional later |
| **Database** | **PostgreSQL 16** | relational integrity for a rich domain; JSONB where flexible; strong ecosystem |
| **ORM** | **Prisma** | type-safe client, migrations, great DX; `schema.prisma` is the schema source |
| **Cache / ephemeral** | **Redis 7** | app cache, rate limits, sessions, pub/sub, queue backing |
| **Queue / jobs** | **BullMQ** (Redis) | reliable retries, scheduling, dashboards |
| **Object storage** | **S3** (AWS) / **R2** (Cloudflare); MinIO locally | presigned uploads, lifecycle, CDN integration |
| **CDN** | CloudFront / Cloudflare | asset + signed media delivery |
| **Video transcoding** | AWS MediaConvert / `ffmpeg` workers | HLS ladder, captions |
| **Search** | **Meilisearch** (→ OpenSearch at scale) | typo-tolerant, fast, simple ops |
| **Payments** | **Stripe** (Checkout, Billing, Connect) | PCI offload, subscriptions, payouts |
| **Email** | Postmark / AWS SES | transactional + digests |
| **Push** | Web Push (VAPID) / FCM | notifications |
| **Realtime** | Socket.IO / native WS + Redis adapter | messaging, presence, live counts |
| **Auth** | Custom JWT (RS256) + refresh rotation; Passport strategies for OAuth | full control; no vendor lock; matches §3 |
| **Validation** | class-validator/class-transformer (or Zod bridge) | shares intent with frontend Zod schemas |
| **Config/secrets** | AWS Secrets Manager / Vault; typed env loader | no secrets in repo |
| **Observability** | OpenTelemetry traces, Prometheus/Grafana metrics, Sentry errors, structured logs (pino) | request-id correlation |
| **Testing** | Jest (unit), Supertest (e2e), Testcontainers (real PG/Redis) | confidence on guards & flows |
| **CI/CD** | GitHub Actions → Docker images → registry | lint, typecheck, test, migrate, deploy |
| **Containers/orchestration** | Docker; **ECS Fargate** or **Kubernetes** | stateless API + separate workers |
| **IaC** | Terraform | reproducible infra |

**Alternatives considered:**
- *Django/DRF or Laravel* — excellent, but loses shared-TypeScript synergy with the frontend.
- *Go (Fiber/Echo)* — great performance/cost; heavier for this domain's rapid feature velocity. A good target for extracting hot microservices (media, realtime) later.
- *GraphQL* — viable; deferred because the frontend is already REST-shaped and REST caches more simply at the edge.
- *tRPC* — tempting for a TS monorepo, but REST/OpenAPI keeps the API client-agnostic (future mobile/partners).

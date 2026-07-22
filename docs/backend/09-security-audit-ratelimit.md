# 13, 14 & 15. Audit Logging, Security Architecture, Rate Limiting

## Audit Logging

Backs the admin **Audit Logs** UI and provides a tamper-evident record for compliance.

- **What's logged:** authentication events (login success/failure, MFA, password change), authorization denials, all admin actions (user suspend, role change, course publish/feature, settings change), money movement, data exports, and destructive operations.
- **Schema:** `audit_logs(actor_id, action, entity_type, entity_id, ip, user_agent, metadata jsonb, at)` — append-only.
- **How it's written:** a cross-cutting interceptor + explicit `audit.record(...)` calls in sensitive services, written via the transactional outbox so the log can't silently diverge from the action.
- **Integrity:** append-only (no UPDATE/DELETE grants for the app role); optional hash-chain (`prev_hash`) for tamper evidence; shipped to immutable cold storage (e.g. S3 Object Lock) on a schedule.
- **Retention:** hot 90 days in Postgres, archived ≥ 1–7 years per policy.
- **Access:** `GET /admin/audit-logs` (admin), filterable by actor/action/entity/date, cursor-paginated. Never editable via API.

## Security Architecture

Defense in depth — maps to the frontend's security-oriented screens.

### Transport & headers
- TLS 1.2+ everywhere; HSTS.
- Security headers: `Content-Security-Policy` (strict, nonce-based), `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- CORS allow-list (web origins only); credentials limited to the auth cookie path.

### Application
- **Input validation** on every endpoint (class-validator DTOs; reject unknown fields). SQL injection avoided via parameterized ORM queries.
- **Output encoding / XSS:** React escapes by default; user-generated HTML (notes, discussions) sanitized (DOMPurify server-side) before storage/render.
- **AuthZ:** RBAC + ownership + field-level serialization (§3).
- **Secrets:** in a secrets manager (AWS Secrets Manager / Vault), never in env files in the repo; rotated.
- **PII:** encrypted at rest (DB-level + column encryption for 2FA secrets, tokens hashed); logs scrub PII; GDPR export/delete endpoints.
- **CSRF:** double-submit token on cookie-based refresh; state-changing APIs require bearer token (not cookie) so are CSRF-immune.
- **Account protection:** Argon2id hashing, brute-force lockout, MFA, new-device email + `login_history`, session revocation, reuse-detection on refresh tokens (§3).
- **CAPTCHA:** challenge (hCaptcha/Turnstile) on register, repeated failed logins, password reset — the frontend has the placeholder slots.
- **File security:** malware scan, mime allow-lists, signed private URLs, no public buckets for user content (§4).
- **Dependency & supply chain:** `npm audit`/Snyk in CI, lockfile integrity, Dependabot.
- **Webhooks:** signature verification + idempotency (§11).

### Monitoring
- Centralized structured logs (request id correlation), error tracking (Sentry), anomaly alerts (spikes in 401/403/429), security alerts to users (new device, password change) via the notification pipeline.

### Threat model highlights
| Threat | Mitigation |
| --- | --- |
| Token theft | short access TTL, httpOnly refresh, rotation + reuse detection |
| Broken access control | central guards, ownership policies, deny-by-default, tests |
| Quiz answer leakage | `correct` stripped server-side; grading server-only |
| Video piracy | signed short-lived HLS URLs, playback tokens, optional DRM |
| Payment tampering | server-computed prices, webhook source-of-truth, idempotency |
| Enumeration | uniform responses on auth (`202` always for forgot-password) |

## Rate Limiting

- **Where:** at the edge/gateway (coarse, per-IP) **and** in-app (fine, per-user/per-route) using a Redis token-bucket / sliding-window.
- **Tiers:**
  | Bucket | Limit (example) |
  | --- | --- |
  | Global per IP | 1000 req / 5 min |
  | Auth endpoints (`/auth/login`, `/auth/*`) | 10 / min per IP + per account, backoff |
  | Password reset / verification | 5 / hour per account |
  | Mutations (per user) | 120 / min |
  | Search | 30 / min per user |
  | Messaging sends | 20 / min per user |
  | Media uploads | quota + N / hour |
- **Response:** `429 RATE_LIMITED` with `Retry-After` and `X-RateLimit-{Limit,Remaining,Reset}` headers.
- **Abuse handling:** progressive penalties, temporary IP bans for egregious abuse, allow-lists for trusted partners; distinct stricter limits for unauthenticated traffic.

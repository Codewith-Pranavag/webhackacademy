# Flow Diagrams

Sequence diagrams for the core WebHack Academy flows, grounded in the auth (§3),
storage (§4), payments (§11), and jobs (§18) designs. Participants: **C** client,
**API** NestJS API, **DB** PostgreSQL, **R** Redis, **S3** object storage/CDN,
**Q** job queue, **Stripe**, **Mail** email provider.

## 1. Login

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant API
  participant DB
  participant R as Redis
  C->>API: POST /auth/login {email, password}
  API->>R: check rate limit / lockout
  API->>DB: find user by email
  API->>API: verify Argon2id hash
  alt invalid credentials
    API->>DB: record failed login_history
    API-->>C: 401 UNAUTHENTICATED
  else account locked
    API-->>C: 403 ACCOUNT_LOCKED
  else 2FA enabled
    API-->>C: 200 {mfaRequired:true, mfaToken}
    C->>API: POST /auth/mfa/verify {mfaToken, code}
    API->>API: verify TOTP
    API->>DB: create refresh token + auth_session, log success
    API-->>C: 200 {user, tokens} + Set-Cookie refresh (httpOnly)
  else success
    API->>DB: create refresh token + auth_session, log success
    API-->>C: 200 {user, tokens} + Set-Cookie refresh (httpOnly)
  end
```

## 2. Signup

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant API
  participant DB
  participant Q as Queue
  participant Mail
  C->>API: POST /auth/register {name, email, password}
  API->>API: validate DTO (password policy)
  API->>DB: SELECT user by email
  alt email exists
    API-->>C: 409 CONFLICT
  else new
    API->>API: hash password (Argon2id)
    API->>DB: INSERT user (status=active, email_verified=null) + assign 'student' role
    API->>DB: INSERT email_verification (token hash)
    API->>Q: enqueue email.send (verification)
    Q->>Mail: send verification email
    API->>DB: create refresh token + session
    API-->>C: 201 {user, tokens} + Set-Cookie refresh
    Note over C,API: User is signed in but emailVerified=false
    C->>API: POST /auth/verify-email {token}
    API->>DB: validate token, set email_verified_at, mark used
    API-->>C: 204
  end
```

## 3. Purchase Course

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant API
  participant DB
  participant Stripe
  C->>API: POST /billing/checkout {items:[courseId], couponCode?}
  API->>DB: load course price, validate coupon
  API->>API: compute total (server-side, never trust client)
  API->>DB: INSERT order (status=pending) + order_items
  API->>Stripe: create Checkout Session (Idempotency-Key)
  Stripe-->>API: session {url}
  API-->>C: 200 {checkoutUrl}
  C->>Stripe: redirect + pay (card handled by Stripe)
  Note over Stripe,API: Fulfillment happens via webhook — see flow 10
  Stripe-->>C: redirect back to /app (success page)
  C->>API: GET /enrollments (poll)
  API-->>C: enrollment present once webhook processed
```

## 4. Enroll Course (free / subscription)

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant API
  participant DB
  C->>API: POST /enrollments {courseId}
  API->>DB: load course (price, status)
  alt already enrolled
    API-->>C: 409 CONFLICT
  else paid course & no entitlement
    API->>DB: check active subscription
    alt has subscription
      API->>DB: INSERT enrollment (source=subscription)
      API-->>C: 201 Enrollment
    else no entitlement
      API-->>C: 402 PAYMENT_REQUIRED (go to checkout → flow 3)
    end
  else free course
    API->>DB: INSERT enrollment (source=free, status=in_progress)
    API-->>C: 201 Enrollment
  end
```

## 5. Watch Video

```mermaid
sequenceDiagram
  autonumber
  participant C as Client (player)
  participant API
  participant DB
  participant CDN as CDN / S3
  C->>API: GET /media/{lessonMediaId}
  API->>DB: authorize (enrolled? preview? role)
  alt not entitled
    API-->>C: 403 FORBIDDEN
  else entitled
    API->>API: mint short-lived playback token (user+session bound)
    API-->>C: 200 {signed HLS url, expiresAt}
    C->>CDN: GET .m3u8 + segments (signed)
    CDN-->>C: video stream
    loop every ~20s / on pause / on end
      C->>API: POST /learn/{courseId}/lessons/{lessonId}/progress {watchedSeconds, completed}
      API->>DB: upsert lesson_progress; recompute enrollment.progress_pct; set last_lesson
      API-->>C: 200 {progressPct, status}
    end
    Note over API,DB: If progress hits 100% → emit EnrollmentCompleted (flow 8)
  end
```

## 6. Submit Quiz

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant API
  participant DB
  C->>API: POST /quizzes/{id}/attempts
  API->>DB: enforce max_attempts; INSERT attempt (started_at, ends_at)
  API-->>C: 201 {attemptId, endsAt}
  loop while answering
    C->>API: PATCH /attempts/{aid} {answers}  (autosave)
    API->>DB: persist partial answers
  end
  C->>API: POST /attempts/{aid}/submit {answers}
  API->>API: check now <= ends_at (+grace); grade server-side per question type
  API->>DB: INSERT quiz_answers; UPDATE attempt {score, passed, submitted_at}
  API->>API: emit QuizSubmitted (analytics, achievements)
  API-->>C: 200 {score, passed, breakdown[with explanations]}
```

## 7. Submit Assignment

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant API
  participant S3
  participant Q as Queue
  participant DB
  Note over C,S3: Files upload directly via presigned URLs (§4)
  C->>API: POST /media/uploads {filename, mime, size, kind}
  API-->>C: {mediaId, uploadUrl}
  C->>S3: PUT file
  C->>API: POST /media/uploads/{id}/complete
  API->>Q: enqueue malware scan
  C->>API: POST /assignments/{id}/submissions {attachments:[mediaId], comment}
  API->>DB: validate ownership + media ready; UPSERT submission (status=submitted, submitted_at)
  API->>API: emit AssignmentSubmitted (notify instructor)
  API-->>C: 201 Assignment (status=submitted)
```

## 8. Generate Certificate

```mermaid
sequenceDiagram
  autonumber
  participant API
  participant DB
  participant Q as Queue
  participant W as Cert Worker
  participant S3
  participant Mail
  Note over API: Triggered by EnrollmentCompleted (100% + required quizzes passed)
  API->>DB: check certificate exists for (user, course)?
  alt already issued
    API-->>API: skip (idempotent)
  else new
    API->>Q: enqueue certificate.generate {userId, courseId}
    Q->>W: process job
    W->>W: render PDF (name, course, grade, credentialId, QR)
    W->>W: compute verification_hash (HMAC)
    W->>S3: upload PDF (private bucket)
    W->>DB: INSERT certificate {credentialId, pdf_media_id, hash}
    W->>Mail: email "Certificate ready"
    W->>DB: INSERT notification (achievement)
  end
```

Public verification later:
```mermaid
sequenceDiagram
  participant V as Anyone
  participant API
  participant DB
  V->>API: GET /certificates/verify/{credentialId}
  API->>DB: lookup + recompute/verify hash
  API-->>V: 200 {valid, learnerName, courseTitle, issuedAt, grade}
```

## 9. Forgot Password

```mermaid
sequenceDiagram
  autonumber
  participant C as Client
  participant API
  participant DB
  participant Q as Queue
  participant Mail
  C->>API: POST /auth/forgot-password {email}
  API->>DB: find user (do NOT reveal existence)
  opt user exists
    API->>DB: INSERT password_reset (token hash, expiry, single-use)
    API->>Q: enqueue email.send (reset link)
    Q->>Mail: send reset email
  end
  API-->>C: 202 Accepted (always — no user enumeration)
  C->>API: POST /auth/reset-password {token, password}
  API->>DB: validate token (unused, unexpired); update password_hash; mark used
  API->>DB: revoke all refresh token families (force re-login)
  API-->>C: 204 No Content
```

## 10. Payment Webhook

```mermaid
sequenceDiagram
  autonumber
  participant Stripe
  participant API as API (/webhooks/stripe)
  participant DB
  participant Q as Queue
  Stripe->>API: POST event (checkout.session.completed) [signed]
  API->>API: verify Stripe signature
  alt invalid signature
    API-->>Stripe: 400 (reject)
  else valid
    API->>DB: INSERT webhook_events(event_id) — UNIQUE
    alt duplicate event_id
      API-->>Stripe: 200 (idempotent no-op)
    else first time
      API->>DB: mark order paid; INSERT payment
      API->>DB: INSERT enrollment(s) (source=purchase)
      API->>DB: INSERT instructor_earnings ledger (gross/fee/net)
      API->>Q: enqueue receipt email + PaymentSucceeded notification
      API->>DB: mark webhook_events.processed_at
      API-->>Stripe: 200 OK
    end
  end
```

> Reliability: the webhook is the **source of truth** for fulfilment (not the browser
> redirect). `webhook_events.event_id` guarantees exactly-once processing; a nightly
> reconciliation job compares Stripe charges against `payments` to catch any missed events.

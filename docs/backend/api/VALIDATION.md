# Validation Rules

Field-level rules enforced by the global `ValidationPipe` + `class-validator` DTOs
(`../dtos/`) and reflected in `openapi.yaml`. Unknown properties are rejected
(`forbidNonWhitelisted`); types are coerced (`transform`).

## Global conventions
- **Trimming:** string inputs are trimmed; empty-after-trim fails `@IsNotEmpty`.
- **Unknown fields:** `400 VALIDATION_ERROR` with `details[]`.
- **IDs:** path/body ids are `@IsUUID('4')`.
- **Pagination:** `page ≥ 1` (default 1), `1 ≤ pageSize ≤ 100` (default 20), `q ≤ 120` chars.
- **Money:** integers in minor units (cents), `≥ 0`.
- **Dates:** ISO-8601 (`date-time`).
- **Enums:** rejected if not in the allowed set.

## Password policy (register / reset / change)
- 8–128 characters, **≥ 1 letter and ≥ 1 number** (`^(?=.*[A-Za-z])(?=.*\d).{8,128}$`).
- Client shows a strength meter; server is authoritative.
- Additional server checks (not in the regex): reject known-breached passwords (HaveIBeenPwned k-anonymity), and disallow reusing the current password on change.

## Per-endpoint rules

### Auth
| Field | Rule |
| --- | --- |
| `name` | string, 2–80 |
| `email` | valid email, ≤ 160, unique (register) |
| `password` | password policy |
| `remember` | boolean (optional) |
| `token` (verify/reset) | non-empty; server checks validity + expiry + single-use |
| `code` (MFA/OTP) | exactly 6 digits `^[0-9]{6}$` |

### Profile / preferences
| Field | Rule |
| --- | --- |
| `name` | 2–80 |
| `headline` | ≤ 120 |
| `bio` | ≤ 1000 |
| `location` | ≤ 120 |
| `skills` | array ≤ 30 items, each ≤ 40 chars |
| `profileVisibility` | one of `public \| students \| private` |

### Catalog
| Field | Rule |
| --- | --- |
| `title` | 5–120 |
| `subtitle` | ≤ 160 |
| `level` | `beginner \| intermediate \| advanced` |
| `priceCents` | integer ≥ 0 |
| `rating` (review) | integer 1–5 |
| `body` (review) | ≤ 2000 |
| list `level`/`category` | enum / known category |

### Learning
| Field | Rule |
| --- | --- |
| `courseId` | uuid; must reference an existing, published course; not already enrolled (else 409) |
| `watchedSeconds` | integer ≥ 0 |
| `completed` | boolean |

### Quizzes
| Field | Rule |
| --- | --- |
| `answers` | object keyed by questionId; value `int[]` (single/multi/boolean) or string (fill/code). **Deep-validated in the service** against the quiz: unknown questionIds rejected, option indices in range, one in-flight attempt, submission within `endsAt` grace window. |

### Assignments
| Field | Rule |
| --- | --- |
| `attachments` | 1–20 uuids referencing the caller's `ready` media assets |
| `comment` | ≤ 1000 |
| `grade` | integer 0–`assignment.points` (capped server-side) |
| `feedback` | ≤ 2000 |

### Messaging
| Field | Rule |
| --- | --- |
| `body` | 1–4000 |
| `attachments` | ≤ 10 uuids |
| `participantId` | uuid; authorization: allowed to message this user (instructor↔enrolled student) |

### Billing
| Field | Rule |
| --- | --- |
| `items` | required when no `planId`; ≤ 50 uuids |
| `planId` | required when no `items` |
| `couponCode` | ≤ 40; validity, expiry, redemption limit checked server-side |
| `atPeriodEnd` | boolean |

### Media
| Field | Rule |
| --- | --- |
| `filename` | ≤ 255 |
| `mime` | valid MIME; **allow-list per `kind`** (e.g. video → `video/mp4,video/webm`) |
| `size` | 1 byte–5 GB hard cap; **per-kind caps** (image ≤ 10 MB, pdf ≤ 25 MB, video ≤ 5 GB) + per-user quota |
| `kind` | `video \| image \| pdf \| archive \| doc` |

## Beyond schema validation (business rules in services)
Schema/DTO validation is the first gate. These deeper rules run in the service layer
because they need DB state or cross-field logic:
- **Ownership/authorization** (edit own course, grade own-course submissions).
- **State machines** (can't submit a graded assignment; can't re-enroll; subscription status gates access).
- **Referential existence** (category exists, media belongs to caller and is `ready`).
- **Rate/quota** (upload quota, message frequency) — see `../09-security-audit-ratelimit.md`.
- **Idempotency** (checkout, webhooks).

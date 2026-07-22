# DTOs (reference)

TypeScript **request DTOs** for the future NestJS backend, using `class-validator`
(runtime validation) + `@nestjs/swagger` (`@ApiProperty` → OpenAPI schema). They are
the executable form of the validation rules in [`../api/VALIDATION.md`](../api/VALIDATION.md).

## Status & build isolation
- **Design-stage reference code.** They import `@nestjs/swagger`, `class-validator`,
  and `class-transformer`, which are **backend** dependencies not installed in this
  frontend project.
- They live under `docs/`, which is **excluded from the frontend build**
  (`tsconfig.json` → `"exclude": ["docs"]`), so they never affect `next build` /
  `tsc`. When the backend repo is scaffolded, copy these into `src/**/dto/` and add
  the three packages.

## How they're used (backend)
```ts
// controller
@Post("register")
register(@Body() dto: RegisterDto) { /* dto is already validated + typed */ }
```
A global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`
(see [`../api/nest-swagger-setup.ts`](../api/nest-swagger-setup.ts)) enforces every rule
and strips unknown fields, returning the standard `ErrorDto` envelope on failure.

## Files
| File | DTOs |
| --- | --- |
| `common.dto.ts` | `PaginationQueryDto`, `PaginatedDto<T>`, `ErrorDto` |
| `auth.dto.ts` | Register, Login, ForgotPassword, ResetPassword, ChangePassword, VerifyEmail, MfaVerify |
| `user.dto.ts` | UpdateProfile, UpdatePreferences |
| `catalog.dto.ts` | ListCoursesQuery, CreateCourse, CreateReview |
| `learning.dto.ts` | Enroll, LessonProgress |
| `quiz.dto.ts` | SubmitQuiz, AutosaveQuiz |
| `assignment.dto.ts` | SubmitAssignment, GradeSubmission |
| `messaging.dto.ts` | SendMessage, CreateConversation |
| `billing.dto.ts` | Checkout, CancelSubscription, ValidateCoupon |
| `media.dto.ts` | CreateUpload |

Response shapes are defined in [`../api/openapi.yaml`](../api/openapi.yaml) under
`components.schemas` (frontend types are generated from there).

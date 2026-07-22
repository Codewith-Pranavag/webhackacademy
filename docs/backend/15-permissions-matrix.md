# Permissions Matrix (RBAC)

Three roles: **Student · Instructor · Admin**. Enforced server-side by
`PermissionsGuard` (`@RequirePermissions(...)`) + ownership checks
(see [03-auth-and-rbac.md](./03-auth-and-rbac.md)). The frontend role-based nav is
presentation only.

**Legend:** ✅ allowed · ❌ denied · 🟡 own resources only

- **Student** — learner (default role on signup).
- **Instructor** — creates & teaches courses; everything a student can do, plus their own courses/content.
- **Admin** — full platform control (user management, moderation, publishing, billing, settings).

## Matrix

| Resource / action | Permission key | Student | Instructor | Admin |
| --- | --- | :---: | :---: | :---: |
| **Account** | | | | |
| Manage own profile & password | `profile.*`, `auth.password.change` | ✅ | ✅ | ✅ |
| Manage own 2FA & sessions | `auth.mfa.manage`, `session.revoke` | ✅ | ✅ | ✅ |
| **Courses** | | | | |
| Browse / view published courses | `course.view` | ✅ | ✅ | ✅ |
| **Create course** | `course.create` | ❌ | ✅ | ✅ |
| Edit course | `course.edit` | ❌ | 🟡 | ✅ |
| **Publish course** | `course.publish` | ❌ | ✅ | ✅ |
| Unpublish / archive course | `course.unpublish` | ❌ | 🟡 | ✅ |
| Delete course | `course.delete` | ❌ | 🟡 | ✅ |
| Feature course / manage categories | `course.feature`, `category.manage` | ❌ | ❌ | ✅ |
| **Learning** | | | | |
| Enroll & track progress | `course.enroll`, `lesson.progress` | ✅ | ✅ | ✅ |
| Notes / bookmarks / wishlist | `note.manage`, etc. | ✅ | ✅ | ✅ |
| **Assessment** | | | | |
| Take a quiz | `quiz.attempt` | ✅ | ✅ | ✅ |
| Create/edit quizzes & see answers | `quiz.manage`, `quiz.answers.view` | ❌ | 🟡 | ✅ |
| Submit an assignment | `assignment.submit` | ✅ | ❌ | ✅ |
| Create/edit assignments & grade | `assignment.manage`, `submission.grade` | ❌ | 🟡 | ✅ |
| **Engagement** | | | | |
| Earn / verify certificates | `certificate.earn`, `certificate.verify` | ✅ | ✅ | ✅ |
| Revoke a certificate | `certificate.revoke` | ❌ | ❌ | ✅ |
| Write a course review | `review.write` | 🟡 | ✅ | ✅ |
| Remove reviews / moderate content | `review.remove`, `content.moderate` | ❌ | ❌ | ✅ |
| Send messages | `message.send` | ✅ | ✅ | ✅ |
| Post course announcements | `announcement.post` | ❌ | 🟡 | ✅ |
| **Users & admin** | | | | |
| View users | `user.list` | ❌ | ❌ | ✅ |
| Invite / suspend users | `user.invite`, `user.suspend` | ❌ | ❌ | ✅ |
| **Delete user** | `user.delete` | ❌ | ❌ | ✅ |
| Assign roles | `user.role.assign` | ❌ | ❌ | ✅ |
| Reports & audit logs | `report.generate`, `audit.view` | ❌ | ❌ | ✅ |
| **Billing** | | | | |
| Purchase course / subscribe | `billing.purchase`, `order.view` | ✅ | ✅ | ✅ |
| View earnings / request payout | `earnings.view`, `payout.request` | ❌ | 🟡 | ✅ |
| Refunds / process payouts | `billing.refund`, `payout.process` | ❌ | ❌ | ✅ |
| **Analytics & platform** | | | | |
| Own learning analytics | `analytics.self` | ✅ | ✅ | ✅ |
| Instructor analytics | `analytics.instructor` | ❌ | 🟡 | ✅ |
| Platform analytics | `analytics.platform` | ❌ | ❌ | ✅ |
| Roles, settings, feature flags | `role.manage`, `settings.manage` | ❌ | ❌ | ✅ |

## The three examples
| Resource | Student | Instructor | Admin |
| --- | :---: | :---: | :---: |
| **Create Course** | ❌ | ✅ | ✅ |
| **Delete User** | ❌ | ❌ | ✅ |
| **Publish Course** | ❌ | ✅ | ✅ |

> 🟡 notes: an instructor acts only on **their own** courses/quizzes/assignments/earnings;
> a student can review only courses they're **enrolled** in.

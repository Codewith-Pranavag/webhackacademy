/**
 * Soft-delete strategy (Prisma Client Extension).
 *
 * Prisma has no built-in soft delete. Models that carry `deletedAt DateTime?`
 * (User, Course, DiscussionComment) are soft-deleted by:
 *   1. Rewriting `delete`/`deleteMany` into an `update` that sets `deletedAt = now()`.
 *   2. Auto-filtering `deletedAt = null` on `find*`/`count` queries.
 *
 * Use `prisma.$hardDelete(...)` semantics (a raw delete) only for GDPR erasure
 * or GC jobs. Design-stage reference; requires @prisma/client.
 */
import { Prisma, PrismaClient } from "@prisma/client";

const SOFT_DELETE_MODELS = new Set<string>(["User", "Course", "DiscussionComment"]);

export function withSoftDelete(base: PrismaClient) {
  return base.$extends({
    name: "soft-delete",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model || !SOFT_DELETE_MODELS.has(model)) return query(args);

          // Turn deletes into updates that stamp deletedAt.
          if (operation === "delete") {
            return (base as never as Record<string, { update: Function }>)[
              lower(model)
            ].update({ ...(args as object), data: { deletedAt: new Date() } });
          }
          if (operation === "deleteMany") {
            return (base as never as Record<string, { updateMany: Function }>)[
              lower(model)
            ].updateMany({ ...(args as object), data: { deletedAt: new Date() } });
          }

          // Exclude soft-deleted rows from reads by default.
          if (
            ["findFirst", "findMany", "findFirstOrThrow", "count", "aggregate"].includes(
              operation,
            )
          ) {
            const a = (args ?? {}) as { where?: Record<string, unknown> };
            a.where = { deletedAt: null, ...(a.where ?? {}) };
            return query(a as typeof args);
          }

          return query(args);
        },
      },
    },
  });
}

function lower(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// Usage:
//   export const prisma = withSoftDelete(new PrismaClient());
export type ExtendedPrisma = ReturnType<typeof withSoftDelete>;
void Prisma; // keep the import for @prisma/client type augmentation

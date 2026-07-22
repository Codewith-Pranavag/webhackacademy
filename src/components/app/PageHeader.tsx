import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink lg:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1 text-body">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 gap-3">{action}</div>}
    </div>
  );
}

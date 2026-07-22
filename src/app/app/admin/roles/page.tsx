"use client";

import { useState } from "react";
import { ShieldCheck, Check } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/store/toast";
import { cn } from "@/lib/utils";

const roles = [
  { key: "admin", name: "Admin", members: 280, tone: "violet" as const },
  { key: "instructor", name: "Instructor", members: 3810, tone: "sky" as const },
  { key: "student", name: "Student", members: 44120, tone: "green" as const },
  { key: "support", name: "Support", members: 42, tone: "amber" as const },
];

const permissions = [
  "Manage users",
  "Publish courses",
  "Edit any course",
  "View analytics",
  "Process payouts",
  "Moderate content",
  "Manage categories",
  "Access audit logs",
];

// role -> set of granted permission indices
const initialMatrix: Record<string, boolean[]> = {
  admin: permissions.map(() => true),
  instructor: [false, true, false, true, false, true, false, false],
  student: [false, false, false, false, false, false, false, false],
  support: [false, false, false, true, false, true, false, true],
};

export default function RolesPage() {
  const [matrix, setMatrix] = useState(initialMatrix);

  const toggle = (role: string, i: number) => {
    setMatrix((m) => {
      const row = [...m[role]];
      row[i] = !row[i];
      return { ...m, [role]: row };
    });
    toast.info("Permission updated", `${permissions[i]} for ${role}`);
  };

  return (
    <div>
      <PageHeader title="Roles & Permissions" description="Control what each role can do across the platform." />

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {roles.map((r) => (
          <Card key={r.key} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">{r.name}</p>
              <p className="text-sm text-muted">{r.members.toLocaleString()} members</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-deep">
              <ShieldCheck className="h-5 w-5" />
            </span>
          </Card>
        ))}
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-soft/60 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5 font-medium">Permission</th>
                {roles.map((r) => (
                  <th key={r.key} className="px-5 py-3.5 text-center font-medium">
                    <Badge tone={r.tone}>{r.name}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, i) => (
                <tr key={perm} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5 font-medium text-ink">{perm}</td>
                  {roles.map((r) => {
                    const on = matrix[r.key][i];
                    return (
                      <td key={r.key} className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => toggle(r.key, i)}
                          aria-pressed={on}
                          aria-label={`${perm} for ${r.name}`}
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-md border transition-colors",
                            on
                              ? "border-violet-deep bg-violet-deep text-white"
                              : "border-line bg-surface hover:border-violet",
                          )}
                        >
                          {on && <Check className="h-4 w-4" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

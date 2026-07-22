"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toast";
import type { Role } from "@/types";

const ROLES: { id: Role; label: string }[] = [
  { id: "student", label: "Student" },
  { id: "instructor", label: "Instructor" },
  { id: "admin", label: "Admin" },
];

const inputClass =
  "w-full rounded-[var(--radius)] border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-violet";

export function InviteUserDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setError("Enter a valid email address");
      return;
    }
    toast.success("Invitation sent", `${email} was invited as ${role}.`);
    setEmail("");
    setRole("student");
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Invite user"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit}>
            Send invite
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Email address</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="person@example.com"
            className={inputClass}
          />
          {error && <span className="text-xs font-medium text-orange">{error}</span>}
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Role</span>
          <div className="flex gap-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex-1 rounded-pill border px-3 py-2 text-sm font-medium transition-colors ${
                  role === r.id
                    ? "border-violet bg-violet-50 text-violet-deep"
                    : "border-line text-muted hover:text-ink"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

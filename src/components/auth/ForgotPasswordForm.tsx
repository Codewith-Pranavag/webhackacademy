"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { AuthField, authInputClass } from "./AuthField";
import { authService } from "@/services/auth.service";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-green-soft p-8 text-center">
        <MailCheck className="h-10 w-10 text-green" />
        <p className="font-semibold text-ink">Check your inbox</p>
        <p className="text-sm text-body">
          If an account exists for that address, we&apos;ve sent a reset link.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async ({ email }) => {
        // Backend always responds 202 — never reveals whether the account exists.
        await authService.requestPasswordReset(email);
        setDone(true);
      })}
      className="flex flex-col gap-5"
      noValidate
    >
      <AuthField id="email" label="Email address" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={authInputClass}
          {...register("email")}
        />
      </AuthField>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-pill bg-violet-deep font-medium text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}

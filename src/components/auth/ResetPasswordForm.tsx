"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { AuthField, PasswordInput } from "./AuthField";
import { Button } from "@/components/ui/Button";
import { PasswordStrengthMeter } from "@/app/app/settings/_components/PasswordStrengthMeter";
import { authService } from "@/services/auth.service";
import { toast } from "@/store/toast";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Include at least one letter and one number"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords do not match" });
type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [token, setToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
  });
  const pw = watch("password") ?? "";

  // The reset token arrives as ?token=… on the link from the email.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (t) setToken(t);
  }, []);

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-green-soft p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-green" />
        <p className="font-semibold text-ink">Password reset</p>
        <p className="text-sm text-body">You can now sign in with your new password.</p>
        <Button href="/login" className="mt-2">Go to sign in</Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async ({ password }) => {
        setFormError(null);
        if (!token) {
          setFormError("This reset link is invalid or has expired.");
          return;
        }
        try {
          await authService.resetPassword(token, password);
          toast.success("Password reset successfully");
          setDone(true);
          setTimeout(() => router.push("/login"), 1500);
        } catch (e) {
          setFormError(e instanceof Error ? e.message : "Could not reset password.");
        }
      })}
      className="flex flex-col gap-5"
      noValidate
    >
      {formError && (
        <p className="rounded-[var(--radius)] bg-orange/10 px-4 py-3 text-sm font-medium text-orange">
          {formError}
        </p>
      )}
      <AuthField id="password" label="New password" error={errors.password?.message}>
        <PasswordInput id="password" placeholder="At least 8 characters" {...register("password")} />
        <PasswordStrengthMeter password={pw} />
      </AuthField>
      <AuthField id="confirm" label="Confirm password" error={errors.confirm?.message}>
        <PasswordInput id="confirm" placeholder="Re-enter password" {...register("confirm")} />
      </AuthField>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-pill bg-violet-deep font-medium text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {isSubmitting ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}

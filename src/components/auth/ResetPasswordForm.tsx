"use client";

import { useState } from "react";
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
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords do not match" });
type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
  });
  const pw = watch("password") ?? "";

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
      onSubmit={handleSubmit(async () => {
        await authService.resetPassword();
        toast.success("Password reset successfully");
        setDone(true);
        setTimeout(() => router.push("/login"), 1500);
      })}
      className="flex flex-col gap-5"
      noValidate
    >
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

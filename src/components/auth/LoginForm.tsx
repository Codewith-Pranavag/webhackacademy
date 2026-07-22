"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { AuthField, PasswordInput, authInputClass } from "./AuthField";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type Values = z.infer<typeof schema>;

export function LoginForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-green-soft p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-green" />
        <p className="font-semibold text-ink">Signed in successfully</p>
        <p className="text-sm text-body">
          This is a front-end demo — connect your backend to complete authentication.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async () => {
        await new Promise((r) => setTimeout(r, 500));
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

      <AuthField id="password" label="Password" error={errors.password?.message}>
        <PasswordInput id="password" placeholder="••••••••" {...register("password")} />
      </AuthField>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-body">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-line accent-[var(--color-violet-deep)]"
            {...register("remember")}
          />
          Remember me
        </label>
        <Link href="/forgot-password" className="font-medium text-violet-deep hover:underline">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-pill bg-violet-deep font-medium text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

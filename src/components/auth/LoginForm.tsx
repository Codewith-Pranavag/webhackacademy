"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthField, PasswordInput, authInputClass } from "./AuthField";
import { useAuth } from "@/store/auth";
import { ApiError } from "@/lib/api/client";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type Values = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    setFormError(null);
    try {
      await login(values);
      router.push("/app/dashboard");
    } catch (e) {
      if (e instanceof ApiError && e.status === 423) {
        router.push("/account-locked");
        return;
      }
      setFormError(
        e instanceof Error ? e.message : "Could not sign in. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {formError && (
        <p className="rounded-[var(--radius)] bg-orange/10 px-4 py-3 text-sm font-medium text-orange">
          {formError}
        </p>
      )}

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

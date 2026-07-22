"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { AuthField, PasswordInput, authInputClass } from "./AuthField";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue" }),
    }),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type Values = z.infer<typeof schema>;

export function RegisterForm() {
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
        <p className="font-semibold text-ink">Account created</p>
        <p className="text-sm text-body">
          This is a front-end demo — connect your backend to complete registration.
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
      <AuthField id="name" label="Full name" error={errors.name?.message}>
        <input id="name" placeholder="Jane Doe" className={authInputClass} {...register("name")} />
      </AuthField>

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
        <PasswordInput id="password" placeholder="At least 8 characters" {...register("password")} />
      </AuthField>

      <AuthField id="confirm" label="Confirm password" error={errors.confirm?.message}>
        <PasswordInput id="confirm" placeholder="Re-enter password" {...register("confirm")} />
      </AuthField>

      <label className="flex items-start gap-2 text-sm text-body">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-line accent-[var(--color-violet-deep)]"
          {...register("terms")}
        />
        <span>
          I agree to the{" "}
          <span className="font-medium text-violet-deep">Terms of Service</span> and{" "}
          <span className="font-medium text-violet-deep">Privacy Policy</span>.
        </span>
      </label>
      {errors.terms && (
        <span className="-mt-3 text-xs font-medium text-orange">
          {errors.terms.message}
        </span>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-pill bg-violet-deep font-medium text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthField, PasswordInput, authInputClass } from "./AuthField";
import { useAuth } from "@/store/auth";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "Include at least one letter and one number",
      ),
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
  const router = useRouter();
  const registerUser = useAuth((s) => s.register);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    setFormError(null);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      router.push("/app/dashboard");
    } catch (e) {
      setFormError(
        e instanceof Error ? e.message : "Could not create your account.",
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

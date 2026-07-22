import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { OtpVerifyForm } from "@/components/auth/OtpVerifyForm";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your WebHack Academy account.",
};

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Verify your email"
      subtitle="We sent a 6-digit code to your email address. Enter it below to continue."
      footer={
        <>
          Wrong address?{" "}
          <Link href="/register" className="font-medium text-violet-deep hover:underline">
            Sign up again
          </Link>
        </>
      }
    >
      <OtpVerifyForm mode="email" />
    </AuthShell>
  );
}

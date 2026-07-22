import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { OtpVerifyForm } from "@/components/auth/OtpVerifyForm";

export const metadata: Metadata = {
  title: "Two-Factor Authentication",
  description: "Enter your authentication code to continue.",
};

export default function TwoFactorPage() {
  return (
    <AuthShell
      title="Two-factor authentication"
      subtitle="Enter the 6-digit code from your authenticator app to finish signing in."
      footer={
        <>
          Having trouble?{" "}
          <Link href="/login" className="font-medium text-violet-deep hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <OtpVerifyForm mode="2fa" />
    </AuthShell>
  );
}

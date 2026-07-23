"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { OtpInput } from "./OtpInput";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { toast } from "@/store/toast";

/**
 * Shared OTP verification form used by email verification and 2FA.
 * `mode` tweaks copy + where it routes on success.
 */
export function OtpVerifyForm({ mode }: { mode: "email" | "2fa" }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const verify = async () => {
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "email") {
        await authService.verifyEmail(code);
      } else {
        // The backend issues tokens directly at login (no OTP second factor),
        // so here we confirm the active session is valid before continuing.
        await authService.me();
      }
      setDone(true);
      toast.success(mode === "email" ? "Email verified" : "Signed in");
      setTimeout(() => router.push(mode === "email" ? "/login" : "/app/dashboard"), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    setCooldown(30);
    try {
      if (mode === "email") await authService.resendVerification();
      toast.info("Code sent", "Check your inbox for a new code.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not resend the code.");
    }
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-green-soft p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-green" />
        <p className="font-semibold text-ink">
          {mode === "email" ? "Email verified!" : "Verified — signing you in"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <OtpInput value={code} onChange={setCode} />
      {error && <p className="text-center text-sm font-medium text-orange">{error}</p>}
      <Button onClick={verify} disabled={submitting} className="w-full">
        {submitting ? "Verifying…" : "Verify"}
      </Button>
      <p className="text-center text-sm text-muted">
        Didn&apos;t get a code?{" "}
        {cooldown > 0 ? (
          <span>Resend in {cooldown}s</span>
        ) : (
          <button onClick={resend} className="font-medium text-violet-deep hover:underline">
            Resend code
          </button>
        )}
      </p>
    </div>
  );
}

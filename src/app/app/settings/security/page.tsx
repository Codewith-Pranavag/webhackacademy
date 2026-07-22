"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ShieldCheck, Smartphone, Monitor, KeyRound, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Skeleton } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { toast } from "@/store/toast";
import { formatDate, formatTime } from "@/lib/format";
import { Toggle } from "../_components/Toggle";
import { PasswordStrengthMeter } from "../_components/PasswordStrengthMeter";

const pwSchema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "Passwords do not match" });
type PwValues = z.infer<typeof pwSchema>;

const inputClass =
  "h-11 w-full rounded-[var(--radius)] border border-line bg-surface-soft px-4 text-sm text-ink outline-none focus:border-violet";

export default function SecurityPage() {
  const sessions = useAsync(() => userService.sessions());
  const history = useAsync(() => userService.loginHistory());

  const [twoFA, setTwoFA] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } =
    useForm<PwValues>({ resolver: zodResolver(pwSchema) });
  const nextPw = watch("next") ?? "";

  const submitPassword = async () => {
    await authService.changePassword();
    reset();
    toast.success("Password changed", "Use your new password next time you sign in.");
  };

  const enable2FA = () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setTwoFA(true);
    setOtpOpen(false);
    setOtp("");
    toast.success("Two-factor authentication enabled");
  };

  return (
    <div className="max-w-3xl">
      <Link href="/app/settings" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-body hover:text-violet-deep">
        <ArrowLeft className="h-4 w-4" /> Settings
      </Link>
      <PageHeader title="Security" description="Protect your account and manage devices." />

      <div className="flex flex-col gap-6">
        {/* Change password */}
        <Card>
          <CardHeader title="Change password" />
          <form onSubmit={handleSubmit(submitPassword)} className="flex max-w-md flex-col gap-4" noValidate>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">Current password</span>
              <input type="password" className={inputClass} {...register("current")} />
              {errors.current && <span className="text-xs text-orange">{errors.current.message}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">New password</span>
              <input type="password" className={inputClass} {...register("next")} />
              <PasswordStrengthMeter password={nextPw} />
              {errors.next && <span className="text-xs text-orange">{errors.next.message}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">Confirm new password</span>
              <input type="password" className={inputClass} {...register("confirm")} />
              {errors.confirm && <span className="text-xs text-orange">{errors.confirm.message}</span>}
            </label>
            <Button type="submit" className="self-start" disabled={isSubmitting}>
              <KeyRound className="h-4 w-4" /> Update password
            </Button>
          </form>
        </Card>

        {/* 2FA */}
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-deep">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">Two-factor authentication</p>
                <p className="text-sm text-muted">Add an extra layer of security with an authenticator app.</p>
                {twoFA && (
                  <Badge tone="green" className="mt-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
                  </Badge>
                )}
              </div>
            </div>
            <Toggle
              checked={twoFA}
              onChange={(v) => (v ? setOtpOpen(true) : (setTwoFA(false), toast.info("2FA disabled")))}
              label="Two-factor authentication"
            />
          </div>
        </Card>

        {/* Active sessions */}
        <Card>
          <CardHeader title="Active sessions & devices" />
          {sessions.loading ? (
            <Skeleton className="h-40" />
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {sessions.data?.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 py-4">
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-soft text-ink">
                      {s.device.toLowerCase().includes("iphone") ? (
                        <Smartphone className="h-5 w-5" />
                      ) : (
                        <Monitor className="h-5 w-5" />
                      )}
                    </span>
                    <span>
                      <span className="flex items-center gap-2 text-sm font-medium text-ink">
                        {s.device} · {s.browser}
                        {s.current && <Badge tone="green">This device</Badge>}
                      </span>
                      <span className="text-sm text-muted">
                        {s.location} · {s.ip} · {s.lastActive}
                      </span>
                    </span>
                  </span>
                  {!s.current && (
                    <Button variant="outline" size="sm" onClick={() => toast.success("Session revoked")}>
                      Revoke
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Login history */}
        <Card>
          <CardHeader title="Recent login activity" />
          {history.loading ? (
            <Skeleton className="h-40" />
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {history.data?.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="flex items-center gap-3">
                    {h.status === "failed" ? (
                      <AlertTriangle className="h-4 w-4 text-orange" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green" />
                    )}
                    <span>
                      <span className="block text-sm text-ink">{h.device}</span>
                      <span className="text-xs text-muted">
                        {h.location} · {h.ip}
                      </span>
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm text-ink">{formatDate(h.at)}</span>
                    <span className="text-xs text-muted">{formatTime(h.at)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* 2FA enable dialog */}
      <Dialog
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        title="Enable two-factor authentication"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setOtpOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={enable2FA}>Verify &amp; enable</Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-body">Scan this QR code with your authenticator app, then enter the 6-digit code.</p>
          <div
            className="h-40 w-40 rounded-[var(--radius)] border border-line"
            style={{
              backgroundImage:
                "repeating-conic-gradient(var(--color-ink) 0% 25%, transparent 0% 50%)",
              backgroundSize: "20px 20px",
            }}
            aria-hidden
          />
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            inputMode="numeric"
            className="h-12 w-40 rounded-[var(--radius)] border border-line bg-surface-soft text-center font-mono text-2xl tracking-[0.4em] text-ink outline-none focus:border-violet"
          />
        </div>
      </Dialog>
    </div>
  );
}

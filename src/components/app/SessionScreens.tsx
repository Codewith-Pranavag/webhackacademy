"use client";

import { Clock, ShieldAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

function Screen({
  icon,
  title,
  description,
  primary,
  secondary,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-50 text-violet-deep">
        {icon}
      </span>
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
      <p className="max-w-md text-body">{description}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {primary}
        {secondary}
      </div>
    </div>
  );
}

export function SessionExpired() {
  return (
    <Screen
      icon={<Clock className="h-9 w-9" />}
      title="Your session has expired"
      description="For your security, you've been signed out due to inactivity. Please sign in again to continue."
      primary={<Button href="/login">Sign in again</Button>}
      secondary={
        <Button variant="outline" href="/">
          Back to home
        </Button>
      }
    />
  );
}

export function Unauthorized() {
  return (
    <Screen
      icon={<ShieldAlert className="h-9 w-9" />}
      title="Access denied"
      description="You don't have permission to view this page. If you believe this is a mistake, contact your administrator."
      primary={<Button href="/app/dashboard">Go to dashboard</Button>}
    />
  );
}

export function AccountLocked() {
  return (
    <Screen
      icon={<Lock className="h-9 w-9" />}
      title="Account locked"
      description="Your account has been temporarily locked after multiple failed sign-in attempts. Try again in 30 minutes or reset your password."
      primary={<Button href="/forgot-password">Reset password</Button>}
      secondary={<Button variant="outline" href="/">Back to home</Button>}
    />
  );
}

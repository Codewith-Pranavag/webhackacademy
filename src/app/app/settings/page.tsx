"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Github, Linkedin, Chrome } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toast";
import { useAuth } from "@/store/auth";
import { Toggle } from "./_components/Toggle";

const accountSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  language: z.string(),
  timezone: z.string(),
});
type AccountValues = z.infer<typeof accountSchema>;

const inputClass =
  "h-11 w-full rounded-[var(--radius)] border border-line bg-surface-soft px-4 text-sm text-ink outline-none focus:border-violet";

export default function SettingsPage() {
  const user = useAuth((s) => s.user);
  const [tab, setTab] = useState("account");

  const [prefs, setPrefs] = useState({
    email: true,
    push: true,
    marketing: false,
    digest: true,
  });
  const [privacy, setPrivacy] = useState({ visibility: "public", showActivity: true });
  const [connected, setConnected] = useState({ google: true, github: false, linkedin: false });

  const { register, handleSubmit, formState: { errors } } = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      language: "English (US)",
      timezone: "Asia/Kolkata (GMT+5:30)",
    },
  });

  const tabs = [
    { id: "account", label: "Account" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy" },
    { id: "connected", label: "Connected accounts" },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account, notifications and privacy."
        action={
          <Button href="/app/settings/security" variant="outline" size="sm">
            <ShieldCheck className="h-4 w-4" /> Security
          </Button>
        }
      />

      <Tabs tabs={tabs} active={tab} onChange={setTab} className="mb-6" />

      {tab === "account" && (
        <Card className="max-w-2xl">
          <CardHeader title="Account information" />
          <form
            onSubmit={handleSubmit(() => toast.success("Settings saved", "Your account details were updated."))}
            className="flex flex-col gap-5"
          >
            <Field label="Full name" error={errors.name?.message}>
              <input className={inputClass} {...register("name")} />
            </Field>
            <Field label="Email address" error={errors.email?.message}>
              <input className={inputClass} {...register("email")} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Language">
                <select className={inputClass} {...register("language")}>
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                </select>
              </Field>
              <Field label="Timezone">
                <select className={inputClass} {...register("timezone")}>
                  <option>Asia/Kolkata (GMT+5:30)</option>
                  <option>UTC</option>
                  <option>America/New_York (GMT-5)</option>
                </select>
              </Field>
            </div>
            <Button type="submit" className="self-start">Save changes</Button>
          </form>
        </Card>
      )}

      {tab === "notifications" && (
        <Card className="max-w-2xl">
          <CardHeader title="Notification preferences" />
          <div className="flex flex-col divide-y divide-line">
            {([
              ["email", "Email notifications", "Course updates, grades and messages"],
              ["push", "Push notifications", "Real-time alerts in your browser"],
              ["digest", "Weekly digest", "A summary of your progress every Monday"],
              ["marketing", "Product & marketing", "New features, offers and tips"],
            ] as const).map(([key, title, desc]) => (
              <div key={key} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-ink">{title}</p>
                  <p className="text-sm text-muted">{desc}</p>
                </div>
                <Toggle
                  checked={prefs[key]}
                  onChange={(v) => {
                    setPrefs((p) => ({ ...p, [key]: v }));
                    toast.info("Preference updated");
                  }}
                  label={title}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "privacy" && (
        <Card className="max-w-2xl">
          <CardHeader title="Privacy" />
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-3 text-sm font-medium text-ink">Profile visibility</p>
              <div className="flex flex-col gap-2">
                {["public", "students", "private"].map((v) => (
                  <label key={v} className="flex items-center gap-3 rounded-[var(--radius)] border border-line p-3 text-sm capitalize">
                    <input
                      type="radio"
                      name="visibility"
                      checked={privacy.visibility === v}
                      onChange={() => setPrivacy((p) => ({ ...p, visibility: v }))}
                      className="accent-[var(--color-violet-deep)]"
                    />
                    {v === "students" ? "Students only" : v}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-5">
              <div>
                <p className="text-sm font-medium text-ink">Show learning activity</p>
                <p className="text-sm text-muted">Display your streak and achievements on your profile</p>
              </div>
              <Toggle
                checked={privacy.showActivity}
                onChange={(v) => setPrivacy((p) => ({ ...p, showActivity: v }))}
                label="Show activity"
              />
            </div>
          </div>
        </Card>
      )}

      {tab === "connected" && (
        <Card className="max-w-2xl">
          <CardHeader title="Connected accounts" />
          <div className="flex flex-col divide-y divide-line">
            {([
              ["google", "Google", <Chrome key="g" className="h-5 w-5" />],
              ["github", "GitHub", <Github key="gh" className="h-5 w-5" />],
              ["linkedin", "LinkedIn", <Linkedin key="li" className="h-5 w-5" />],
            ] as const).map(([key, name, icon]) => (
              <div key={key} className="flex items-center justify-between gap-4 py-4">
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-soft text-ink">
                    {icon}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">{name}</span>
                    <span className="text-sm text-muted">
                      {connected[key] ? "Connected" : "Not connected"}
                    </span>
                  </span>
                </span>
                <Button
                  variant={connected[key] ? "outline" : "primary"}
                  size="sm"
                  onClick={() => {
                    setConnected((c) => ({ ...c, [key]: !c[key] }));
                    toast.success(connected[key] ? `${name} disconnected` : `${name} connected`);
                  }}
                >
                  {connected[key] ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <p className="mt-6 text-sm text-muted">
        Looking for password &amp; 2FA?{" "}
        <Link href="/app/settings/security" className="font-medium text-violet-deep hover:underline">
          Go to Security settings
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-orange">{error}</span>}
    </label>
  );
}

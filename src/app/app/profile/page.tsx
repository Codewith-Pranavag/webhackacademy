"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  CalendarDays,
  Pencil,
  BookOpen,
  Clock,
  Award,
  Flame,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Skeleton, ErrorState, EmptyState } from "@/components/ui/feedback";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAsync } from "@/hooks/useAsync";
import { userService } from "@/services/user.service";
import { analyticsService } from "@/services/analytics.service";
import { toast } from "@/store/toast";
import { formatDate } from "@/lib/format";
import type { User } from "@/types";

const fieldClass =
  "w-full rounded-[var(--radius)] border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-violet focus:ring-2 focus:ring-violet/30";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  headline: z.string().max(80, "Keep it under 80 characters").optional(),
  bio: z.string().max(300, "Keep it under 300 characters").optional(),
  location: z.string().max(80, "Keep it under 80 characters").optional(),
});

type Values = z.infer<typeof schema>;

export default function ProfilePage() {
  const { data, loading, error, refetch } = useAsync(() => userService.profile());
  const analytics = useAsync(() => analyticsService.student());
  const certs = useAsync(() => userService.certificatesCount());

  const [profile, setProfile] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (data) setProfile(data);
  }, [data]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const openEdit = () => {
    if (!profile) return;
    reset({
      name: profile.name,
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
    });
    setEditing(true);
  };

  const onSubmit = async (values: Values) => {
    const updated = await userService.updateProfile(values);
    setProfile(updated);
    setEditing(false);
    toast.success("Profile updated", "Your changes have been saved.");
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Profile" />
        <Skeleton className="h-52" />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-48 lg:col-span-2" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <PageHeader title="Profile" />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const stats = [
    { label: "Courses enrolled", value: "12", icon: <BookOpen className="h-5 w-5" /> },
    {
      label: "Hours learned",
      value: analytics.data ? `${Math.round(analytics.data.totalHours)}` : "—",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: "Certificates",
      value: certs.data !== null ? String(certs.data ?? 0) : "—",
      icon: <Award className="h-5 w-5" />,
    },
    {
      label: "Day streak",
      value: analytics.data ? `${analytics.data.currentStreak}` : "—",
      icon: <Flame className="h-5 w-5" />,
    },
  ];

  return (
    <div>
      <PageHeader title="Profile" description="Your public presence on WebHack Academy." />

      {/* Header card */}
      <Card className="overflow-hidden p-0">
        <div className="h-32 bg-gradient-to-r from-violet-deep via-violet to-sky sm:h-40" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <span className="rounded-full border-4 border-surface bg-surface">
                <Avatar src={profile.avatar} name={profile.name} size={104} />
              </span>
              <div className="pb-1">
                <h2 className="font-display text-2xl font-bold text-ink">{profile.name}</h2>
                {profile.headline && (
                  <p className="mt-0.5 text-body">{profile.headline}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {profile.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" /> Joined{" "}
                    {formatDate(profile.joinedAt, { day: undefined })}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={openEdit}>
              <Pencil className="h-4 w-4" /> Edit profile
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Bio */}
          <Card>
            <CardHeader title="About" />
            {profile.bio ? (
              <p className="text-body leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-sm text-muted">No bio added yet.</p>
            )}
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader title="Skills" />
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <Badge key={s} tone="violet">
                    {s}
                  </Badge>
                ))}
              </div>
            ) : (
              <EmptyState className="border-0 py-10" title="No skills listed" />
            )}
          </Card>
        </div>

        {/* Learning statistics */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-ink">Learning statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
            ))}
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit profile"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              form="edit-profile-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </>
        }
      >
        <form
          id="edit-profile-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
              Full name
            </label>
            <input id="name" className={fieldClass} {...register("name")} />
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-orange">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="headline" className="mb-1.5 block text-sm font-medium text-ink">
              Headline
            </label>
            <input
              id="headline"
              placeholder="e.g. Aspiring Full-Stack Developer"
              className={fieldClass}
              {...register("headline")}
            />
            {errors.headline && (
              <p className="mt-1 text-xs font-medium text-orange">{errors.headline.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-ink">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell others about yourself"
              className={`${fieldClass} resize-none`}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="mt-1 text-xs font-medium text-orange">{errors.bio.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-ink">
              Location
            </label>
            <input
              id="location"
              placeholder="City, Country"
              className={fieldClass}
              {...register("location")}
            />
            {errors.location && (
              <p className="mt-1 text-xs font-medium text-orange">{errors.location.message}</p>
            )}
          </div>
        </form>
      </Dialog>
    </div>
  );
}

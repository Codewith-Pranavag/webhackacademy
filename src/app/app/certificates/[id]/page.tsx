"use client";

import { useParams } from "next/navigation";
import { Award, Download, Share2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/store/auth";
import { certificateService } from "@/services/certificate.service";
import { toast } from "@/store/toast";
import { formatDate } from "@/lib/format";

export default function CertificateDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const user = useAuth((s) => s.user);
  const { data, loading, error, refetch } = useAsync(
    () => certificateService.get(id),
    [id],
  );

  return (
    <div>
      <PageHeader
        title="Certificate"
        description="Your verified proof of completion."
        action={
          <Link
            href="/app/certificates"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-deep hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> All certificates
          </Link>
        }
      />

      {loading ? (
        <Skeleton className="h-[30rem]" />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : !data ? (
        <EmptyState
          icon={<Award className="h-7 w-7" />}
          title="Certificate not found"
          description="We couldn't find a certificate with that identifier."
          action={
            <Button href="/app/certificates" size="sm">
              Back to certificates
            </Button>
          }
        />
      ) : (
        <div className="grid gap-7 lg:grid-cols-3">
          {/* Certificate preview */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border-4 border-double border-violet-deep/30 bg-gradient-to-br from-surface to-violet-50 p-8 shadow-[var(--shadow-card)] sm:p-12">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-deep/5" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-violet-deep/5" />

              <div className="relative flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-deep text-white">
                  <Award className="h-7 w-7" />
                </span>
                <p className="mt-4 font-display text-lg font-bold tracking-wide text-violet-deep">
                  WebHack Academy
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.25em] text-muted">
                  Certificate of Completion
                </p>
                <p className="mt-6 text-sm text-body">This is proudly presented to</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
                  {user?.name ?? "WebHack Learner"}
                </h2>
                <p className="mt-6 text-sm text-body">for successfully completing</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">
                  {data.courseTitle}
                </h3>

                <div className="mt-8 flex w-full flex-col items-center justify-between gap-6 border-t border-line pt-6 sm:flex-row">
                  <div className="text-center sm:text-left">
                    <p className="text-xs uppercase tracking-wide text-muted">
                      Date issued
                    </p>
                    <p className="text-sm font-medium text-ink">
                      {formatDate(data.issuedAt)}
                    </p>
                  </div>
                  <Badge tone="violet">
                    <ShieldCheck className="h-3.5 w-3.5" /> {data.grade}
                  </Badge>
                  <div className="text-center sm:text-right">
                    <p className="text-xs uppercase tracking-wide text-muted">
                      Credential ID
                    </p>
                    <p className="font-mono text-sm font-medium text-ink">
                      {data.credentialId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-5">
            <Card className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-ink">Share your success</h3>
              <p className="text-sm text-body">
                Download a copy or share this credential with your network.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() =>
                  toast.success("Downloading…", "Your certificate is being prepared.")
                }
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  toast.info("Share link copied", "Anyone with the link can verify this credential.")
                }
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </Card>

            <Card className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-violet-deep">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="text-base font-semibold text-ink">Verified credential</h3>
              </div>
              <p className="text-sm text-body">
                This certificate can be independently verified using the credential
                ID below.
              </p>
              <div className="mt-1 rounded-[var(--radius)] border border-line bg-surface-soft px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted">
                  Credential ID
                </p>
                <p className="font-mono text-sm font-semibold text-ink">
                  {data.credentialId}
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

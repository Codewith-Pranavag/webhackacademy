"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, ArrowRight, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { certificateService } from "@/services/certificate.service";
import { formatDate } from "@/lib/format";
import type { Certificate } from "@/types";

export default function CertificatesPage() {
  const { data, loading, error, refetch } = useAsync(() =>
    certificateService.list(),
  );

  return (
    <div>
      <PageHeader
        title="Certificates"
        description="Every course you complete earns a verifiable credential."
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<Award className="h-7 w-7" />}
          title="No certificates yet"
          description="Complete a course to earn your first credential."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>
      )}
    </div>
  );
}

function CertificateCard({ cert }: { cert: Certificate }) {
  return (
    <Card className="flex flex-col gap-4 p-0">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[var(--radius-lg)]">
        <Image
          src={cert.image}
          alt={cert.courseTitle}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
        <span className="absolute right-3 top-3">
          <Badge tone="violet">
            <ShieldCheck className="h-3.5 w-3.5" /> {cert.grade}
          </Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <span className="text-xs font-medium uppercase tracking-wide text-violet">
          {cert.category}
        </span>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink">
          {cert.courseTitle}
        </h3>

        <dl className="mt-1 flex flex-col gap-1.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Credential ID</dt>
            <dd className="truncate font-mono text-xs text-ink">
              {cert.credentialId}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Issued</dt>
            <dd className="text-ink">{formatDate(cert.issuedAt)}</dd>
          </div>
        </dl>

        <Link
          href={`/app/certificates/${cert.id}`}
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-pill border border-violet-deep/20 py-2.5 text-sm font-semibold text-violet-deep transition-all hover:bg-violet-deep hover:text-white"
        >
          View certificate <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}

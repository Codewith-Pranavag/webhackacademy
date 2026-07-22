"use client";

import { useState } from "react";
import { DollarSign, Wallet, TrendingUp, Clock } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { BarChart } from "@/components/ui/charts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Skeleton } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/useAsync";
import { instructorService } from "@/services/instructor.service";
import { toast } from "@/store/toast";
import { formatMoney } from "@/lib/format";

interface Payout {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: "paid" | "processing" | "pending";
}

const payouts: Payout[] = [
  { id: "p1", date: "01 Jul 2026", amount: 7200, method: "Bank transfer", status: "paid" },
  { id: "p2", date: "01 Jun 2026", amount: 6600, method: "Bank transfer", status: "paid" },
  { id: "p3", date: "01 May 2026", amount: 7050, method: "PayPal", status: "paid" },
  { id: "p4", date: "01 Aug 2026", amount: 8240, method: "Bank transfer", status: "processing" },
];

const statusTone = { paid: "green", processing: "amber", pending: "neutral" } as const;

export default function EarningsPage() {
  const { data, loading } = useAsync(() => instructorService.stats());
  const [open, setOpen] = useState(false);

  const columns: Column<Payout>[] = [
    { key: "date", header: "Date" },
    { key: "amount", header: "Amount", render: (r) => <span className="font-medium text-ink">{formatMoney(r.amount)}</span> },
    { key: "method", header: "Method" },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge tone={statusTone[r.status]}>{r.status}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Earnings"
        description="Track your revenue and manage payouts."
        action={<Button onClick={() => setOpen(true)}><Wallet className="h-4 w-4" /> Request payout</Button>}
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <StatCard label="Available balance" value={formatMoney(8240)} icon={<Wallet className="h-5 w-5" />} />
            <StatCard label="This month" value={formatMoney(8240)} delta="+14%" trend="up" icon={<DollarSign className="h-5 w-5" />} />
            <StatCard label="Lifetime earnings" value={formatMoney(96400)} icon={<TrendingUp className="h-5 w-5" />} />
            <StatCard label="Pending" value={formatMoney(1200)} icon={<Clock className="h-5 w-5" />} />
          </>
        )}
      </div>

      <div className="grid gap-7 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Monthly earnings (in $k)" />
          {loading || !data ? (
            <Skeleton className="h-56" />
          ) : (
            <BarChart data={data.earnings.map((e) => ({ label: e.month, value: e.amount }))} tone="#5dbe74" />
          )}
        </Card>

        <Card>
          <CardHeader title="Next payout" />
          <div className="flex flex-col items-center gap-2 rounded-[var(--radius)] bg-violet-50 p-6 text-center">
            <p className="font-display text-3xl font-bold text-violet-deep">{formatMoney(8240)}</p>
            <p className="text-sm text-body">Scheduled for 01 Aug 2026</p>
            <Badge tone="amber">Processing</Badge>
          </div>
        </Card>
      </div>

      <div className="mt-7">
        <CardHeader title="Payout history" />
        <DataTable columns={columns} rows={payouts} />
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Request a payout"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setOpen(false); toast.success("Payout requested", "We'll process it within 3 business days."); }}>
              Request {formatMoney(8240)}
            </Button>
          </>
        }
      >
        <p className="text-sm text-body">
          Your available balance of <span className="font-semibold text-ink">{formatMoney(8240)}</span> will be
          transferred to your default payout method (Bank transfer ••• 4821).
        </p>
      </Dialog>
    </div>
  );
}

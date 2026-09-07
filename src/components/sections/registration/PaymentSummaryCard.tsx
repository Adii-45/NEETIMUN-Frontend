import { CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentConfig } from "@/lib/api/payments";

/** Formats a paise amount as an Indian Rupee currency string, e.g. 50000 -> "₹500.00". */
export function formatPaise(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={cn(
          "text-sm",
          accent ? "font-medium text-navy-900" : "text-muted",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-sm tabular-nums",
          accent ? "font-display text-base text-navy-900" : "font-medium text-navy-900/80",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function PaymentSummaryCard({
  config,
  loading,
  error,
}: {
  config: PaymentConfig | null;
  loading: boolean;
  error?: string;
}) {
  return (
    <section className="rounded-2xl border border-gold-400/40 bg-cream-50 p-6">
      <header className="flex items-center gap-2">
        <CreditCard aria-hidden="true" className="size-4 text-gold-600" />
        <h4 className="text-xs font-medium uppercase tracking-wide-label text-muted">
          Payment Summary
        </h4>
      </header>

      {loading ? (
        <div className="mt-5 flex animate-pulse flex-col gap-3" aria-hidden="true">
          <div className="h-4 w-full rounded bg-cream-200" />
          <div className="h-4 w-full rounded bg-cream-200" />
          <div className="h-6 w-full rounded bg-cream-200" />
        </div>
      ) : error || !config ? (
        <p role="alert" className="mt-4 text-sm text-red-500">
          {error ?? "Could not load payment details."}
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <Row label="Registration Fee" value={formatPaise(config.amount)} />
          <Row label="Platform Fee" value="₹0.00" />
          <div className="border-t border-border pt-3">
            <Row label="Total" value={formatPaise(config.amount)} accent />
          </div>
          <div className="mt-1 flex items-start gap-2 border-t border-border pt-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-emerald-600"
            />
            <p className="text-xs leading-relaxed text-muted">
              <span className="font-medium text-navy-900">Payment Method:</span>{" "}
              Razorpay Secure Checkout — UPI, Cards, Netbanking &amp; Wallets.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

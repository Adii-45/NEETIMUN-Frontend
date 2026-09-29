"use client";

import { useState } from "react";
import { Check, Download, Loader2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { downloadReceipt, type VerifyPaymentResult } from "@/lib/api/payments";
import { formatPaise } from "./PaymentSummaryCard";

function paymentMethodLabel(method: string | null): string {
  switch (method) {
    case "upi":
      return "UPI";
    case "card":
      return "Card";
    case "netbanking":
      return "Netbanking";
    case "wallet":
      return "Wallet";
    case "emi":
      return "EMI";
    default:
      return "Online Payment via Razorpay";
  }
}

function formatPaymentDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-left">
      <span className="shrink-0 text-xs uppercase tracking-wide-label text-muted">
        {label}
      </span>
      <span className="truncate text-right text-sm font-medium text-navy-900">
        {value}
      </span>
    </div>
  );
}

export function SuccessState({
  registration,
  eventTitle,
  committeeTitle,
}: {
  registration: VerifyPaymentResult;
  eventTitle: string;
  committeeTitle: string;
}) {
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "error">("idle");

  const receipt = registration.receipt;
  const reference =
    receipt?.reference ??
    `NM26-${registration.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

  async function handleDownload() {
    if (!receipt || downloadState === "loading") return;
    setDownloadState("loading");
    try {
      await downloadReceipt(receipt.downloadUrl, `NEETIMUN-Receipt-${reference}.pdf`);
      setDownloadState("idle");
    } catch {
      setDownloadState("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-navy-900 text-cream-50 shadow-md shadow-navy-900/10">
        <Check aria-hidden="true" className="size-8" />
      </span>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-3xl text-navy-900">
          Registration Confirmed
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          Your registration and payment for <strong>{eventTitle}</strong> have
          been successfully confirmed.
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-1 rounded-2xl border border-border bg-cream-50 px-6 py-5 sm:px-8">
        <div className="flex flex-col items-center gap-1 pb-3">
          <span className="text-xs uppercase tracking-wide-label text-muted">
            Registration Reference
          </span>
          <span className="font-display text-xl tracking-wide text-navy-900">
            {reference}
          </span>
        </div>

        <div className="divide-y divide-border border-t border-border pt-2">
          <DetailRow label="Delegate" value={registration.fullName} />
          <DetailRow label="Email" value={registration.email} />
          {registration.institution && (
            <DetailRow label="Institution" value={registration.institution} />
          )}
          <DetailRow label="Committee" value={committeeTitle} />
          {registration.portfolio && (
            <DetailRow label="Portfolio" value={registration.portfolio} />
          )}
          {/* Events can switch accommodation off; then the question was never asked. */}
          {(!registration.answers || "accommodationRequired" in registration.answers) && (
            <DetailRow
              label="Accommodation"
              value={registration.accommodationRequired ? "Required" : "Not Required"}
            />
          )}
        </div>

        <div className="divide-y divide-border border-t border-border pt-2 mt-2">
          <DetailRow
            label="Amount Paid"
            value={
              registration.paymentAmount != null
                ? formatPaise(registration.paymentAmount)
                : "-"
            }
          />
          <DetailRow
            label="Payment Method"
            value={paymentMethodLabel(registration.paymentMethod)}
          />
          <DetailRow label="Payment Date" value={formatPaymentDate(registration.paidAt)} />
          <div className="flex items-baseline justify-between gap-4 py-1.5 text-left">
            <span className="flex shrink-0 items-center gap-1.5 text-xs uppercase tracking-wide-label text-muted">
              <ShieldCheck aria-hidden="true" className="size-3.5 text-emerald-600" />
              Payment ID
            </span>
            <span className="truncate break-all text-right font-mono text-xs text-navy-900">
              {registration.paymentId ?? "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col gap-3">
        <Button
          type="button"
          onClick={handleDownload}
          disabled={!receipt || downloadState === "loading"}
          className="w-full justify-center"
        >
          {downloadState === "loading" ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Preparing Download…
            </>
          ) : (
            <>
              <Download aria-hidden="true" className="size-4" />
              Download Payment Receipt
            </>
          )}
        </Button>

        {downloadState === "error" && (
          <p role="alert" className="text-xs text-red-600">
            Your payment was successful - only the receipt download failed.
            Please try again, or find your receipt in the confirmation email
            sent to {registration.email}.
          </p>
        )}

        {receipt?.emailSent && downloadState !== "error" && (
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <Mail aria-hidden="true" className="size-3.5" />
            A copy of your receipt has also been sent to {registration.email}.
          </p>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button href="/" variant="outline">
          Return Home
        </Button>
        <Button href="/committees">Explore Committees</Button>
      </div>
    </div>
  );
}

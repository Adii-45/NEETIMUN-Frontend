import { CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegistrationQuote } from "@/lib/api/registrationForm";

/** Formats a paise amount as an Indian Rupee currency string, e.g. 210000 -> "₹2,100.00". */
export function formatPaise(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

// TEMPORARY, presentation-only priority-registration promo. Never used in any
// calculation: it only decides whether to draw a struck-through "was" price
// next to a Registration Fee line whose real amount is exactly the priority
// fee. The amount actually charged always comes from the backend quote.
const PRIORITY_FEE_PAISE = 180000;
const ORIGINAL_DISPLAY_FEE = "₹2,000.00";
const isPriorityFeeItem = (item: { label: string; amount: number }) =>
  item.label === "Registration Fee" && item.amount === PRIORITY_FEE_PAISE;

function Row({
  label,
  value,
  accent = false,
  originalValue,
}: {
  label: string;
  value: string;
  accent?: boolean;
  /** Display-only crossed-out price shown before `value`; also marks `value` with a "*" footnote. */
  originalValue?: string;
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
        {originalValue ? (
          <span className="mr-2 font-normal text-muted line-through">{originalValue}</span>
        ) : null}
        {value}
        {originalValue ? <span className="text-gold-600">*</span> : null}
      </span>
    </div>
  );
}

export function PaymentSummaryCard({
  quote,
  loading,
  error,
}: {
  /**
   * The backend's price for the delegate's answers (see quoteRegistration) -
   * display only; the amount is computed again server-side when the payment
   * order is created and verified.
   */
  quote: RegistrationQuote | null;
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
      ) : error ? (
        <p role="alert" className="mt-4 text-sm text-red-500">
          {error}
        </p>
      ) : quote == null ? (
        <p className="mt-4 text-sm text-muted">
          The registration fee will appear here once your details are confirmed.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {quote.items.map((item, index) => (
            <Row
              key={`${item.label}-${index}`}
              label={item.label}
              value={formatPaise(item.amount)}
              originalValue={isPriorityFeeItem(item) ? ORIGINAL_DISPLAY_FEE : undefined}
            />
          ))}
          <Row label="Platform Fee" value="₹0.00" />
          <div className="border-t border-border pt-3">
            <Row label="Total" value={formatPaise(quote.amount)} accent />
          </div>
          <div className="mt-1 flex items-start gap-2 border-t border-border pt-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-emerald-600"
            />
            <p className="text-xs leading-relaxed text-muted">
              <span className="font-medium text-navy-900">Payment Method:</span>{" "}
              Razorpay Secure Checkout - UPI, Cards, Netbanking &amp; Wallets.
            </p>
          </div>
          {quote.items.some(isPriorityFeeItem) ? (
            <p className="text-[11px] leading-relaxed text-muted">
              <span className="font-semibold text-gold-600">*NOTE:</span> Priority registrations are open until 4
              October. Regular registrations will open thereafter at the updated registration fee.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}

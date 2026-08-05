"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { PortfolioSelect } from "@/components/ui/PortfolioSelect";
import { cn } from "@/lib/utils";
import { committees } from "@/lib/data/committees";
import { ApiError } from "@/lib/api/client";
import type { RegistrationPayload } from "@/lib/api/registrations";
import {
  createOrder,
  getPaymentConfig,
  verifyPayment,
  type CreateOrderResult,
  type PaymentConfig,
} from "@/lib/api/payments";
import { formatPaise } from "./PaymentSummaryCard";
import {
  loadRazorpayCheckout,
  openRazorpayCheckout,
  type RazorpayFailureResponse,
  type RazorpaySuccessResponse,
} from "@/lib/razorpay";
import { DelegateDetailsStep } from "./DelegateDetailsStep";
import { ReviewStep } from "./ReviewStep";
import { SuccessState } from "./SuccessState";
import {
  emptyDelegateDetails,
  experienceLabel,
  validateDelegateDetails,
  type DelegateDetails,
  type DetailErrors,
} from "./types";

/** Phases of the payment flow driving Step 3's "Proceed to Payment" button. */
type PaymentPhase =
  | "idle"
  | "creating_order"
  | "checkout_open"
  | "verifying"
  | "failed";

function paymentPhaseLabel(phase: PaymentPhase, config: PaymentConfig | null) {
  switch (phase) {
    case "creating_order":
      return "Preparing Payment…";
    case "checkout_open":
      return "Waiting for Payment…";
    case "verifying":
      return "Verifying Payment…";
    case "failed":
      return "Retry Payment";
    case "idle":
      return config ? `Proceed to Payment · ${formatPaise(config.amount)}` : "Proceed to Payment";
  }
}

/** Backend validation-error field names that map onto a DelegateDetails key. */
const backendFieldToDetailField: Partial<Record<string, keyof DelegateDetails>> = {
  fullName: "fullName",
  email: "email",
  phone: "phone",
  institution: "institution",
  motivation: "motivation",
  emergencyContactPhone: "emergencyPhone",
  declarationAccepted: "declaration",
};

const steps = ["Committees", "Details", "Confirm"];

const stepHeadings = [
  "Choose Committee Preference",
  "Delegate Details",
  "Review & Confirm",
];

export function RegistrationForm({
  initialCommitteeSlug,
}: {
  initialCommitteeSlug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Step 1 — committee & portfolio. The URL is the source of truth for the
  // selected committee, keyed by slug.
  const [selected, setSelected] = useState(
    () => initialCommitteeSlug || committees[0]?.slug || "",
  );
  const [portfolio, setPortfolio] = useState("");
  const [portfolioError, setPortfolioError] = useState(false);

  // Step 2 — delegate details
  const [details, setDetails] = useState<DelegateDetails>(emptyDelegateDetails);
  const [detailErrors, setDetailErrors] = useState<DetailErrors>({});

  // Step 3 — final confirmation & payment
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("idle");
  const [paymentError, setPaymentError] = useState("");
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [paymentConfigLoading, setPaymentConfigLoading] = useState(true);
  const [paymentConfigError, setPaymentConfigError] = useState("");

  const selectedCommittee = committees.find(
    (committee) => committee.slug === selected,
  );
  const portfolioOptions = selectedCommittee?.portfolioTypes ?? [];
  const hasPortfolios = portfolioOptions.length > 0;

  // Always open the Registration page at the top (hero) on a fresh load,
  // overriding the browser's scroll restoration on reload / direct open.
  // Runs once on mount only — never on step changes, edits, or URL syncs,
  // so in-page scrolling is left untouched.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load the registration fee once up front so it's ready to display the
  // moment the delegate reaches the Review & Confirm step — this figure
  // always comes from the backend (never a frontend constant) so the
  // displayed amount can never drift from what's actually charged.
  useEffect(() => {
    let cancelled = false;
    getPaymentConfig()
      .then((config) => {
        if (!cancelled) setPaymentConfig(config);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setPaymentConfigError(
          error instanceof ApiError
            ? error.message
            : "Could not load payment details.",
        );
      })
      .finally(() => {
        if (!cancelled) setPaymentConfigLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCommitteeChange(slug: string) {
    setSelected(slug);
    // Never keep a portfolio that belongs to a different committee.
    setPortfolio("");
    setPortfolioError(false);
    // Keep the URL shareable and in sync — no scroll reset, no reload.
    router.replace(`${pathname}?committee=${slug}`, { scroll: false });
  }

  function handlePortfolioChange(value: string) {
    setPortfolio(value);
    if (value) setPortfolioError(false);
  }

  function handleCommitteeContinue() {
    if (hasPortfolios && !portfolio) {
      setPortfolioError(true);
      return;
    }
    setPortfolioError(false);
    setStep(1);
  }

  function updateDetail<K extends keyof DelegateDetails>(
    field: K,
    value: DelegateDetails[K],
  ) {
    setDetails((prev) => ({ ...prev, [field]: value }));
    setDetailErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev,
    );
  }

  function handleDetailsContinue() {
    const errors = validateDelegateDetails(details);
    if (Object.keys(errors).length > 0) {
      setDetailErrors(errors);
      return;
    }
    setDetailErrors({});
    setStep(2);
  }

  function handleConfirmChange(checked: boolean) {
    setConfirmChecked(checked);
    if (checked) setConfirmError(false);
  }

  /** True while a payment is in flight — the delegate can't navigate away or retry mid-flight. */
  const paymentInFlight =
    paymentPhase === "creating_order" ||
    paymentPhase === "checkout_open" ||
    paymentPhase === "verifying";

  /**
   * Maps a verify-payment failure onto the UI. The Razorpay charge has
   * already succeeded by the time this runs, so every message here points
   * the delegate at support with the payment ID rather than "please retry" —
   * retrying would risk a second charge for the same registration.
   */
  function handleVerifyError(error: unknown, paymentId: string) {
    const supportHint = ` Please contact support with your payment ID: ${paymentId}`;

    if (error instanceof ApiError && error.code === "duplicate_email") {
      setDetailErrors((prev) => ({
        ...prev,
        email: "This email address is already registered.",
      }));
      setStep(1);
      setPaymentError(
        "Your payment succeeded, but this email address is already registered." +
          supportHint,
      );
    } else if (error instanceof ApiError && error.code === "duplicate_payment") {
      // A repeat verify-payment call for a payment that already created a
      // registration (e.g. a double-submitted callback) — no new charge.
      setPaymentError(
        "This payment has already been processed. If you don't see a confirmation," +
          supportHint,
      );
    } else if (
      error instanceof ApiError &&
      error.code === "validation_failed" &&
      error.fields
    ) {
      const mapped: DetailErrors = {};
      for (const [field, message] of Object.entries(error.fields)) {
        const detailField = backendFieldToDetailField[field];
        if (detailField) mapped[detailField] = message;
      }
      if (Object.keys(mapped).length > 0) {
        setDetailErrors((prev) => ({ ...prev, ...mapped }));
        setStep(1);
      }
      setPaymentError(
        "Your payment succeeded, but there was a problem saving your details." +
          supportHint,
      );
    } else {
      setPaymentError(
        "Your payment succeeded, but we could not complete your registration." +
          supportHint,
      );
    }
    setPaymentPhase("failed");
  }

  async function handleProceedToPayment() {
    if (!confirmChecked) {
      setConfirmError(true);
      return;
    }
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setPaymentPhase("failed");
      setPaymentError("Payments are not available right now. Please try again later.");
      return;
    }

    setConfirmError(false);
    setPaymentError("");
    setPaymentPhase("creating_order");

    const munExperience = details.munExperience;
    const registrationPayload: RegistrationPayload = {
      fullName: details.fullName,
      email: details.email,
      phone: details.phone,
      institution: details.institution,
      gradeOrYear: details.yearGrade,
      committeePreference1: selectedCommittee?.tag ?? "",
      portfolio,
      city: details.city,
      country: details.country,
      courseStream: details.courseStream,
      motivation: details.motivation,
      priorMunExperience: munExperience !== "" && munExperience !== "first",
      experienceDetails: experienceLabel(munExperience),
      dietaryRestrictions: details.dietary,
      emergencyContactName: details.emergencyName,
      emergencyContactPhone: details.emergencyPhone,
      emergencyContactRelationship: details.emergencyRelationship,
      accessibilityNeeds: details.accessibility,
      declarationAccepted: details.declaration && confirmChecked,
    };

    let order: CreateOrderResult;
    try {
      [, order] = await Promise.all([loadRazorpayCheckout(), createOrder()]);
    } catch (error) {
      setPaymentPhase("failed");
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Could not start payment. Please try again.",
      );
      return;
    }

    setPaymentPhase("checkout_open");

    async function onCheckoutSuccess(response: RazorpaySuccessResponse) {
      setPaymentPhase("verifying");
      try {
        const registration = await verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          registration: registrationPayload,
        });
        setRegistrationId(
          `NM26-${registration.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
        );
        setTransactionId(response.razorpay_payment_id);
        setPaymentPhase("idle");
        setSubmitted(true);
      } catch (error) {
        handleVerifyError(error, response.razorpay_payment_id);
      }
    }

    function onCheckoutFailure(failure: RazorpayFailureResponse) {
      setPaymentPhase("failed");
      setPaymentError(
        failure.error?.description || "Payment failed. Please try again.",
      );
    }

    openRazorpayCheckout(
      {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "NEETI MUN 2026",
        description: `Delegate Registration — ${selectedCommittee?.tag ?? ""}`,
        order_id: order.orderId,
        prefill: {
          name: details.fullName,
          email: details.email,
          contact: details.phone,
        },
        theme: { color: "#0f1f3d" },
        handler: onCheckoutSuccess,
        modal: {
          // Fires when the delegate closes the checkout modal without
          // completing payment. Never resets an in-progress verification —
          // by the time `handler` above runs, the modal is already closing.
          ondismiss: () => {
            setPaymentPhase((phase) => (phase === "verifying" ? phase : "idle"));
          },
        },
      },
      onCheckoutFailure,
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-cream-50/60 p-6 sm:p-10">
      <Stepper steps={steps} activeStep={submitted ? steps.length : step} />

      {submitted ? (
        <div className="mt-10">
          <SuccessState
            registrationId={registrationId}
            transactionId={transactionId}
          />
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-8">
          <h2 className="font-display text-2xl text-navy-900">
            {stepHeadings[step]}
          </h2>

          {step === 0 && (
            <>
              <fieldset className="m-0 border-0 p-0">
                <legend className="sr-only">Choose Committee Preference</legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {committees.map((committee) => {
                    const isSelected = selected === committee.slug;
                    return (
                      <label
                        key={committee.slug}
                        className={cn(
                          "flex cursor-pointer flex-col gap-1.5 rounded-2xl border p-5 text-left transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-cream-50",
                          isSelected
                            ? "border-navy-900 bg-cream-200/70 shadow-md shadow-navy-900/5"
                            : "border-border bg-cream-50 hover:border-gold-400/40",
                        )}
                      >
                        <input
                          type="radio"
                          name="committee-preference"
                          value={committee.slug}
                          checked={isSelected}
                          onChange={() => handleCommitteeChange(committee.slug)}
                          className="sr-only"
                        />
                        <span className="text-xs font-medium uppercase tracking-wide-label text-gold-600">
                          {committee.tag}
                        </span>
                        <span className="font-display text-base leading-snug text-navy-900">
                          {committee.title}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="flex flex-col gap-2">
                <Label htmlFor="portfolio-preference">
                  Portfolio Preference
                </Label>
                <PortfolioSelect
                  id="portfolio-preference"
                  options={portfolioOptions}
                  value={portfolio}
                  onChange={handlePortfolioChange}
                  disabled={!selectedCommittee || !hasPortfolios}
                  disabledPlaceholder={
                    selectedCommittee && !hasPortfolios
                      ? "No portfolios for this committee"
                      : "Select a committee first"
                  }
                  invalid={portfolioError}
                  aria-describedby={
                    portfolioError ? "portfolio-error" : "portfolio-help"
                  }
                />
                {portfolioError ? (
                  <p
                    id="portfolio-error"
                    role="alert"
                    className="text-xs text-red-500"
                  >
                    Please select your preferred portfolio.
                  </p>
                ) : (
                  <p id="portfolio-help" className="text-xs text-muted">
                    Portfolio availability depends on committee allocation.
                  </p>
                )}
              </div>

              <div className="flex justify-end border-t border-border pt-6">
                <Button type="button" onClick={handleCommitteeContinue}>
                  Next Step &rarr;
                </Button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <DelegateDetailsStep
                details={details}
                errors={detailErrors}
                onChange={updateDetail}
              />

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(0)}
                >
                  &larr; Back
                </Button>
                <Button type="button" onClick={handleDetailsContinue}>
                  Continue &rarr;
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <ReviewStep
                committee={selectedCommittee}
                portfolio={portfolio}
                details={details}
                confirmChecked={confirmChecked}
                confirmError={
                  confirmError
                    ? "Please confirm your details before submitting."
                    : undefined
                }
                onConfirmChange={handleConfirmChange}
                onEdit={setStep}
                paymentConfig={paymentConfig}
                paymentConfigLoading={paymentConfigLoading}
                paymentConfigError={paymentConfigError || undefined}
              />

              <div className="flex flex-col gap-4 border-t border-border pt-6">
                {paymentError ? (
                  <p role="alert" className="text-sm text-red-500">
                    {paymentError}
                  </p>
                ) : null}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={paymentInFlight}
                    className="disabled:pointer-events-none disabled:opacity-60"
                  >
                    &larr; Back to Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={handleProceedToPayment}
                    disabled={paymentInFlight || paymentConfigLoading}
                    className="disabled:pointer-events-none disabled:opacity-70"
                  >
                    {paymentPhaseLabel(paymentPhase, paymentConfig)}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

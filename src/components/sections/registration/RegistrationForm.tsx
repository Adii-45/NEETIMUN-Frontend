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
import {
  createOrder,
  verifyPayment,
  type CreateOrderResult,
  type VerifyPaymentResult,
} from "@/lib/api/payments";
import { getRegistrationStatus, type RegistrationStatus } from "@/lib/api/events";
import {
  quoteRegistration,
  type RegistrationFormSchema,
  type RegistrationQuote,
} from "@/lib/api/registrationForm";
import { formatPaise } from "./PaymentSummaryCard";
import {
  loadRazorpayCheckout,
  openRazorpayCheckout,
  type RazorpayFailureResponse,
  type RazorpaySuccessResponse,
} from "@/lib/razorpay";
import { DynamicFormStep } from "./DynamicFormStep";
import { ReviewStep } from "./ReviewStep";
import { SuccessState } from "./SuccessState";
import {
  initialAnswers,
  toAnswerPayload,
  validateAnswers,
  type AnswerErrors,
  type AnswerState,
} from "./types";

/** Phases of the payment flow driving Step 3's "Proceed to Payment" button. */
type PaymentPhase =
  | "idle"
  | "creating_order"
  | "checkout_open"
  | "verifying"
  | "failed";

function paymentPhaseLabel(phase: PaymentPhase, amount: number | null) {
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
      return amount != null ? `Proceed to Payment · ${formatPaise(amount)}` : "Proceed to Payment";
  }
}

/**
 * The exact status → message mapping the public Events experience uses
 * everywhere else, applied here as a hard block on the payment step. This is
 * UX only: the backend's own check (event.IsRegistrationOpen, re-run at both
 * create-order and verify-payment) is what actually prevents a late/early
 * registration - this just keeps the button from being clickable in the
 * first place and explains why.
 */
function registrationClosedMessage(status: RegistrationStatus): string {
  switch (status.status) {
    case "registration_not_open":
      return `Registration for this event opens ${new Date(status.registrationStartAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long", timeStyle: "short" })} (IST).`;
    case "registration_paused":
      return "Registrations are temporarily paused for this event. Please check back shortly.";
    case "registration_closed":
      return "Registration for this event is closed. Please contact the Secretariat if you believe this is an error.";
    case "ongoing":
      return "This event is already underway and is no longer accepting registrations online. Please contact the Secretariat.";
    case "completed":
      return "This event has concluded and is no longer accepting registrations.";
    default:
      return "Registration is not currently open for this event.";
  }
}

const steps = ["Committees", "Details", "Confirm"];

const stepHeadings = [
  "Choose Committee Preference",
  "Delegate Details",
  "Review & Confirm",
];

export function RegistrationForm({
  eventId,
  eventTitle,
  initialCommitteeSlug,
  formSchema,
}: {
  eventId: string;
  eventTitle: string;
  initialCommitteeSlug: string;
  /** The event's registration form, fetched from the backend; rendered as-is. */
  formSchema: RegistrationFormSchema;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Server-authoritative registration status for this event. UX-only - the
  // backend independently re-derives and enforces the same window at both
  // create-order and verify-payment, so a stale read here can never itself
  // let a late registration through (see payments.ts).
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null);
  const [registrationStatusError, setRegistrationStatusError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getRegistrationStatus(eventId)
      .then((status) => {
        if (!cancelled) setRegistrationStatus(status);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setRegistrationStatusError(
          error instanceof ApiError ? error.message : "Could not load registration status.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState<VerifyPaymentResult | null>(null);

  // Step 1 - committee & portfolio. The URL is the source of truth for the
  // selected committee, keyed by slug.
  const [selected, setSelected] = useState(
    () => initialCommitteeSlug || committees[0]?.slug || "",
  );
  const [portfolio, setPortfolio] = useState("");
  const [portfolioError, setPortfolioError] = useState(false);

  // Step 2 - the event's configured questions, keyed by stable field id.
  const fields = formSchema.fields;
  const [answers, setAnswers] = useState<AnswerState>(() => initialAnswers(fields));
  const [answerErrors, setAnswerErrors] = useState<AnswerErrors>({});
  const [checkingDetails, setCheckingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Step 3 - final confirmation & payment
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("idle");
  const [paymentError, setPaymentError] = useState("");
  // The backend's price for the current answers (display only - the amount
  // is recomputed server-side when the order is created and verified).
  const [quote, setQuote] = useState<RegistrationQuote | null>(null);

  const selectedCommittee = committees.find(
    (committee) => committee.slug === selected,
  );
  // Every configured portfolio is always selectable by every delegate - none is
  // hidden because another delegate registered for it. Listed once each.
  const portfolioOptions = (selectedCommittee?.registrationPortfolioTypes ?? []).filter(
    (name, index, all) =>
      all.findIndex((other) => other.trim().toLowerCase() === name.trim().toLowerCase()) === index,
  );
  const hasPortfolios = portfolioOptions.length > 0;

  /** The backend found this email already registered for the event - caught before any payment. */
  function handleEmailAlreadyRegistered(message: string) {
    setAnswerErrors((prev) => ({ ...prev, email: message }));
    setDetailsError("");
    setStep(1);
  }

  // Always open the Registration page at the top (hero) on a fresh load,
  // overriding the browser's scroll restoration on reload / direct open.
  // Runs once on mount only - never on step changes, edits, or URL syncs,
  // so in-page scrolling is left untouched.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handleCommitteeChange(slug: string) {
    setSelected(slug);
    // Never keep a portfolio that belongs to a different committee.
    setPortfolio("");
    setPortfolioError(false);
    // Keep the URL shareable and in sync - no scroll reset, no reload.
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

  function updateAnswer(fieldId: string, value: AnswerState[string]) {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    setAnswerErrors((prev) => (prev[fieldId] ? { ...prev, [fieldId]: "" } : prev));
    setDetailsError("");
  }

  /**
   * Validates locally for instant feedback, then asks the backend to validate
   * the same answers against the event's form and price them - so the review
   * step shows the amount that will really be charged, and any rule the
   * frontend missed surfaces here rather than after payment.
   */
  async function handleDetailsContinue() {
    const errors = validateAnswers(fields, answers);
    if (Object.keys(errors).length > 0) {
      setAnswerErrors(errors);
      return;
    }
    setAnswerErrors({});
    setDetailsError("");
    setCheckingDetails(true);
    try {
      setQuote(
        await quoteRegistration(eventId, toAnswerPayload(fields, answers), {
          committeePreference1: selectedCommittee?.tag ?? "",
          portfolio,
        }),
      );
      setStep(2);
    } catch (error) {
      if (error instanceof ApiError && error.code === "duplicate_email") {
        handleEmailAlreadyRegistered(error.message);
      } else if (error instanceof ApiError && error.code === "validation_failed" && error.fields) {
        const { answers: general, ...perField } = error.fields;
        setAnswerErrors(perField);
        setDetailsError(general ?? "Please correct the highlighted fields.");
      } else {
        setDetailsError(
          error instanceof ApiError ? error.message : "Could not verify your details. Please try again.",
        );
      }
    } finally {
      setCheckingDetails(false);
    }
  }

  function handleConfirmChange(checked: boolean) {
    setConfirmChecked(checked);
    if (checked) setConfirmError(false);
  }

  /** True while a payment is in flight - the delegate can't navigate away or retry mid-flight. */
  const paymentInFlight =
    paymentPhase === "creating_order" ||
    paymentPhase === "checkout_open" ||
    paymentPhase === "verifying";

  /**
   * Maps a verify-payment failure onto the UI. The Razorpay charge has
   * already succeeded by the time this runs, so every message here points
   * the delegate at support with the payment ID rather than "please retry" -
   * retrying would risk a second charge for the same registration.
   */
  function handleVerifyError(error: unknown, paymentId: string) {
    const supportHint = ` Please contact support with your payment ID: ${paymentId}`;

    if (error instanceof ApiError && error.code === "duplicate_email") {
      const emailField = fields.find((field) => field.id === "email");
      if (emailField) {
        setAnswerErrors((prev) => ({
          ...prev,
          [emailField.id]: "This email address is already registered.",
        }));
      }
      setStep(1);
      setPaymentError(
        "Your payment succeeded, but this email address is already registered." +
        supportHint,
      );
    } else if (error instanceof ApiError && error.code === "duplicate_payment") {
      // A repeat verify-payment call for a payment that already created a
      // registration (e.g. a double-submitted callback) - no new charge.
      setPaymentError(
        "This payment has already been processed. If you don't see a confirmation," +
        supportHint,
      );
    } else if (
      error instanceof ApiError &&
      error.code === "validation_failed" &&
      error.fields
    ) {
      const mapped: AnswerErrors = {};
      for (const [field, message] of Object.entries(error.fields)) {
        if (fields.some((f) => f.id === field)) mapped[field] = message;
      }
      if (Object.keys(mapped).length > 0) {
        setAnswerErrors((prev) => ({ ...prev, ...mapped }));
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

    const answerPayload = toAnswerPayload(fields, answers);
    const committeeSelection = {
      committeePreference1: selectedCommittee?.tag ?? "",
      portfolio,
    };
    const nameAnswer = answers["fullName"];
    const emailAnswer = answers["email"];
    const phoneAnswer = answers["phone"];

    let order: CreateOrderResult;
    try {
      [, order] = await Promise.all([
        loadRazorpayCheckout(),
        createOrder(eventId, answerPayload, committeeSelection),
      ]);
    } catch (error) {
      if (error instanceof ApiError && error.code === "duplicate_email") {
        // Caught before any payment: nothing was charged.
        setPaymentPhase("idle");
        handleEmailAlreadyRegistered(error.message);
        return;
      }
      setPaymentPhase("failed");
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Could not start payment. Please try again.",
      );
      return;
    }

    // If the fee changed since the review step was priced, don't open a
    // checkout for a different amount than the delegate agreed to - refresh
    // the displayed price and let them confirm again.
    if (quote && order.amount !== quote.amount) {
      try {
        setQuote(await quoteRegistration(eventId, answerPayload, committeeSelection));
      } catch {
        // The stale figure is cleared below either way.
        setQuote(null);
      }
      setPaymentPhase("failed");
      setPaymentError(
        "The registration fee for this event has changed. Please review the updated amount and try again.",
      );
      return;
    }

    setPaymentPhase("checkout_open");

    async function onCheckoutSuccess(response: RazorpaySuccessResponse) {
      setPaymentPhase("verifying");
      try {
        const registration = await verifyPayment(eventId, {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          registration: committeeSelection,
          answers: answerPayload,
        });
        setConfirmation(registration);
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
        name: eventTitle,
        description: `Delegate Registration - ${selectedCommittee?.tag ?? ""}`,
        order_id: order.orderId,
        prefill: {
          name: typeof nameAnswer === "string" ? nameAnswer : "",
          email: typeof emailAnswer === "string" ? emailAnswer : "",
          contact: typeof phoneAnswer === "string" ? phoneAnswer : "",
        },
        theme: { color: "#0f1f3d" },
        handler: onCheckoutSuccess,
        modal: {
          // Fires when the delegate closes the checkout modal without
          // completing payment. Never resets an in-progress verification -
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

      {submitted && confirmation ? (
        <div className="mt-10">
          <SuccessState
            registration={confirmation}
            eventTitle={eventTitle}
            committeeTitle={selectedCommittee?.title ?? selectedCommittee?.tag ?? ""}
          />
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide-label text-gold-600">
              Registering for {eventTitle}
            </span>
            <h2 className="font-display text-2xl text-navy-900">
              {stepHeadings[step]}
            </h2>
          </div>

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
              <DynamicFormStep
                fields={fields}
                answers={answers}
                errors={answerErrors}
                onChange={updateAnswer}
              />
              {detailsError ? (
                <p role="alert" className="text-sm text-red-500">
                  {detailsError}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(0)}
                >
                  &larr; Back
                </Button>
                <Button
                  type="button"
                  onClick={handleDetailsContinue}
                  disabled={checkingDetails}
                  className="disabled:pointer-events-none disabled:opacity-70"
                >
                  {checkingDetails ? "Checking…" : "Continue →"}
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <ReviewStep
                committee={selectedCommittee}
                portfolio={portfolio}
                fields={fields}
                answers={answers}
                confirmChecked={confirmChecked}
                confirmError={
                  confirmError
                    ? "Please confirm your details before submitting."
                    : undefined
                }
                onConfirmChange={handleConfirmChange}
                onEdit={setStep}
                quote={quote}
                quoteLoading={false}
              />

              <div className="flex flex-col gap-4 border-t border-border pt-6">
                {paymentError ? (
                  <p role="alert" className="text-sm text-red-500">
                    {paymentError}
                  </p>
                ) : null}
                {registrationStatusError ? (
                  <p role="alert" className="text-sm text-red-500">
                    {registrationStatusError}
                  </p>
                ) : registrationStatus && !registrationStatus.isRegistrationOpen ? (
                  <div className="flex flex-col gap-3 rounded-2xl border border-gold-400/40 bg-gold-50/60 p-4">
                    <p role="status" className="text-sm text-navy-900">
                      {registrationClosedMessage(registrationStatus)}
                    </p>
                    <Button href="/contact" variant="outline" className="self-start">
                      Contact Us
                    </Button>
                  </div>
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
                    disabled={
                      paymentInFlight ||
                      !quote ||
                      !!(registrationStatus && !registrationStatus.isRegistrationOpen)
                    }
                    className="disabled:pointer-events-none disabled:opacity-70"
                  >
                    {paymentPhaseLabel(paymentPhase, quote?.amount ?? null)}
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

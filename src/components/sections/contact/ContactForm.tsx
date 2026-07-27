"use client";

import { useState } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { PortfolioSelect } from "@/components/ui/PortfolioSelect";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { Field, invalidControlClass } from "@/components/sections/registration/FormControls";
import { ApiError } from "@/lib/api/client";
import { submitContactInquiry } from "@/lib/api/contact";
import { inquiryCategories } from "@/lib/data/contact";
import { cn } from "@/lib/utils";

const fieldPolish = "hover:border-gold-400/50 transition-colors duration-200";

type FieldName = "fullName" | "email" | "category" | "message";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validateLocal(values: {
  fullName: string;
  email: string;
  category: string;
  message: string;
}): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};

  const fullName = values.fullName.trim();
  if (fullName.length < 2 || fullName.length > 120) {
    errors.fullName = "Please enter your full name.";
  }

  const email = values.email.trim();
  if (!emailRe.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.category) {
    errors.category = "Please select an inquiry category.";
  }

  const message = values.message.trim();
  if (message.length < 10 || message.length > 5000) {
    errors.message = "Please enter a message (at least 10 characters).";
  }

  return errors;
}

const backendFieldToLocalField: Partial<Record<string, FieldName>> = {
  fullName: "fullName",
  email: "email",
  category: "category",
  message: "message",
};

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  function clearFieldError(field: FieldName) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const localErrors = validateLocal({ fullName, email, category, message });
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await submitContactInquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        category,
        message: message.trim(),
      });
      setFullName("");
      setEmail("");
      setCategory("");
      setMessage("");
      setToast({
        message:
          "Your inquiry has been submitted successfully. Our Secretariat will respond within 24–48 hours.",
      });
    } catch (error) {
      if (error instanceof ApiError && error.code === "validation_failed" && error.fields) {
        const mapped: Partial<Record<FieldName, string>> = {};
        for (const [field, msg] of Object.entries(error.fields)) {
          const local = backendFieldToLocalField[field];
          if (local) mapped[local] = msg;
        }
        setErrors(mapped);
        setSubmitError(error.message);
      } else {
        setSubmitError(
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-full rounded-2xl border border-border bg-cream-50 p-7 shadow-sm sm:rounded-3xl sm:p-9">
      {/* Card header */}
      <h2 className="mb-4 font-display text-2xl text-navy-900 sm:text-3xl">
        Direct Inquiry
      </h2>

      <p className="mb-7 text-sm leading-relaxed text-muted">
        Our Secretariat reviews every inquiry with care and confidentiality.
        Whether you are a delegate, institution, media representative, or
        prospective partner, complete the form below and our team will respond
        within 24–48 hours.
      </p>

      {/* Fields */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        {/* Name + Email */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full Name" htmlFor="full-name" required error={errors.fullName}>
            <Input
              id="full-name"
              name="full-name"
              type="text"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                clearFieldError("fullName");
              }}
              placeholder="Ex. Hon. Jane Doe"
              aria-invalid={errors.fullName ? true : undefined}
              aria-describedby={errors.fullName ? "full-name-error" : undefined}
              className={cn(fieldPolish, errors.fullName && invalidControlClass)}
            />
          </Field>
          <Field label="Diplomatic Email" htmlFor="email" required error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError("email");
              }}
              placeholder="official@organization.org"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={cn(fieldPolish, errors.email && invalidControlClass)}
            />
          </Field>
        </div>

        {/* Inquiry Category — searchable combobox */}
        <Field label="Inquiry Category" htmlFor="category" required error={errors.category}>
          <PortfolioSelect
            id="category"
            options={[...inquiryCategories]}
            value={category}
            onChange={(value) => {
              setCategory(value);
              clearFieldError("category");
            }}
            placeholder="Select Protocol Tier"
            searchPlaceholder="Search inquiry categories..."
            invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "category-error" : undefined}
          />
          {/* Hidden input carries the value for native form submission */}
          <input type="hidden" name="category" value={category} />
        </Field>

        {/* Message */}
        <Field label="Official Statement / Message" htmlFor="message" required error={errors.message}>
          <Textarea
            id="message"
            name="message"
            rows={7}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              clearFieldError("message");
            }}
            placeholder="Please provide a detailed formal inquiry…"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={cn(fieldPolish, errors.message && invalidControlClass)}
          />
        </Field>

        {submitError ? (
          <p role="alert" className="text-sm text-red-500">
            {submitError}
          </p>
        ) : null}

        {/* Action */}
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <ShieldCheck size={13} className="shrink-0 text-gold-600" />
            Your details are used solely to respond to your inquiry.
          </p>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group w-full justify-center disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
          >
            {isSubmitting ? "Submitting…" : "Submit Formal Inquiry"}
            <Send
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Button>
        </div>
      </form>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

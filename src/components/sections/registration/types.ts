import type { AnswerPayload, FormField } from "@/lib/api/registrationForm";

/**
 * The delegate's in-progress answers, keyed by the event form's stable field
 * ids. Text-like fields (including numbers, while being typed) hold strings,
 * multiple-choice fields hold the selected option values, and confirmation
 * boxes hold a boolean.
 */
export type AnswerState = Record<string, string | string[] | boolean>;

export type AnswerErrors = Record<string, string>;

export function initialAnswers(fields: FormField[]): AnswerState {
  const state: AnswerState = {};
  for (const field of fields) {
    if (field.type === "checkbox") state[field.id] = [];
    else if (field.type === "consent") state[field.id] = false;
    else state[field.id] = field.defaultValue ?? "";
  }
  return state;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()-]{6,}$/;

function isEmpty(field: FormField, value: AnswerState[string] | undefined): boolean {
  if (field.type === "checkbox") return !Array.isArray(value) || value.length === 0;
  if (field.type === "consent") return value !== true;
  return typeof value !== "string" || value.trim() === "";
}

/**
 * Immediate, friendly validation so delegates get feedback without a round
 * trip. This is a convenience only: the backend independently validates every
 * answer against the same schema and is what actually enforces the rules.
 */
export function validateAnswers(fields: FormField[], answers: AnswerState): AnswerErrors {
  const errors: AnswerErrors = {};

  for (const field of fields) {
    const value = answers[field.id];

    if (isEmpty(field, value)) {
      if (field.required) {
        errors[field.id] =
          field.type === "consent"
            ? "Please confirm to continue."
            : field.type === "select" || field.type === "radio" || field.type === "checkbox"
              ? "Please make a selection."
              : "This field is required.";
      }
      continue;
    }

    if (typeof value !== "string") continue;
    const text = value.trim();

    switch (field.type) {
      case "email":
        if (!emailPattern.test(text)) errors[field.id] = "Please enter a valid email address.";
        break;
      case "phone":
        if (!phonePattern.test(text)) errors[field.id] = "Please enter a valid phone number.";
        break;
      case "number": {
        const n = Number(text);
        if (!Number.isFinite(n)) errors[field.id] = "Please enter a number.";
        else if (field.min !== undefined && n < field.min) errors[field.id] = `Must be at least ${field.min}.`;
        else if (field.max !== undefined && n > field.max) errors[field.id] = `Must be at most ${field.max}.`;
        break;
      }
      case "short_text":
      case "long_text":
        if (field.minLength && text.length < field.minLength) {
          errors[field.id] = `Must be at least ${field.minLength} characters.`;
        } else if (field.maxLength && text.length > field.maxLength) {
          errors[field.id] = `Must be at most ${field.maxLength} characters.`;
        }
        break;
    }
  }

  return errors;
}

/** Builds the wire payload: only answered fields, numbers as numbers, text trimmed. */
export function toAnswerPayload(fields: FormField[], answers: AnswerState): AnswerPayload {
  const payload: AnswerPayload = {};
  for (const field of fields) {
    const value = answers[field.id];
    if (isEmpty(field, value)) continue;
    if (field.type === "number") payload[field.id] = Number(String(value).trim());
    else if (typeof value === "string") payload[field.id] = value.trim();
    else if (value !== undefined) payload[field.id] = value;
  }
  return payload;
}

/** Human-readable form of an answer, for the review step. Empty string when unanswered. */
export function answerDisplay(field: FormField, value: AnswerState[string] | undefined): string {
  if (isEmpty(field, value)) return "";
  const label = (v: string) => field.options?.find((o) => o.value === v)?.label ?? v;
  if (field.type === "consent") return "Yes";
  if (field.type === "checkbox" && Array.isArray(value)) return value.map(label).join(", ");
  if (field.type === "select" || field.type === "radio") return label(String(value));
  return String(value).trim();
}

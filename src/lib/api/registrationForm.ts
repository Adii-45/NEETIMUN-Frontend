import { apiRequest } from "./client";

// The event's registration form as served by the backend
// (GET /api/events/{id}/registration-form). The backend is the source of
// truth for both the questions and the price: it re-validates every answer
// and recomputes the amount on order creation and payment verification, so
// nothing in this module can influence what is charged.

export type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "consent";

export type FormOption = { value: string; label: string };

export type FormField = {
  id: string;
  kind: "system" | "custom";
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  order: number;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: FormOption[];
};

export type RegistrationFormSchema = {
  /** Increments each time an admin saves a changed form; 0 = built-in default. */
  version: number;
  currency: string;
  /** Only enabled fields, already in display order. */
  fields: FormField[];
};

export type QuoteLineItem = { label: string; amount: number };

export type RegistrationQuote = {
  /** Amount in paise the backend will charge for these answers. */
  amount: number;
  currency: string;
  items: QuoteLineItem[];
  version: number;
};

/** The wire shape of an answer: text, number, selected option values, or a ticked confirmation. */
export type AnswerPayload = Record<string, string | number | string[] | boolean>;

export async function getRegistrationForm(idOrSlug: string): Promise<RegistrationFormSchema> {
  const { data } = await apiRequest<RegistrationFormSchema>(
    `/api/events/${encodeURIComponent(idOrSlug)}/registration-form`,
  );
  return data;
}

/**
 * Asks the backend to validate the answers and price them. Display-only for
 * the review step - it creates nothing and charges nothing, and the amount is
 * computed again server-side when the payment order is created and verified.
 */
export async function quoteRegistration(eventId: string, answers: AnswerPayload): Promise<RegistrationQuote> {
  const { data } = await apiRequest<RegistrationQuote>(
    `/api/events/${encodeURIComponent(eventId)}/registration-quote`,
    { method: "POST", body: JSON.stringify({ answers }) },
  );
  return data;
}

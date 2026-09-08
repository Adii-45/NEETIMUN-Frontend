import { apiRequest } from "./client";
import type { Registration, RegistrationPayload } from "./registrations";

export type PaymentConfig = {
  /** Registration fee in paise when accommodation is not required — set by the backend. */
  noAccommodationAmount: number;
  /** Registration fee in paise when accommodation is required — set by the backend. */
  accommodationAmount: number;
  currency: string;
};

export type CreateOrderResult = {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
};

export type VerifyPaymentPayload = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  registration: RegistrationPayload;
};

/** The registration fee the backend will actually charge — for display only. */
export async function getPaymentConfig(): Promise<PaymentConfig> {
  const { data } = await apiRequest<PaymentConfig>("/api/payments/config");
  return data;
}

/**
 * Creates a Razorpay order for the registration fee, scoped to one event.
 * The backend derives the authoritative amount from accommodationRequired
 * alone — this call never sends an amount, so there is nothing here for a
 * client to tamper with — and independently re-checks that event's
 * registration window before creating the order. No registration exists
 * yet.
 */
export async function createOrder(
  eventId: string,
  accommodationRequired: boolean,
): Promise<CreateOrderResult> {
  const { data } = await apiRequest<CreateOrderResult>(
    `/api/events/${encodeURIComponent(eventId)}/create-order`,
    {
      method: "POST",
      body: JSON.stringify({ accommodationRequired }),
    },
  );
  return data;
}

/**
 * Verifies a completed payment for one event and, only on success, creates
 * the registration under that same event. The backend re-checks the
 * event's registration window again here (defense in depth, mirroring
 * createOrder) — a client can never register for a different event than the
 * one it created the order under just by editing this call.
 */
export async function verifyPayment(
  eventId: string,
  payload: VerifyPaymentPayload,
): Promise<Registration> {
  const { data } = await apiRequest<Registration>(
    `/api/events/${encodeURIComponent(eventId)}/verify-payment`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return data;
}

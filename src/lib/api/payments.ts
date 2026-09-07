import { apiRequest } from "./client";
import type { Registration, RegistrationPayload } from "./registrations";

export type PaymentConfig = {
  /** Registration fee in paise — the amount actually charged, set by the backend. */
  amount: number;
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

/** Creates a Razorpay order for the fixed registration fee. No registration exists yet. */
export async function createOrder(): Promise<CreateOrderResult> {
  const { data } = await apiRequest<CreateOrderResult>("/api/create-order", {
    method: "POST",
    body: JSON.stringify({}),
  });
  return data;
}

/** Verifies a completed payment and, only on success, creates the registration. */
export async function verifyPayment(
  payload: VerifyPaymentPayload,
): Promise<Registration> {
  const { data } = await apiRequest<Registration>("/api/verify-payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}

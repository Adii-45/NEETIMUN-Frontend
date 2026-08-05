// This module only holds shapes shared across the registration flow: the
// payload embedded in a verify-payment request (RegistrationPayload) and the
// stored record shape (Registration). There's no direct-create call here —
// a registration is only ever created as a side effect of a verified
// payment (see src/lib/api/payments.ts's verifyPayment), never posted on its
// own.

export type RegistrationPayload = {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  gradeOrYear?: string;
  committeePreference1: string;
  portfolio?: string;
  city?: string;
  country?: string;
  courseStream?: string;
  motivation?: string;
  priorMunExperience: boolean;
  experienceDetails?: string;
  dietaryRestrictions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  accessibilityNeeds?: string;
  declarationAccepted: boolean;
};

export type Registration = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  gradeOrYear: string | null;
  committeePreference1: string;
  committeePreference2: string | null;
  committeePreference3: string | null;
  countryPreferences: string[];
  portfolio: string | null;
  city: string | null;
  country: string | null;
  courseStream: string | null;
  motivation: string | null;
  priorMunExperience: boolean;
  experienceDetails: string | null;
  accommodationRequired: boolean;
  dietaryRestrictions: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;
  accessibilityNeeds: string | null;
  declarationAccepted: boolean;
  heardFrom: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "waitlisted" | "cancelled";
  createdAt: string;
  updatedAt: string;
  // Payment (set once, at creation, from the verified Razorpay payment that
  // authorized this registration).
  paymentId: string | null;
  paymentOrderId: string | null;
  paymentAmount: number | null;
  paymentCurrency: string | null;
  paymentStatus: string | null;
  paidAt: string | null;
};

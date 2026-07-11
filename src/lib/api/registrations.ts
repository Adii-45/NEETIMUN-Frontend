import { apiRequest } from "./client";

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
};

export async function submitRegistration(
  payload: RegistrationPayload,
): Promise<Registration> {
  const { data } = await apiRequest<Registration>("/api/registrations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}

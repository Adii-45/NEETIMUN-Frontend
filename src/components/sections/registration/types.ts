export type DelegateDetails = {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  city: string;
  country: string;
  // MUN Experience
  munExperience: string;
  // Committee Motivation
  motivation: string;
  // Emergency Contact
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  // Preferences
  dietary: string;
  // Accommodation — "yes" | "no" | "" (not yet chosen; there is no default).
  accommodationRequired: string;
  accommodationDetails: string;
  // Declaration
  declaration: boolean;
};

export type DetailErrors = Partial<Record<keyof DelegateDetails, string>>;

export const emptyDelegateDetails: DelegateDetails = {
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  city: "",
  country: "",
  munExperience: "",
  motivation: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  dietary: "",
  accommodationRequired: "",
  accommodationDetails: "",
  declaration: false,
};

export const MOTIVATION_MAX = 250;

export const experienceOptions = [
  { value: "first", label: "First Conference" },
  { value: "1-2", label: "1–2 Conferences" },
  { value: "3-5", label: "3–5 Conferences" },
  { value: "6+", label: "6+ Conferences" },
] as const;

export const dietaryOptions = [
  "No Preference",
  "Vegetarian",
  "Vegan",
  "Jain",
  "Halal",
  "Gluten-Free",
  "Other",
] as const;

export const accommodationOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

export function experienceLabel(value: string) {
  return experienceOptions.find((option) => option.value === value)?.label ?? "";
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()-]{6,}$/;

export function validateDelegateDetails(details: DelegateDetails): DetailErrors {
  const errors: DetailErrors = {};

  if (!details.fullName.trim()) {
    errors.fullName = "Please enter your full name.";
  }
  if (!details.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!emailPattern.test(details.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!details.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!phonePattern.test(details.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!details.institution.trim()) {
    errors.institution = "Please enter your institution.";
  }
  if (!details.city.trim()) {
    errors.city = "Please enter your city.";
  }
  if (!details.country.trim()) {
    errors.country = "Please enter your country.";
  }
  if (!details.emergencyName.trim()) {
    errors.emergencyName = "Please enter an emergency contact name.";
  }
  if (!details.emergencyPhone.trim()) {
    errors.emergencyPhone = "Please enter an emergency contact phone number.";
  } else if (!phonePattern.test(details.emergencyPhone.trim())) {
    errors.emergencyPhone = "Please enter a valid phone number.";
  }
  if (!details.dietary.trim()) {
    errors.dietary = "Please select a dietary preference.";
  }
  if (details.accommodationRequired !== "yes" && details.accommodationRequired !== "no") {
    errors.accommodationRequired = "Please select whether accommodation is required.";
  }
  if (!details.declaration) {
    errors.declaration = "Please confirm that the information provided is accurate.";
  }

  return errors;
}

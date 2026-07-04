export type DelegateDetails = {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  city: string;
  country: string;
  // Academic Information
  yearGrade: string;
  courseStream: string;
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
  accessibility: string;
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
  yearGrade: "",
  courseStream: "",
  munExperience: "",
  motivation: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  dietary: "",
  accessibility: "",
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
  if (!details.declaration) {
    errors.declaration = "Please confirm that the information provided is accurate.";
  }

  return errors;
}

export function generateReferenceId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `NM26-${random}`;
}

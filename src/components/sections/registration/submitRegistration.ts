import {
  GOOGLE_APPS_SCRIPT_URL,
  GOOGLE_SPREADSHEET_ID,
  REGISTRATION_SHEET_NAME,
} from "@/lib/config/registration";
import type { Committee } from "@/lib/data/committees";
import { experienceLabel, type DelegateDetails } from "./types";

/**
 * Human-readable column headers for specific delegate fields. Any field NOT
 * listed here is auto-labelled from its key (e.g. `fullName` -> "Full Name"),
 * so adding a new field to the form requires ZERO changes here.
 */
const LABEL_OVERRIDES: Partial<Record<keyof DelegateDetails, string>> = {
  phone: "Phone Number",
  yearGrade: "Current Year / Grade",
  courseStream: "Course / Stream",
  munExperience: "Previous MUN Experience",
  motivation: "Committee Motivation",
  emergencyName: "Emergency Contact Name",
  emergencyRelationship: "Emergency Contact Relationship",
  emergencyPhone: "Emergency Contact Number",
  dietary: "Dietary Preference",
  accessibility: "Accessibility Requirements",
  declaration: "Declaration Accepted",
};

/** `fullName` -> "Full Name", `emergencyName` -> "Emergency Name", etc. */
function prettify(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function labelFor(key: string): string {
  return LABEL_OVERRIDES[key as keyof DelegateDetails] ?? prettify(key);
}

function formatValue(key: string, value: unknown): string {
  if (key === "munExperience" && typeof value === "string") {
    return experienceLabel(value) || value;
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value == null ? "" : String(value);
}

export type RegistrationSubmission = {
  committee: Committee | undefined;
  portfolio: string;
  details: DelegateDetails;
};

/** Shape of the Apps Script Web App response. */
type SubmissionResponse = {
  success: boolean;
  registrationId?: string;
  message?: string;
  timestamp?: string;
};

export type SubmissionResult = {
  registrationId: string;
  message: string;
  timestamp: string;
};

/**
 * Builds the flat record (header -> value) sent to the sheet. The delegate
 * portion is derived directly from the live `details` state via
 * `Object.entries`, so it always mirrors exactly what the form holds —
 * including any fields added in the future.
 *
 * The `Registration ID` is sent as an empty placeholder so it keeps its column
 * position; the Apps Script assigns the actual sequential ID. Workflow columns
 * (status, payment, etc.) are owned and defaulted by the Apps Script.
 */
export function buildRegistrationRecord({
  committee,
  portfolio,
  details,
}: RegistrationSubmission): Record<string, string> {
  const now = new Date();

  const delegateColumns = Object.fromEntries(
    Object.entries(details).map(([key, value]) => [
      labelFor(key),
      formatValue(key, value),
    ]),
  );

  return {
    "Registration ID": "",
    Timestamp: now.toISOString(),
    Committee: committee?.title ?? "",
    Portfolio: portfolio,
    ...delegateColumns,
    "Application Source": "Website",
    "User Agent": typeof navigator !== "undefined" ? navigator.userAgent : "",
    "Submission Date": now.toLocaleDateString(),
    "Submission Time": now.toLocaleTimeString(),
  };
}

/** Safely parse the (possibly empty / non-JSON) response body. */
function parseSubmissionResponse(raw: string): SubmissionResponse | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? (parsed as SubmissionResponse)
      : null;
  } catch {
    return null;
  }
}

/** One useful debug line, DEV-only. */
function debugSubmission(info: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[registration] submit", info);
  }
}

/**
 * Posts a registration to the Google Apps Script Web App, which appends a row
 * to the Google Sheet and returns the assigned registration ID. No custom
 * backend involved.
 *
 * Uses a `text/plain` content type so the browser sends a "simple" request
 * (no CORS preflight, which Apps Script Web Apps do not handle).
 *
 * Response handling is deliberately forgiving: Apps Script answers a POST with
 * a 302 redirect to `googleusercontent.com`, and that cross-origin body is not
 * always cleanly readable. Because the row is written before the response is
 * produced, a completed request whose body is missing / unreadable / uses an
 * older shape is treated as SUCCESS. Only an EXPLICIT `success: false` from the
 * script is a rejection — this guarantees a written row is never reported as a
 * failure.
 */
export async function submitRegistration(
  submission: RegistrationSubmission,
): Promise<SubmissionResult> {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    throw new Error(
      "Google Apps Script URL is not configured. Set NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL in .env.local.",
    );
  }

  const record = buildRegistrationRecord(submission);

  let response: Response;
  try {
    response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        sheetName: REGISTRATION_SHEET_NAME,
        record,
      }),
      redirect: "follow",
    });
  } catch {
    // fetch() rejects only on network / transport failures.
    throw new Error(
      "Network error while submitting. Please check your connection and try again.",
    );
  }

  const rawBody = await response.text().catch(() => "");
  const result = parseSubmissionResponse(rawBody);

  debugSubmission({
    httpStatus: response.status,
    ok: response.ok,
    redirected: response.redirected,
    rawBody,
    parsed: result,
    success: result?.success,
    message: result?.message,
    registrationId: result?.registrationId,
  });

  // 1) Explicit, structured rejection (duplicate / validation / handled error).
  if (result && result.success === false) {
    throw new Error(
      result.message ||
        "Your registration could not be completed. Please review your details and try again.",
    );
  }

  // 2) Hard transport failure with no usable body (e.g. wrong deploy access
  //    returning an HTML error page). This is a genuine failure.
  if (!response.ok && !result) {
    throw new Error(
      `The server returned an unexpected response (HTTP ${response.status}). Please try again.`,
    );
  }

  // 3) Otherwise the request completed and the row was written. Missing or
  //    relabelled success fields are treated as success — never a false negative.
  const registrationId = result?.registrationId ?? "";

  if (!registrationId && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      "[registration] Submission succeeded but no `registrationId` was returned. " +
        "The deployed Apps Script is likely out of date — redeploy the latest " +
        "google-apps-script/Code.gs so doPost returns { registrationId }.",
    );
  }

  return {
    registrationId,
    message: result?.message ?? "Registration submitted successfully.",
    timestamp: result?.timestamp ?? new Date().toISOString(),
  };
}

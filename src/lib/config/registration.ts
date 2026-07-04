/**
 * ─────────────────────────────────────────────────────────────────────────
 *  CENTRAL REGISTRATION → GOOGLE SHEETS CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Values come from environment variables (see `.env.example`). Because the
 *  browser submits directly to the Apps Script Web App, they must be exposed
 *  to the client with the `NEXT_PUBLIC_` prefix.
 *
 *  Set them in `.env.local` for local development, or in your Vercel Project
 *  Settings for production. Switching spreadsheets = change the env vars only,
 *  nothing else in the codebase.
 */

export const GOOGLE_SPREADSHEET_ID =
  process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID ?? "";

export const GOOGLE_APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ?? "";

/** Tab name inside the spreadsheet where rows are appended. */
export const REGISTRATION_SHEET_NAME =
  process.env.NEXT_PUBLIC_REGISTRATION_SHEET_NAME || "Registrations";

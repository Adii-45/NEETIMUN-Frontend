// All event timestamps are absolute instants (ISO 8601 with an explicit UTC
// offset, as returned by the Go backend) - formatting here only ever affects
// display, never the underlying value the backend already used to derive
// isRegistrationOpen/status. NEETI MUN operates out of India, so every
// public-facing date is rendered in Asia/Kolkata regardless of the visitor's
// own device timezone.
const TIME_ZONE = "Asia/Kolkata";

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatEventDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: TIME_ZONE,
    dateStyle: "long",
    timeStyle: "short",
  });
}

/** e.g. "10 – 12 January 2027" or "10 January – 2 February 2027" across months. */
export function formatEventDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const opts: Intl.DateTimeFormatOptions = { timeZone: TIME_ZONE, day: "numeric", month: "long", year: "numeric" };

  const startStr = start.toLocaleDateString("en-IN", opts);
  const endStr = end.toLocaleDateString("en-IN", opts);
  if (startStr === endStr) return startStr;
  return `${startStr} – ${endStr}`;
}

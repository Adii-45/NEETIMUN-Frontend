import { redirect } from "next/navigation";

// This URL predates the multi-event Events system: every registration is
// now scoped to a specific event at /events/:eventId/register, and there is
// no longer a standalone, event-less registration flow. Existing
// links/bookmarks/QR codes pointing here are sent to the Events page to
// choose an event with open registration, rather than being silently
// assigned to one specific event by default.
export default function LegacyRegistrationRedirect() {
  redirect("/events");
}

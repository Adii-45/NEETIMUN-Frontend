import { redirect } from "next/navigation";

// This URL predates the multi-event Events system: every registration is
// now scoped to a specific event at /events/:eventId/register. Existing
// links/bookmarks/QR codes pointing here keep working by redirecting to the
// legacy "NEETI MUN 2026" event's stable slug (seeded by backend migration
// 0010, present in every environment), preserving any ?committee= query
// param.
export default async function LegacyRegistrationRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
  }
  const qs = query.toString();
  redirect(`/events/neeti-mun-2026/register${qs ? `?${qs}` : ""}`);
}

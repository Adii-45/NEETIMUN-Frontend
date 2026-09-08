import type { Metadata } from "next";
import { EventRegisterClient } from "@/components/sections/registration/EventRegisterClient";
import { committees, getCommitteeBySlug } from "@/lib/data/committees";

export const metadata: Metadata = {
  title: "Registration | NEETI MUN",
  description: "Register as a delegate — choose your committee preference and secure your seat.",
};

export default async function EventRegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ committee?: string | string[] }>;
}) {
  const { eventId } = await params;
  const { committee } = await searchParams;
  const requestedSlug = Array.isArray(committee) ? committee[0] : committee;

  // Validate against the single source of truth; fall back to the first
  // committee for missing or unknown slugs (e.g. ?committee=random).
  const initialCommitteeSlug = getCommitteeBySlug(requestedSlug)?.slug ?? committees[0]?.slug ?? "";

  return <EventRegisterClient eventId={eventId} initialCommitteeSlug={initialCommitteeSlug} />;
}

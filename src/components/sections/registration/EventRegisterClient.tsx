"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ApiError } from "@/lib/api/client";
import { getEvent, type Event } from "@/lib/api/events";
import { Hero } from "./Hero";
import { RegistrationForm } from "./RegistrationForm";
import { TrustBadges } from "./TrustBadges";

export function EventRegisterClient({
  eventId,
  initialCommitteeSlug,
}: {
  eventId: string;
  initialCommitteeSlug: string;
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<{ notFound: boolean; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getEvent(eventId)
      .then((data) => {
        if (!cancelled) setEvent(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError({
          notFound: err instanceof ApiError && err.status === 404,
          message: err instanceof ApiError ? err.message : "Could not load this event.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  if (error) {
    return (
      <Container className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl text-navy-900">
          {error.notFound ? "Event Not Found" : "Something Went Wrong"}
        </h1>
        <p className="max-w-md text-sm text-muted">
          {error.notFound
            ? "This event doesn't exist, or is no longer available."
            : error.message}
        </p>
        <Link href="/events" className="text-sm font-medium text-navy-900 underline underline-offset-4">
          Browse all events
        </Link>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-24">
        <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-3xl border border-border bg-cream-200/50" />
      </Container>
    );
  }

  return (
    <>
      <Hero eventTitle={event.title} />
      <section className="pb-20">
        <Container>
          <RegistrationForm
            eventId={event.id}
            eventTitle={event.title}
            initialCommitteeSlug={initialCommitteeSlug}
          />
        </Container>
      </section>
      <TrustBadges />
    </>
  );
}

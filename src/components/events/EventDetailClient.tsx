"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ApiError } from "@/lib/api/client";
import { getEvent, type Event } from "@/lib/api/events";
import { EventDescription } from "./EventDescription";
import { EventStatusBadge } from "./EventStatusBadge";
import { EventCTA } from "./EventCard";
import { formatEventDateRange, formatEventDateTime } from "./formatEventDate";

export function EventDetailClient({ eventId }: { eventId: string }) {
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
      {/* Full-bleed on mobile; from tablet up, centered and aligned to the page content width. */}
      <div className="mx-auto w-full max-w-7xl md:px-6 lg:px-8">
      <div className="relative aspect-[21/9] w-full overflow-hidden bg-navy-900 md:aspect-[16/6]">
        {event.bannerUrl ? (
          <Image src={event.bannerUrl} alt={event.title} fill priority className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700">
            <span className="font-display text-2xl text-cream-50/70">{event.title}</span>
          </div>
        )}
        {/* Overlaid on the hero (not its own row), aligned to the content container. */}
        <div className="absolute inset-x-0 top-3 z-10 sm:top-4">
          <Container>
            <Link
              href="/events"
              aria-label="Back to Events"
              className="group/back inline-flex size-9 items-center justify-center rounded-full border border-cream-50/70 bg-cream-50/90 text-navy-900 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-gold-400 hover:bg-cream-50 hover:text-gold-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 sm:size-10"
            >
              <ChevronLeft
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover/back:-translate-x-0.5 sm:size-5"
              />
            </Link>
          </Container>
        </div>
      </div>
      </div>

      <Container className="flex flex-col gap-8 pb-16 pt-8">
        <div className="flex flex-col gap-4">
          <EventStatusBadge status={event.status} className="w-fit" />
          <h1 className="font-display text-3xl text-navy-900 sm:text-4xl">{event.title}</h1>
          <p className="text-base text-muted">{formatEventDateRange(event.startAt, event.endAt)}</p>
        </div>

        {event.description ? (
          <EventDescription>{event.description}</EventDescription>
        ) : null}

        <dl className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-cream-50/60 p-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide-label text-gold-600">
              Registration Opens
            </dt>
            <dd className="mt-1 text-sm text-navy-900">{formatEventDateTime(event.registrationStartAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide-label text-gold-600">
              Registration Closes
            </dt>
            <dd className="mt-1 text-sm text-navy-900">{formatEventDateTime(event.registrationEndAt)}</dd>
          </div>
        </dl>

        <div>
          <EventCTA event={event} />
        </div>
      </Container>
    </>
  );
}

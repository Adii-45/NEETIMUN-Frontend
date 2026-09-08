"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { listEvents, type Event } from "@/lib/api/events";
import { EventCard } from "./EventCard";
import { CardGrid } from "@/components/ui/motion";
import { FadeUp } from "@/components/ui/motion";

type Buckets = { current: Event[]; upcoming: Event[]; past: Event[] };

/**
 * Current = actionable right now (registration open, or the event is
 * actually underway). Upcoming = hasn't happened yet but isn't currently
 * actionable (registration not open yet, or already closed ahead of the
 * event). Past = concluded. This is a purely presentational grouping of the
 * backend's five authoritative statuses — see event.DeriveStatus.
 */
function bucketEvents(events: Event[]): Buckets {
  const buckets: Buckets = { current: [], upcoming: [], past: [] };
  for (const event of events) {
    switch (event.status) {
      case "registration_open":
      case "ongoing":
        buckets.current.push(event);
        break;
      case "registration_not_open":
      case "registration_closed":
        buckets.upcoming.push(event);
        break;
      case "completed":
        buckets.past.push(event);
        break;
    }
  }
  return buckets;
}

function EventSection({ title, events }: { title: string; events: Event[] }) {
  if (events.length === 0) return null;
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-xl text-navy-900 sm:text-2xl">{title}</h2>
      <CardGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <FadeUp key={event.id} viewportTrigger={false}>
            <EventCard event={event} />
          </FadeUp>
        ))}
      </CardGrid>
    </section>
  );
}

export function EventsBrowser({ className }: { className?: string }) {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    listEvents()
      .then((data) => {
        if (!cancelled) setEvents(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load events.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p role="alert" className={"py-12 text-center text-sm text-red-500 " + (className ?? "")}>
        {error}
      </p>
    );
  }

  if (events === null) {
    return (
      <div className={"flex flex-col gap-6 " + (className ?? "")} aria-busy="true" aria-label="Loading events">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl border border-border bg-cream-200/50" />
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className={"py-12 text-center text-sm text-muted " + (className ?? "")}>
        No events are currently listed. Please check back soon.
      </p>
    );
  }

  const { current, upcoming, past } = bucketEvents(events);

  return (
    <div className={"flex flex-col gap-16 " + (className ?? "")}>
      <EventSection title="Current Events" events={current} />
      <EventSection title="Upcoming Events" events={upcoming} />
      <EventSection title="Past Events" events={past} />
    </div>
  );
}

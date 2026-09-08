import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EventStatusBadge } from "./EventStatusBadge";
import { formatEventDate, formatEventDateRange } from "./formatEventDate";
import type { Event } from "@/lib/api/events";

/** The exact status → CTA mapping used everywhere the public site shows an event. */
export function EventCTA({ event }: { event: Event }) {
  switch (event.status) {
    case "registration_open":
      return (
        <Button href={`/events/${event.slug}/register`} className="w-full sm:w-auto">
          Register Now
        </Button>
      );
    case "registration_not_open":
      return (
        <Button variant="outline" disabled className="w-full cursor-not-allowed opacity-70 sm:w-auto">
          Registration Opens {formatEventDate(event.registrationStartAt)}
        </Button>
      );
    case "registration_closed":
      return (
        <Button href="/contact" variant="outline" className="w-full sm:w-auto">
          Contact Us
        </Button>
      );
    case "ongoing":
      return (
        <Button href={`/events/${event.slug}`} variant="outline" className="w-full sm:w-auto">
          View Details
        </Button>
      );
    case "completed":
      return (
        <Button variant="outline" disabled className="w-full cursor-not-allowed opacity-70 sm:w-auto">
          Event Completed
        </Button>
      );
  }
}

export function EventCard({ event, className }: { event: Event; className?: string }) {
  return (
    <div
      className={
        "group flex flex-col overflow-hidden rounded-3xl border border-border bg-cream-50 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-2xl hover:shadow-navy-900/15 " +
        (className ?? "")
      }
    >
      <Link
        href={`/events/${event.slug}`}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-navy-900"
        aria-label={`View details for ${event.title}`}
      >
        {event.bannerUrl ? (
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700">
            <span className="font-display text-lg text-cream-50/70">{event.title}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <EventStatusBadge status={event.status} />
        </div>
        <Link href={`/events/${event.slug}`} className="focus-visible:outline-none">
          <h3 className="font-display text-xl leading-snug text-navy-900 transition-colors group-hover:text-navy-700">
            {event.title}
          </h3>
        </Link>
        <p className="text-sm text-muted">{formatEventDateRange(event.startAt, event.endAt)}</p>
        {event.description ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">{event.description}</p>
        ) : null}
        <div className="mt-auto pt-2">
          <EventCTA event={event} />
        </div>
      </div>
    </div>
  );
}

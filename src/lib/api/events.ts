import { apiRequest } from "./client";

// Exhaustively partitions time with no gaps/overlap - see the backend's
// event.DeriveStatus for why there's no separate "upcoming" value: any event
// that hasn't started is always in exactly one of the four
// registration_* states below. registration_paused is a server-authoritative,
// admin-initiated temporary suspension (see NEETIMUN-Admin's Registration
// Control) that never touches registrationStartAt/registrationEndAt.
export type EventStatus =
  | "registration_not_open"
  | "registration_open"
  | "registration_paused"
  | "registration_closed"
  | "ongoing"
  | "completed";

export type Event = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  bannerUrl: string | null;
  startAt: string;
  endAt: string;
  registrationStartAt: string;
  registrationEndAt: string;
  status: EventStatus;
};

export type RegistrationStatus = {
  status: EventStatus;
  isRegistrationOpen: boolean;
  registrationStartAt: string;
  registrationEndAt: string;
};

/** Every visible, non-hidden event. No hardcoded list - always live from the database. */
export async function listEvents(): Promise<Event[]> {
  const { data } = await apiRequest<Event[]>("/api/events");
  return data;
}

/**
 * Server-side counterpart of listEvents(), for the /events page's server
 * render: talks to the backend directly (no browser -> Vercel -> backend hop)
 * and lets Next cache the response briefly so most visitors never wait on a
 * backend cold start. Returns null on any failure (or if the backend URL isn't
 * configured) so the client component falls back to its own single fetch.
 */
export async function listEventsServer(revalidateSeconds: number): Promise<Event[] | null> {
  const base = process.env.BACKEND_API_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api/events`, {
      next: { revalidate: revalidateSeconds },
      // Bounded so a cold/unreachable backend can't stall the render or the build.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: Event[] };
    return Array.isArray(body.data) ? body.data : null;
  } catch {
    return null;
  }
}

/** A single event by id or slug. Hidden/nonexistent events both 404 identically. */
export async function getEvent(idOrSlug: string): Promise<Event> {
  const { data } = await apiRequest<Event>(`/api/events/${encodeURIComponent(idOrSlug)}`);
  return data;
}

/**
 * The server-authoritative registration status for one event. This is
 * UX-only: it lets the page show the right CTA without duplicating the
 * open/closed logic, but the backend independently re-derives and enforces
 * the same check before actually accepting a payment/registration.
 */
export async function getRegistrationStatus(idOrSlug: string): Promise<RegistrationStatus> {
  const { data } = await apiRequest<RegistrationStatus>(
    `/api/events/${encodeURIComponent(idOrSlug)}/registration-status`,
  );
  return data;
}

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

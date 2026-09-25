import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { EventsBrowser } from "@/components/events/EventsBrowser";

export const metadata: Metadata = {
  title: "Events | NEETI MUN",
  description: "Browse current, upcoming, and past NEETI MUN events and check registration availability.",
};

export default function EventsPage() {
  return (
    <>
      <section className="bg-cream-100">
        <Container className="flex flex-col items-center gap-6 py-24 text-center sm:py-28">
          <h1 className="animate-fade-up font-display text-4xl text-navy-900 sm:text-5xl">Events</h1>
          <p className="animate-fade-up max-w-xl text-base leading-relaxed text-muted [animation-delay:100ms]">
            Every NEETI MUN conference, in one place - dates, registration availability, and
            how to take part.
          </p>
        </Container>
      </section>
      <section className="pb-24">
        <Container>
          <EventsBrowser />
        </Container>
      </section>
    </>
  );
}

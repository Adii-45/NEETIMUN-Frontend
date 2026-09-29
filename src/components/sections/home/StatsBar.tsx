"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { StatBlock } from "@/components/ui/StatBlock";
import { listEvents } from "@/lib/api/events";
import { stats } from "@/lib/data/stats";

export function StatsBar() {
  // Conference Days is the number of currently available events, from the
  // same source the Events page uses. Shown as a dash until it loads (or if
  // it can't be loaded) rather than a number that might be wrong.
  const [eventCount, setEventCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    listEvents()
      .then((events) => {
        if (!cancelled) setEventCount(events.length);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    ...stats,
    { value: eventCount === null ? "—" : String(eventCount), label: "Conference Days" },
  ];

  return (
    <section className="bg-navy-900">
      <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {items.map((stat) => (
          <StatBlock key={`${stat.label}-${stat.value}`} value={stat.value} label={stat.label} animate />
        ))}
      </Container>
    </section>
  );
}

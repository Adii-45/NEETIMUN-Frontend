"use client";

import { Container } from "@/components/ui/Container";
import { StatBlock } from "@/components/ui/StatBlock";
import { stats } from "@/lib/data/stats";

export function StatsBar() {
  // Conference Days is a fixed display value (the conference runs for 2 days).
  const items = [...stats, { value: "2", label: "Conference Days" }];

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

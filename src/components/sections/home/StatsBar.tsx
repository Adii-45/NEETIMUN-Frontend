import { Container } from "@/components/ui/Container";
import { StatBlock } from "@/components/ui/StatBlock";
import { stats } from "@/lib/data/stats";

export function StatsBar() {
  return (
    <section className="bg-navy-900">
      <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatBlock key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </Container>
    </section>
  );
}

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCircle } from "@/components/ui/IconCircle";
import { cn } from "@/lib/utils";
import { pillars } from "@/lib/data/pillars";

export function Pillars() {
  return (
    <section className="bg-cream-200/60 py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Excellence"
          title="The Pillars of Neeti"
          align="left"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className={cn(
                "flex flex-col gap-4 rounded-2xl border p-8 transition-all duration-300 ease-out",
                pillar.featured
                  ? "border-navy-900 bg-navy-900 text-cream-50 md:-translate-y-4 md:shadow-xl md:shadow-navy-900/20 hover:-translate-y-6 hover:shadow-2xl hover:shadow-navy-900/40 md:hover:-translate-y-6"
                  : "border-border bg-cream-50 text-navy-900 hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-xl hover:shadow-navy-900/10",
              )}
            >
              <IconCircle tone={pillar.featured ? "dark" : "light"}>
                <pillar.icon size={20} />
              </IconCircle>
              <h3 className="font-display text-xl">{pillar.title}</h3>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  pillar.featured ? "text-cream-200/80" : "text-muted",
                )}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

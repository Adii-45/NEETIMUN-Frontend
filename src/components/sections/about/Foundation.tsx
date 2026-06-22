import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCircle } from "@/components/ui/IconCircle";
import { foundation } from "@/lib/data/foundation";

export function Foundation() {
  return (
    <section className="bg-navy-950 py-24">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Our Foundation"
          title="Commitment to Global Citizenship"
          tone="dark"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {foundation.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-2xl border border-cream-50/10 p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold-400/30"
            >
              <IconCircle tone="dark">
                <item.icon size={20} />
              </IconCircle>
              <h3 className="font-display text-xl text-cream-50">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-cream-200/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

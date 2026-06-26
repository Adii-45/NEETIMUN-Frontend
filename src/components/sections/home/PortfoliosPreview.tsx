import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CardGrid, CardReveal, Magnetic } from "@/components/ui/motion";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { committees } from "@/lib/data/committees";

export function PortfoliosPreview() {
  return (
    <section id="portfolios" className="relative py-24">
      <SectionBackdrop variant="gold-bl" range={12} />
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Portfolios"
            title="Council Portfolios"
            subtitle="Six committees for the 2026 iteration."
            align="left"
          />
          <Link
            href="/committees"
            className="flex items-center gap-2 text-sm font-medium text-navy-900 hover:text-gold-600"
          >
            View All Portfolios
            <ArrowRight size={16} />
          </Link>
        </div>

        <CardGrid
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          delayChildren={0.35}
        >
          {committees.map((committee) => (
            <CardReveal key={committee.id}>
              <Magnetic range={2}>
                <Card className="flex h-full flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{committee.tag}</Badge>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {committee.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="gold"
                          className="px-2.5 py-1 text-[10px]"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-display text-lg text-navy-900 transition-transform duration-300 ease-out group-hover:-translate-y-1">
                    {committee.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted transition-transform duration-300 ease-out group-hover:-translate-y-1.5">
                    {committee.shortDescription}
                  </p>
                  {committee.agenda && (
                    <p className="line-clamp-2 text-xs leading-snug text-muted/70 transition-transform duration-300 ease-out group-hover:-translate-y-2">
                      {committee.agenda}
                    </p>
                  )}
                  <Link
                    href={committee.href}
                    className="mt-auto flex items-center gap-2 text-sm font-medium text-gold-600 transition-transform duration-300 ease-out group-hover:-translate-y-2.5"
                  >
                    Explore Committee
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 ease-out group-hover:translate-x-1.5"
                    />
                  </Link>
                </Card>
              </Magnetic>
            </CardReveal>
          ))}
        </CardGrid>
      </Container>
    </section>
  );
}

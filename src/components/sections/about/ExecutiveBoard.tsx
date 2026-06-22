import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { Button } from "@/components/ui/Button";
import { executiveBoard, departmentalHeads } from "@/lib/data/executive-board";

export function ExecutiveBoard() {
  return (
    <section className="bg-cream-200/60 py-24">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="The Executive Board"
            title="Strategic Oversight"
            align="left"
          />
          <Button href="/about" variant="outline">
            Full Board View
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {executiveBoard.map((member) => (
            <ProfileCard key={member.name} {...member} size="md" />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 border-t border-border pt-8">
          <span className="text-xs font-medium uppercase tracking-wide-label text-muted">
            Departmental Heads
          </span>
          <div className="flex items-center gap-6">
            {departmentalHeads.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-display text-xs text-cream-50">
                  {name.charAt(0)}
                </span>
                <span className="text-sm text-navy-900/80">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

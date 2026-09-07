import { Container } from "@/components/ui/Container";
import { TableOfContents } from "@/components/policy/TableOfContents";
import type { PolicySectionMeta } from "@/lib/data/policy";

export function PolicyLayout({
  sections,
  children,
}: {
  sections: PolicySectionMeta[];
  children: React.ReactNode;
}) {
  return (
    <section className="bg-cream-100 pb-24 pt-16 sm:pb-32">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <div className="lg:order-1">
            <TableOfContents sections={sections} />
          </div>
          <div className="max-w-[820px] divide-y divide-border lg:order-2">
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

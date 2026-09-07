"use client";

import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { PolicySectionMeta } from "@/lib/data/policy";

function TocLinks({
  sections,
  active,
  onNavigate,
  className,
}: {
  sections: PolicySectionMeta[];
  active: string | null;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-1", className)}>
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block rounded-lg px-3 py-1.5 text-sm leading-snug transition-colors",
                isActive
                  ? "bg-gold-300/20 text-navy-900 font-medium"
                  : "text-muted hover:bg-cream-200 hover:text-navy-900",
              )}
            >
              {section.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Desktop: sticky sidebar nav. Mobile: native, keyboard-accessible <details> menu. */
export function TableOfContents({ sections }: { sections: PolicySectionMeta[] }) {
  const ids = sections.map((section) => section.id);
  const active = useActiveSection(ids);

  return (
    <>
      <details className="mb-8 rounded-2xl border border-border bg-cream-50 lg:hidden">
        <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-navy-900 [&::-webkit-details-marker]:hidden">
          Table of Contents
        </summary>
        <div className="border-t border-border px-3 pb-3 pt-2">
          <TocLinks sections={sections} active={active} />
        </div>
      </details>

      <nav
        aria-label="Table of contents"
        className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
      >
        <p className="px-3 pb-3 text-xs font-medium uppercase tracking-wide-label text-gold-600">
          On this page
        </p>
        <TocLinks sections={sections} active={active} />
      </nav>
    </>
  );
}

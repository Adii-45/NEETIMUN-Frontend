import { cn } from "@/lib/utils";

/**
 * Premium typographic identity panel for each committee card's left sidebar.
 * The committee abbreviation in Fraunces display serif is the hero element —
 * no icon. Decoration is reduced to a single gold hairline and a thin divider.
 * All hover effects are CSS group-hover, driven by the card's outer `group`.
 */
export function SidebarIdentity({
  abbreviation,
  lines,
  className,
}: {
  abbreviation: string;
  lines: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Dimensions — mobile: full-width banner, desktop: fixed-width column
        "relative flex h-44 shrink-0 flex-col items-center justify-center overflow-hidden lg:h-auto lg:w-64",
        // Background — top-lit vertical gradient; lighter top evokes soft overhead light
        "bg-gradient-to-b from-navy-700 to-navy-950",
        className,
      )}
    >
      {/* Bottom-edge vignette — concentrates depth at the base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% 110%, rgba(5,14,36,0.55) 0%, transparent 70%)",
        }}
      />

      {/* ONE decorative detail: gold hairline at the very top.
          Fades to transparent at both ends — a premium edge highlight. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/28 to-transparent"
      />

      {/* Identity stack — lifts as a unit on card hover */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center gap-4 px-6 text-center",
          "transition-transform duration-300 ease-out group-hover:-translate-y-0.5",
        )}
      >
        {/* Monogram — large Fraunces serif, the focal point */}
        <span
          className={cn(
            "font-display text-5xl leading-none tracking-tight",
            "text-cream-50/90",
            "transition-colors duration-300 ease-out group-hover:text-gold-300",
          )}
        >
          {abbreviation}
        </span>

        {/* Thin gold divider — expands on hover */}
        <span
          aria-hidden
          className={cn(
            "block h-px bg-gold-500/35",
            "w-8 transition-all duration-300 ease-out group-hover:w-12",
          )}
        />

        {/* Editorial subtitle — each line stacked */}
        <div className="flex flex-col items-center gap-0.5">
          {lines.map((line, i) => (
            <span
              key={i}
              className="block font-sans text-[9px] font-medium uppercase tracking-wide-label text-cream-50/35"
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

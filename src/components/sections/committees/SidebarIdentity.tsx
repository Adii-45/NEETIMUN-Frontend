import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editorial identity panel for each committee card's left sidebar.
 * Minimal composition: accent rule → frosted icon badge → abbreviation.
 * All micro-interactions are CSS group-hover, driven by the card's `group`
 * ancestor — no continuous animations.
 */
export function SidebarIdentity({
  icon: Icon,
  abbreviation,
  className,
}: {
  icon: LucideIcon;
  abbreviation: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Dimensions — mobile: horizontal banner, desktop: fixed-width column
        "relative flex h-44 shrink-0 flex-col items-center justify-center overflow-hidden lg:h-auto lg:w-64",
        // Background — subtle top-lit gradient for spatial depth
        "bg-gradient-to-b from-navy-700 to-navy-950",
        className,
      )}
    >
      {/* Edge vignette — darkens the perimeter without adding graphics */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 105%, rgba(5,14,36,0.5) 0%, transparent 70%)",
        }}
      />

      {/* ONE elegant detail: gold hairline at the top edge.
          Fades to transparent at both ends — catches light, not attention. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"
      />

      {/* Identity content — perfectly centered, large negative space above and below */}
      <div className="relative z-10 flex flex-col items-center gap-5">

        {/* Small gold accent rule — frames the badge from above */}
        <span
          aria-hidden
          className="block h-px w-7 bg-gold-500/40"
        />

        {/* Frosted icon badge — lifts 2px on card hover */}
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full",
            // Frosted glass fill over the dark navy
            "bg-white/[0.07]",
            // Single gold outline — thin and precise
            "border border-gold-400/20",
            // Depth: inset top-highlight + bottom-shadow + ambient drop-shadow
            "shadow-[inset_0_1px_0_rgba(201,162,39,0.13),inset_0_-1px_0_rgba(0,0,0,0.22),0_4px_14px_rgba(0,0,0,0.38)]",
            // Hover: rises, shadow deepens
            "transition-all duration-200 ease-out",
            "group-hover:-translate-y-0.5",
            "group-hover:shadow-[inset_0_1px_0_rgba(201,162,39,0.15),inset_0_-1px_0_rgba(0,0,0,0.24),0_8px_22px_rgba(0,0,0,0.48)]",
          )}
        >
          <Icon
            size={22}
            aria-hidden
            className={cn(
              "text-gold-400",
              // Minimal scale on hover — no glow, no pulse
              "transition-transform duration-200 ease-out",
              "group-hover:scale-105",
            )}
          />
        </div>

        {/* Committee abbreviation — wide tracking, understated */}
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold-400/75">
          {abbreviation}
        </span>

        {/* Closing accent — tiny, barely there */}
        <span
          aria-hidden
          className="block h-px w-5 bg-gold-500/20"
        />
      </div>
    </div>
  );
}

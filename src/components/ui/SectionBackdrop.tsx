"use client";

import { Parallax } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

type BackdropVariant = "gold-tr" | "gold-bl" | "navy-tr";

const VARIANT_STYLES: Record<BackdropVariant, string> = {
  "gold-tr": "-right-48 -top-48 bg-gold-400/[0.07]",
  "gold-bl": "-left-48 -bottom-48 bg-gold-400/[0.06]",
  "navy-tr": "-right-48 -top-48 bg-gold-400/[0.07]",
};

export function SectionBackdrop({
  variant = "gold-tr",
  range = 14,
}: {
  variant?: BackdropVariant;
  range?: number;
}) {
  return (
    <Parallax range={range} className="pointer-events-none absolute inset-0">
      <div
        aria-hidden
        className={cn(
          "absolute h-[560px] w-[560px] rounded-full blur-3xl",
          VARIANT_STYLES[variant],
        )}
      />
    </Parallax>
  );
}

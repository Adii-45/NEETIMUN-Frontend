"use client";

import { FadeUp } from "./FadeUp";
import { CARD_SCALE } from "./variants";

/** FadeUp preset for individual cards inside a CardGrid: fade + y + slight scale settle. */
export function CardReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FadeUp viewportTrigger={false} scale={CARD_SCALE} className={className}>
      {children}
    </FadeUp>
  );
}

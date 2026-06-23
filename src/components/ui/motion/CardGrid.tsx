"use client";

import { StaggerContainer } from "./StaggerContainer";
import { CARD_STAGGER } from "./variants";

/** StaggerContainer preset with a pronounced, sequential cascade for card grids. */
export function CardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <StaggerContainer className={className} stagger={CARD_STAGGER}>
      {children}
    </StaggerContainer>
  );
}

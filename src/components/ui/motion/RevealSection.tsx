"use client";

import { Children, isValidElement } from "react";
import { StaggerContainer } from "./StaggerContainer";
import { FadeUp } from "./FadeUp";
import { HEADING_STAGGER, HEADING_SCALE } from "./variants";

/**
 * Wraps a sequence of elements (eyebrow, heading, subtitle, ...) and reveals
 * each one with a staggered fade-up + slight scale settle as the group enters the viewport.
 */
export function RevealSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <StaggerContainer className={className} stagger={HEADING_STAGGER}>
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <FadeUp key={child.key ?? undefined} viewportTrigger={false} scale={HEADING_SCALE}>
            {child}
          </FadeUp>
        ) : (
          child
        ),
      )}
    </StaggerContainer>
  );
}

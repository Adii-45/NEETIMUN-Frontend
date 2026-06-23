"use client";

import { Children, isValidElement } from "react";
import { StaggerContainer } from "./StaggerContainer";
import { FadeUp } from "./FadeUp";

/**
 * Wraps a sequence of elements (eyebrow, heading, subtitle, ...) and reveals
 * each one with a staggered fade-up as the group enters the viewport.
 */
export function RevealSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <StaggerContainer className={className}>
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <FadeUp key={child.key ?? undefined} viewportTrigger={false}>
            {child}
          </FadeUp>
        ) : (
          child
        ),
      )}
    </StaggerContainer>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Entrance-animated stepper. When section enters viewport:
 * step 1 activates (scale pulse), connector grows, step 2 appears, etc.
 * Creates a left-to-right "journey" narrative for onboarding flows.
 */
export function AnimatedStepper({
  steps,
  activeStep = 0,
  className,
}: {
  steps: string[];
  activeStep?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className={cn("flex w-full items-center", className)}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isComplete = index < activeStep;
        const isLast = index === steps.length - 1;

        // Each step node + its following line are staggered at 0.35s intervals.
        const nodeDelay = index * 0.35;
        const lineDelay = nodeDelay + 0.22;

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <motion.span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full font-display text-sm",
                  isActive || isComplete
                    ? "bg-navy-900 text-cream-50"
                    : "border border-border bg-cream-50 text-muted",
                )}
                initial={reduced ? {} : { opacity: 0, scale: 0.75 }}
                animate={
                  reduced
                    ? {}
                    : inView
                      ? {
                          opacity: 1,
                          // Active step: scale-in then pulse to 1.18 and settle
                          scale: isActive ? [0.75, 1, 1.18, 1] : 1,
                        }
                      : { opacity: 0, scale: 0.75 }
                }
                transition={
                  reduced
                    ? {}
                    : {
                        opacity: {
                          duration: 0.5,
                          ease: EASE,
                          delay: nodeDelay,
                        },
                        scale: isActive
                          ? {
                              duration: 0.85,
                              ease: EASE,
                              delay: nodeDelay,
                              times: [0, 0.5, 0.75, 1],
                            }
                          : {
                              duration: 0.55,
                              ease: EASE,
                              delay: nodeDelay,
                            },
                      }
                }
              >
                {index + 1}
              </motion.span>

              <motion.span
                className={cn(
                  "text-xs",
                  isActive ? "font-medium text-navy-900" : "text-muted",
                )}
                initial={reduced ? {} : { opacity: 0 }}
                animate={reduced ? {} : inView ? { opacity: 1 } : { opacity: 0 }}
                transition={
                  reduced
                    ? {}
                    : { duration: 0.4, ease: EASE, delay: nodeDelay + 0.12 }
                }
              >
                {step}
              </motion.span>
            </div>

            {/* Connector line — grows left to right after its preceding node appears */}
            {!isLast && (
              <div className="relative mx-3 h-px flex-1 bg-border">
                <motion.div
                  className={cn(
                    "absolute inset-y-0 left-0 origin-left",
                    isComplete ? "bg-navy-900" : "bg-gold-400",
                  )}
                  initial={reduced ? {} : { scaleX: 0 }}
                  animate={reduced ? {} : inView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={
                    reduced
                      ? {}
                      : { duration: 0.55, ease: EASE, delay: lineDelay }
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

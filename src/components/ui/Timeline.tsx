"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CardGrid } from "@/components/ui/motion/CardGrid";
import { CardReveal } from "@/components/ui/motion/CardReveal";

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

export function Timeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.55"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <motion.div
        className="absolute top-2 bottom-2 left-2 w-px origin-top bg-border sm:left-1/2 sm:-translate-x-1/2"
        style={{ scaleY: reduced ? 1 : lineScale }}
      />
      <CardGrid className="flex flex-col gap-12">
        {items.map((item, index) => {
          const alignEnd = index % 2 === 1;
          return (
            <CardReveal
              key={item.title}
              className={cn(
                "relative flex flex-col gap-2 pl-10 sm:w-1/2 sm:pl-0",
                alignEnd
                  ? "sm:ml-auto sm:items-start sm:pl-10 sm:text-left"
                  : "sm:items-end sm:pr-10 sm:text-right",
              )}
            >
              <span
                className={cn(
                  "absolute top-1.5 left-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-navy-900 bg-cream-50 sm:left-auto",
                  alignEnd ? "sm:-left-1.5" : "sm:-right-1.5 sm:translate-x-1/2",
                )}
              />
              <span className="text-xs font-medium uppercase tracking-wide-label text-gold-600">
                {item.date}
              </span>
              <h3 className="font-display text-xl text-navy-900">{item.title}</h3>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </CardReveal>
          );
        })}
      </CardGrid>
    </div>
  );
}

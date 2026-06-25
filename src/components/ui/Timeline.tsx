"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { CardGrid } from "@/components/ui/motion/CardGrid";
import { CardReveal } from "@/components/ui/motion/CardReveal";

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

function TimelineNode({
  scrollYProgress,
  threshold,
  alignEnd,
  reduced,
  date,
  glowOpacity,
}: {
  scrollYProgress: MotionValue<number>;
  threshold: number;
  alignEnd: boolean;
  reduced: boolean;
  date: string;
  glowOpacity: MotionValue<number>;
}) {
  const fill = useTransform(
    scrollYProgress,
    [threshold - 0.06, threshold],
    [0, 1],
  );
  const backgroundColor = useTransform(
    fill,
    [0, 1],
    ["var(--color-cream-50)", "var(--color-navy-900)"],
  );
  const borderColor = useTransform(
    scrollYProgress,
    [threshold - 0.18, threshold - 0.06],
    ["var(--color-border)", "var(--color-navy-900)"],
  );
  const nodeScale = useTransform(
    scrollYProgress,
    [threshold - 0.07, threshold, threshold + 0.07],
    [1, 1.3, 1],
  );
  const dateOpacity = useTransform(
    scrollYProgress,
    [threshold - 0.18, threshold - 0.04],
    [0.45, 1],
  );

  const nodePositionClass = cn(
    "absolute top-1.5 left-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 sm:left-auto",
    alignEnd ? "sm:-left-1.5" : "sm:-right-1.5 sm:translate-x-1/2",
  );

  // h-8 w-8 (32px) centered at same Y as the 12px node (top-1.5 + 6px = 12px, so top = 12-16 = -4px = -top-1)
  const glowPositionClass = cn(
    "absolute -top-1 left-2 h-8 w-8 -translate-x-1/2 rounded-full bg-gold-400 blur-lg sm:left-auto",
    alignEnd ? "sm:-left-4" : "sm:-right-4 sm:translate-x-1/2",
  );

  if (reduced) {
    return (
      <>
        <span className={cn(nodePositionClass, "border-navy-900 bg-cream-50")} />
        <span className="text-xs font-medium uppercase tracking-wide-label text-gold-600">
          {date}
        </span>
      </>
    );
  }

  return (
    <>
      {/* Glow halo — behind the node dot in paint order */}
      <motion.span
        aria-hidden
        className={glowPositionClass}
        style={{ opacity: glowOpacity }}
      />
      <motion.span
        className={nodePositionClass}
        style={{ backgroundColor, borderColor, scale: nodeScale }}
      />
      <motion.span
        className="text-xs font-medium uppercase tracking-wide-label text-gold-600"
        style={{ opacity: dateOpacity }}
      >
        {date}
      </motion.span>
    </>
  );
}

function TimelineEntry({
  item,
  index,
  total,
  scrollYProgress,
  reduced,
}: {
  item: TimelineItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  reduced: boolean;
}) {
  const alignEnd = index % 2 === 1;
  const threshold = total > 1 ? 0.1 + (index / (total - 1)) * 0.8 : 0.5;

  const titleOpacity = useTransform(
    scrollYProgress,
    [threshold - 0.2, threshold],
    [0.5, 1],
  );
  const descOpacity = useTransform(
    scrollYProgress,
    [threshold - 0.25, threshold],
    [0.35, 0.85],
  );
  const glowOpacity = useTransform(
    scrollYProgress,
    [threshold - 0.07, threshold, threshold + 0.07],
    [0, 0.6, 0],
  );

  return (
    <CardReveal
      direction={alignEnd ? "right" : "left"}
      className={cn(
        "relative flex flex-col gap-2 pl-10 sm:w-1/2 sm:pl-0",
        alignEnd
          ? "sm:ml-auto sm:items-start sm:pl-10 sm:text-left"
          : "sm:items-end sm:pr-10 sm:text-right",
      )}
    >
      <TimelineNode
        scrollYProgress={scrollYProgress}
        threshold={threshold}
        alignEnd={alignEnd}
        reduced={reduced}
        date={item.date}
        glowOpacity={glowOpacity}
      />
      <motion.h3
        className="font-display text-xl text-navy-900"
        style={{ opacity: reduced ? 1 : titleOpacity }}
      >
        {item.title}
      </motion.h3>
      <motion.p
        className="max-w-sm text-sm leading-relaxed text-muted"
        style={{ opacity: reduced ? 1 : descOpacity }}
      >
        {item.description}
      </motion.p>
    </CardReveal>
  );
}

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
      {/* Static base line — shows the full timeline path before scroll fills it */}
      <div className="absolute top-2 bottom-2 left-2 w-px bg-border/50 sm:left-1/2 sm:-translate-x-1/2" />
      {/* Gold fill — grows from top as user scrolls, the visual "pen writing the story" */}
      <motion.div
        className="absolute top-2 bottom-2 left-2 w-px origin-top bg-gold-500 sm:left-1/2 sm:-translate-x-1/2"
        style={{ scaleY: reduced ? 1 : lineScale }}
      />
      <CardGrid className="flex flex-col gap-12">
        {items.map((item, index) => (
          <TimelineEntry
            key={item.title}
            item={item}
            index={index}
            total={items.length}
            scrollYProgress={scrollYProgress}
            reduced={!!reduced}
          />
        ))}
      </CardGrid>
    </div>
  );
}

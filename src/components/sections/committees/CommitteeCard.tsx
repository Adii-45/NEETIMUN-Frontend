"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconCircle } from "@/components/ui/IconCircle";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Viewport used for all section reveals within the card
const VIEWPORT = { once: true, margin: "-50px" } as const;

export function CommitteeCard({
  tag,
  title,
  description,
  icon: Icon,
  badges,
  agenda,
  portfolioTypes,
  href,
  dark = false,
  className,
}: {
  tag: string;
  title: string;
  description: string[];
  icon: LucideIcon;
  badges: string[];
  agenda: string | null;
  portfolioTypes: string[];
  href: string;
  dark?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();

  // Build staggered whileInView props for each content section.
  // Duration collapses to near-zero under reduced motion.
  const sec = (index: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
    transition: {
      duration: reduced ? 0.01 : 0.45,
      ease: EASE,
      delay: reduced ? 0 : index * 0.07,
    },
  });

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 ease-out hover:-translate-y-2 lg:flex-row",
        dark
          ? [
              "border-navy-700/50 bg-navy-900",
              "hover:border-gold-400/25 hover:shadow-[0_28px_64px_-12px_rgba(5,14,36,0.5)]",
            ]
          : [
              "border-navy-900/10 bg-cream-50",
              "hover:border-gold-400/30 hover:shadow-[0_28px_64px_-12px_rgba(10,27,63,0.15)]",
            ],
        className,
      )}
    >
      {/* BBC-only: soft inner radial gradient — warms the deep navy without lightening it */}
      {dark && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 55%, rgba(28,53,102,0.55) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Icon sidebar — full-height column on desktop, banner on mobile */}
      <div
        className={cn(
          "relative z-10 flex h-44 shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br lg:h-auto lg:w-64",
          dark ? "from-navy-600/60 to-navy-800" : "from-navy-800 to-navy-950",
        )}
      >
        {/* Large watermark icon — 5% opacity depth layer */}
        <Icon
          size={128}
          aria-hidden
          className="absolute text-cream-50 opacity-[0.05]"
        />

        {/* Gold radial bloom centered on the icon */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(201,162,39,0.20) 0%, transparent 58%)",
          }}
        />

        {/* Pulsing glow ring — subtle breathing life behind the icon circle */}
        {!reduced && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              width: 100,
              height: 100,
              background:
                "radial-gradient(circle, rgba(201,162,39,0.22) 0%, transparent 68%)",
            }}
            animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.9, 1.1, 0.9] }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Foreground — icon circle + tag label */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <IconCircle tone="dark" className="h-14 w-14">
            <Icon size={22} />
          </IconCircle>
          <span className="text-[11px] font-semibold uppercase tracking-wide-label text-gold-400">
            {tag}
          </span>
        </div>
      </div>

      {/* Content panel */}
      <div className="relative z-10 flex flex-1 flex-col gap-6 p-8 lg:p-10">

        {/* ① Category badge chips */}
        <motion.div {...sec(0)} className="flex flex-wrap gap-2.5">
          {badges.map((badge) => (
            <Badge key={badge} variant={dark ? "dark" : "gold"} className="tracking-wider">
              {badge}
            </Badge>
          ))}
        </motion.div>

        {/* ② Committee title */}
        <motion.h2
          {...sec(1)}
          className={cn(
            "font-display text-2xl tracking-tight lg:text-3xl",
            dark ? "text-cream-50" : "text-navy-900",
          )}
        >
          {title}
        </motion.h2>

        {/* ③ Agenda */}
        {agenda && (
          <motion.div {...sec(2)} className="flex flex-col gap-1.5">
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-wide-label",
                dark ? "text-gold-400" : "text-gold-600",
              )}
            >
              Agenda
            </span>
            <p
              className={cn(
                "text-sm italic leading-6",
                dark ? "text-cream-200/70" : "text-navy-900/65",
              )}
            >
              {agenda}
            </p>
          </motion.div>
        )}

        {/* ④ Description paragraphs */}
        <motion.div {...sec(3)} className="flex flex-col gap-3">
          {description.map((para, i) => (
            <p
              key={i}
              className={cn(
                "text-sm leading-7",
                dark ? "text-cream-200/60" : "text-muted",
              )}
            >
              {para}
            </p>
          ))}
        </motion.div>

        {/* ⑤ Portfolio type chips */}
        {portfolioTypes.length > 0 && (
          <motion.div {...sec(4)} className="flex flex-col gap-2.5">
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-wide-label",
                dark ? "text-gold-400" : "text-gold-600",
              )}
            >
              Portfolio Types
            </span>
            <div className="flex flex-wrap gap-2">
              {portfolioTypes.map((type) => (
                <span
                  key={type}
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide-label transition-all duration-200 ease-out",
                    "hover:-translate-y-px hover:shadow-sm",
                    dark
                      ? "border-cream-50/15 bg-navy-900/40 text-cream-50/80 hover:border-gold-400/40"
                      : "border-navy-900/15 bg-cream-100 text-navy-700 hover:border-gold-400/50",
                  )}
                >
                  {type}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ⑥ CTA buttons */}
        <motion.div
          {...sec(5)}
          className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row"
        >
          <Button href={href} variant={dark ? "outline-light" : "outline"}>
            Study Guide
          </Button>
          <Button href="/registration" variant={dark ? "light" : "primary"}>
            Apply for Portfolio
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

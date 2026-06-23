"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { NavLink } from "@/types";

const HOME_SECTION_IDS = [
  "hero",
  "pillars",
  "portfolios",
  "registration-teaser",
  "roadmap",
  "testimonials",
  "faq",
] as const;

const SECTION_TO_HREF: Record<string, string> = {
  hero: "/",
  pillars: "/",
  portfolios: "/committees",
  "registration-teaser": "/registration",
  roadmap: "/",
  testimonials: "/",
  faq: "/",
};

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const activeSection = useActiveSection(HOME_SECTION_IDS);

  const activeHref =
    pathname === "/" && activeSection
      ? (SECTION_TO_HREF[activeSection] ?? "/")
      : pathname;

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {links.map((link) => {
        const isActive = link.href === activeHref;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative py-1 text-sm font-medium transition-colors ${
              isActive ? "text-navy-900" : "text-navy-900/80 hover:text-navy-900"
            }`}
          >
            {link.label}
            {isActive ? (
              <motion.span
                layoutId="nav-active-indicator"
                className="absolute right-0 -bottom-1 left-0 h-px bg-gold-500"
                transition={
                  reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                }
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

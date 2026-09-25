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

/**
 * Route-aware match, not a bare string compare - every event has its own
 * registration URL (/events/<slug>/register), so the static "Registration"
 * nav link has to recognize the whole family of nested routes, not just the
 * legacy /registration redirect target. Checked before falling back to an
 * exact match so it doesn't affect any other link (Home, About,
 * Committees, Contact, or the homepage's scroll-section synthetic hrefs).
 */
function isNavLinkActive(currentHref: string, linkHref: string): boolean {
  if (linkHref === "/registration") {
    return currentHref === "/registration" || /^\/events\/[^/]+\/register(\/|$)/.test(currentHref);
  }
  if (linkHref === "/events") {
    // The event detail page (/events/<slug>) is still part of "Events";
    // its own /register subroute belongs to "Registration" above instead.
    return currentHref === "/events" || /^\/events\/[^/]+$/.test(currentHref);
  }
  return currentHref === linkHref;
}

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
        const isActive = isNavLinkActive(activeHref, link.href);
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

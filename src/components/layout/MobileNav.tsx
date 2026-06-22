"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { NavLink } from "@/types";

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/15 text-navy-900"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full z-40 border-t border-border bg-cream-50 shadow-lg">
          <nav className="flex flex-col gap-1 px-6 py-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-navy-900 hover:bg-cream-200"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/registration" className="mt-3 w-full">
              Apply Now
            </Button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

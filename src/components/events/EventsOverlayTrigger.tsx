"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { EventsOverlay } from "./EventsOverlay";

/** The Header's quick-access "Events" button — opens the polished overlay in place, without leaving the current page. The full /events page remains separately linkable/navigable from the main nav. */
export function EventsOverlayTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Header lives in the root layout, so it never unmounts on a same-layout
  // client-side navigation (e.g. clicking "Register Now" inside the
  // overlay). Without this, the overlay's own open state survives the
  // route change and stays visually on top of the new page even though
  // navigation itself succeeded underneath. Adjusting state during render
  // (rather than in an effect) closes it in the same commit the route
  // changes, with no extra flash of the stale overlay.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          "inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 " +
          (className ?? "")
        }
      >
        <CalendarDays size={16} />
        Events
      </button>
      <EventsOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}

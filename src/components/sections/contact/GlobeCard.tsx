import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { contactInfo } from "@/lib/data/contact";

export function GlobeCard() {
  return (
    <div className="relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-border bg-cream-50 sm:rounded-3xl">
      {/* Premium header - sits above the map action */}
      <div className="px-5 pb-5 pt-5">
        <span className="text-[10px] font-semibold uppercase tracking-wide-label text-gold-600">
          Campus Location
        </span>
        <h3 className="mt-1.5 font-display text-lg leading-tight text-navy-900">
          Polaris School of Technology
        </h3>
        <p className="mt-1 text-xs text-muted">Whitefield, Bengaluru</p>
      </div>

      {/*
       * Map preview - fills remaining card height. A live Google Maps embed
       * iframe previously lived here, but this app's CSP frame-src only
       * allows the Razorpay checkout domains, so the embed was silently
       * blocked (blank card, no network request); Google's free keyless
       * embed/static-image endpoints have since been retired outright
       * (verified: both now 404), and Google's remaining Maps Static/Embed
       * APIs require a billed API key, which this project deliberately
       * does not introduce. campus-map-preview.png is a real static map
       * snapshot (OpenStreetMap data, openly licensed for reuse with
       * attribution - unlike Google's proprietary tiles) captured once and
       * bundled locally, centered on the same coordinates as the Google
       * Maps destination below. No API, key, iframe, or map library
       * involved - just an image.
       */}
      <Link
        href={contactInfo.mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Polaris School of Technology location on Google Maps"
        className="group relative flex-1 overflow-hidden bg-cream-200"
      >
        <Image
          src="/campus-map-preview.png"
          alt="Map preview of Polaris School of Technology, Whitefield, Bengaluru"
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />

        {/* Marker - overlaid on the map preview, centered on the campus location */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <MapPin
            size={32}
            className="fill-red-500 text-red-700 drop-shadow-md"
            aria-hidden="true"
          />
        </div>

        {/* HQ Live Operations badge - floats above the map preview */}
        <span className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1.5 text-[10px] font-medium tracking-wide text-navy-900/55 ring-1 ring-navy-900/[0.08]">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold-500" />
          HQ Live Operations
        </span>

        {/* Small secondary label */}
        <span className="absolute right-3 top-3 z-10 rounded-full bg-cream-100 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide-label text-navy-900/55 ring-1 ring-navy-900/[0.08]">
          View on Google Maps
        </span>

        {/* Attribution - required by OpenStreetMap's ODbL for reused map data */}
        <span className="absolute bottom-1 right-2 z-10 text-[9px] text-navy-900/40">
          © OpenStreetMap contributors
        </span>
      </Link>
    </div>
  );
}

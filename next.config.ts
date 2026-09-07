import type { NextConfig } from "next";

// Server-only (no NEXT_PUBLIC_ prefix): the real Go backend origin. Never sent
// to the browser — the browser only ever talks to this frontend's own origin.
const BACKEND_API_URL = process.env.BACKEND_API_URL;

// Razorpay Standard Checkout requires these exact origins: checkout.js itself,
// its own risk-detection bundle (loaded from Razorpay's CDN), the checkout
// modal/iframe, and its telemetry beacons. Verified against the actual
// network requests the live checkout flow makes — do not widen this to a
// wildcard "https://*.razorpay.com" without re-checking, and do not remove
// any entry without confirming checkout still opens and completes.
const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com https://cdn.razorpay.com";
const RAZORPAY_CONNECT_SRC =
  "https://checkout.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com";
const RAZORPAY_FRAME_SRC = "https://checkout.razorpay.com https://api.razorpay.com";

// Next.js's App Router (RSC streaming) injects its own inline bootstrap
// scripts and framer-motion sets inline `style` attributes for animations —
// both require 'unsafe-inline' since this app doesn't use a per-request CSP
// nonce. This still blocks the thing that actually matters most: loading any
// *externally hosted* script the app didn't already allow-list, which is the
// typical payload-delivery mechanism for a script-injection vulnerability.
// 'unsafe-eval' is only added in development, where Turbopack's dev/HMR
// runtime needs it; the production build does not.
const isProd = process.env.NODE_ENV === "production";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} ${RAZORPAY_SCRIPT_SRC}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.razorpay.com",
  "font-src 'self' data:",
  `connect-src 'self' ${RAZORPAY_CONNECT_SRC}`,
  `frame-src ${RAZORPAY_FRAME_SRC}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: CSP },
  // HSTS is only meaningful (and only sent) once the app is actually served
  // over HTTPS in production; sending it in local HTTP development would be
  // both ignored by the browser (per spec) and misleading to read.
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" }] : []),
];

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // Backend-for-Frontend proxy: every /api/* request the browser makes stays
  // same-origin (this app's own domain). Next.js forwards it server-side to
  // the Go backend and streams the response — including Set-Cookie — back
  // through this origin. This is what makes the admin session cookie
  // first-party to this frontend, regardless of which domain actually hosts
  // the backend (they are unrelated registrable domains in production:
  // *.vercel.app vs *.onrender.com, so a cookie set directly by the backend
  // can never be a first-party cookie here).
  async rewrites() {
    if (!BACKEND_API_URL) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_API_URL}/api/:path*`,
      },
    ];
  },
  // Applied to every page/asset response from this app. Deliberately
  // excludes /api/* — those responses are proxied from the Go backend
  // (see rewrites() above), which already sets its own appropriate
  // (stricter, JSON-only) security headers on its JSON responses.
  async headers() {
    return [
      {
        source: "/((?!api/).*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

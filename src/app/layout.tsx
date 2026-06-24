import type { Metadata } from "next";
import { ViewTransition } from "react";
import { fraunces, inter } from "@/config/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "NEETI MUN 2026 | Policy. Power. Perspective.",
  description:
    "NEETI MUN 2026 — where future policymakers and global thinkers convene in a simulation that mirrors the intensity of real-world international relations.",
  openGraph: {
    title: "NEETI MUN 2026",
    description:
      "Where future policymakers and global thinkers convene in a simulation that mirrors the intensity of real-world international relations.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ScrollProgress />
        <Header />
        <ViewTransition enter="page-enter" exit="page-exit">
          <main>{children}</main>
        </ViewTransition>
        <Footer />
      </body>
    </html>
  );
}

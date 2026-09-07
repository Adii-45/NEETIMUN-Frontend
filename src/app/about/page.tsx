import type { Metadata } from "next";
import { Hero } from "@/components/sections/about/Hero";
import { Heritage } from "@/components/sections/about/Heritage";
import { Leadership } from "@/components/sections/about/Leadership";
import { ExecutiveBoard } from "@/components/sections/about/ExecutiveBoard";
import { Foundation } from "@/components/sections/about/Foundation";

export const metadata: Metadata = {
  title: "About | NEETI MUN 2026",
  description:
    "Discover the heritage, secretariat leadership, and executive board behind NEETI MUN 2026.",
};

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Heritage />
      <Leadership />
      <ExecutiveBoard />
      <Foundation />
    </>
  );
}

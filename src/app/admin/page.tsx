import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AdminDashboard } from "@/components/sections/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin | NEETI MUN 2026",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="py-24">
      <Container>
        <AdminDashboard />
      </Container>
    </section>
  );
}

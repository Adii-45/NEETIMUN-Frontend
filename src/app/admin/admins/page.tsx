import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AdminManagement } from "@/components/sections/admin/AdminManagement";

export const metadata: Metadata = {
  title: "Admin Management | NEETI MUN 2026",
  robots: { index: false, follow: false },
};

export default function AdminManagementPage() {
  return (
    <section className="py-24">
      <Container>
        <AdminManagement />
      </Container>
    </section>
  );
}

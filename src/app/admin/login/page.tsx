import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AdminLogin } from "@/components/sections/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Admin Sign In | NEETI MUN 2026",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="py-24">
      <Container>
        <AdminLogin />
      </Container>
    </section>
  );
}

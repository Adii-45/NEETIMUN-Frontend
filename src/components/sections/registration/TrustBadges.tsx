import { Calendar, Headphones, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { IconCircle } from "@/components/ui/IconCircle";
import { StaggerContainer, FadeUp } from "@/components/ui/motion";

const badges = [
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Bank-grade encrypted gateway for all transactions.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Reach out for any queries regarding registration.",
  },
  {
    icon: Calendar,
    title: "Key Dates",
    description: "Early bird registrations close Nov 15th, 2025.",
  },
];

export function TrustBadges() {
  return (
    <section className="pb-24">
      <Container as={StaggerContainer} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {badges.map((badge) => (
          <FadeUp key={badge.title} viewportTrigger={false}>
            <Card className="flex h-full flex-col items-center gap-3 text-center">
              <IconCircle>
                <badge.icon size={20} />
              </IconCircle>
              <h3 className="font-display text-lg text-navy-900">
                {badge.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {badge.description}
              </p>
            </Card>
          </FadeUp>
        ))}
      </Container>
    </section>
  );
}

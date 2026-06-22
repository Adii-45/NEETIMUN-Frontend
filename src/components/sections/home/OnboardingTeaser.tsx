import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const steps = ["Portfolio", "Information", "Payment"];

export function OnboardingTeaser() {
  return (
    <section className="py-24">
      <Container className="flex flex-col items-center gap-10">
        <SectionHeading eyebrow="Onboarding" title="Secure Your Seat" />
        <Badge variant="default">Average completion time: Under 2 minutes</Badge>

        <div className="mx-auto flex w-full max-w-lg items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full font-display text-sm",
                    index === 0
                      ? "bg-navy-900 text-cream-50"
                      : "border border-border bg-cream-50 text-muted",
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-xs text-muted">{step}</span>
              </div>
              {index < steps.length - 1 ? (
                <div className="mx-3 h-px flex-1 bg-border" />
              ) : null}
            </div>
          ))}
        </div>

        <Card className="w-full max-w-xl">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide-label text-muted">
                  Primary Committee Preference
                </span>
                <div className="rounded-lg border border-border bg-cream-100 px-4 py-3 text-sm text-navy-900/60">
                  Select Committee
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide-label text-muted">
                  Country Preference
                </span>
                <div className="rounded-lg border border-border bg-cream-100 px-4 py-3 text-sm text-navy-900/60">
                  e.g. France, Japan
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Delegate allotment policy: allocations are based on prior MUN
              experience and the quality of your application profile. Results
              within 48 hours.
            </p>
            <Button href="/registration" className="self-start">
              Continue to Personal Details
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

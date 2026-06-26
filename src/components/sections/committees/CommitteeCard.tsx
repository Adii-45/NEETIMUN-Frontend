import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconCircle } from "@/components/ui/IconCircle";
import { cn } from "@/lib/utils";

export function CommitteeCard({
  tag,
  title,
  description,
  icon: Icon,
  badges,
  agenda,
  portfolioTypes,
  href,
  dark = false,
  className,
}: {
  tag: string;
  title: string;
  description: string[];
  icon: LucideIcon;
  badges: string[];
  agenda: string | null;
  portfolioTypes: string[];
  href: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl lg:flex-row",
        dark
          ? "border-navy-900 bg-navy-900 text-cream-50 hover:border-gold-400/40 hover:shadow-navy-900/50"
          : "border-border bg-cream-50 text-navy-900 hover:border-gold-400/40 hover:shadow-navy-900/15",
        className,
      )}
    >
      {/* Visual panel — horizontal banner on mobile, sidebar on desktop */}
      <div
        className={cn(
          "flex h-40 shrink-0 flex-col items-center justify-center gap-3 bg-gradient-to-br lg:h-auto lg:w-56",
          dark ? "from-navy-700 to-navy-900" : "from-navy-800 to-navy-950",
        )}
      >
        <IconCircle tone="dark" className="h-14 w-14">
          <Icon size={22} />
        </IconCircle>
        <span className="text-xs font-medium uppercase tracking-wide-label text-gold-400">
          {tag}
        </span>
      </div>

      {/* Content panel */}
      <div className="flex flex-1 flex-col gap-5 p-8">
        {/* Category badge chips */}
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge} variant={dark ? "dark" : "gold"}>
              {badge}
            </Badge>
          ))}
        </div>

        {/* Committee title */}
        <h2
          className={cn(
            "font-display text-2xl leading-snug",
            dark ? "text-cream-50" : "text-navy-900",
          )}
        >
          {title}
        </h2>

        {/* Agenda */}
        {agenda && (
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide-label",
                dark ? "text-gold-400" : "text-gold-600",
              )}
            >
              Agenda
            </span>
            <p
              className={cn(
                "text-sm italic leading-relaxed",
                dark ? "text-cream-200/80" : "text-navy-900/80",
              )}
            >
              {agenda}
            </p>
          </div>
        )}

        <hr className={cn(dark ? "border-cream-50/10" : "border-border")} />

        {/* Description paragraphs */}
        <div className="flex flex-col gap-3">
          {description.map((para, i) => (
            <p
              key={i}
              className={cn(
                "text-sm leading-relaxed",
                dark ? "text-cream-200/70" : "text-muted",
              )}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Portfolio types */}
        {portfolioTypes.length > 0 && (
          <div className="flex flex-col gap-2">
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide-label",
                dark ? "text-gold-400" : "text-gold-600",
              )}
            >
              Portfolio Types
            </span>
            <div className="flex flex-wrap gap-2">
              {portfolioTypes.map((type) => (
                <Badge
                  key={type}
                  variant={dark ? "dark" : "outline"}
                  className="px-3 py-1 text-[11px]"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
          <Button href={href} variant={dark ? "outline-light" : "outline"}>
            Study Guide
          </Button>
          <Button href="/registration" variant={dark ? "light" : "primary"}>
            Apply for Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
}

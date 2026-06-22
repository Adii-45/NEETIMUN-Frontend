import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-wide-label",
            tone === "dark" ? "text-gold-400" : "text-gold-600",
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "font-display text-3xl leading-tight sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-cream-50" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed",
            tone === "dark" ? "text-cream-200/80" : "text-muted",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

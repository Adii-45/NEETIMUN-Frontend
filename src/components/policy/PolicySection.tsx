import { cn } from "@/lib/utils";

/**
 * One numbered policy section. The heading id is the TOC anchor target;
 * scroll-mt-28 keeps it clear of the sticky site header (h-20) when linked to.
 */
export function PolicySection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28 py-8 first:pt-0", className)}>
      <h2 className="font-display text-2xl leading-tight text-navy-900 sm:text-[1.75rem]">
        {title}
      </h2>
      <div
        className={cn(
          "mt-4 flex flex-col gap-4",
          "[&_p]:text-base [&_p]:leading-relaxed [&_p]:text-muted",
          "[&_h3]:font-display [&_h3]:text-lg [&_h3]:text-navy-900 [&_h3]:mt-2",
          "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-base [&_ul]:leading-relaxed [&_ul]:text-muted [&_ul]:marker:text-gold-500",
          "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:text-base [&_ol]:leading-relaxed [&_ol]:text-muted [&_ol]:marker:text-gold-600",
          "[&_strong]:font-semibold [&_strong]:text-navy-900",
          "[&_a]:text-navy-900 [&_a]:underline [&_a]:decoration-gold-500 [&_a]:decoration-2 [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-gold-600",
        )}
      >
        {children}
      </div>
    </section>
  );
}

import { Badge } from "@/components/ui/Badge";
import type { EventStatus } from "@/lib/api/events";

const STATUS_LABEL: Record<EventStatus, string> = {
  registration_not_open: "Registration Opens Soon",
  registration_open: "Registration Open",
  registration_paused: "Registration Paused",
  registration_closed: "Registration Closed",
  ongoing: "Happening Now",
  completed: "Completed",
};

const STATUS_VARIANT: Record<EventStatus, "gold" | "default" | "outline" | "dark"> = {
  registration_not_open: "outline",
  registration_open: "gold",
  registration_paused: "outline",
  registration_closed: "default",
  ongoing: "gold",
  completed: "dark",
};

/**
 * Status is always communicated through the label text here, never through
 * color alone (Badge's variant only adds a secondary visual cue) — see the
 * accessibility requirement that visibility/availability never rely solely
 * on color.
 */
export function EventStatusBadge({ status, className }: { status: EventStatus; className?: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

import { committees } from "./committees";

// Homepage stats-bar values. Committees is derived from the canonical
// committee dataset. Delegates and EB Members are temporary fixed values.
// Conference Days is a fixed value set in StatsBar.
export const stats = [
  { value: String(committees.length), label: "Committees" },
  { value: "45", label: "Delegates" },
  { value: "10", label: "EB Members" },
];

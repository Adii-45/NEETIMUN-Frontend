import { committees } from "./committees";

// Homepage stats-bar values. Committees is derived from the canonical
// committee dataset. Prize Pool and EB Members are fixed values.
// Conference Days is a fixed value set in StatsBar.
export const stats = [
  { value: String(committees.length), label: "Committees" },
  { value: "75", suffix: "K+", label: "Prize Pool" },
  { value: "10", label: "EB Members" },
];

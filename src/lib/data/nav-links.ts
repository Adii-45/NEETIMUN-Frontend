import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  // TEMPORARILY HIDDEN: the /about page still exists; restore this line to show it again.
  // { label: "About", href: "/about" },
  { label: "Committees", href: "/committees" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

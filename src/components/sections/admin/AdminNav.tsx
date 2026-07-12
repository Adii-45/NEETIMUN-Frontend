"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/client";
import { getMe, logout, type AdminRole } from "@/lib/api/admin";

/**
 * Top navigation for the admin area. The "Admins" item is shown only to
 * SUPER_ADMINs; regular ADMINs never see it. Pass `role` to skip the extra
 * profile fetch when the parent already knows it.
 */
export function AdminNav({ role: roleProp }: { role?: AdminRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const [fetchedRole, setFetchedRole] = useState<AdminRole | null>(null);
  const role = roleProp ?? fetchedRole;

  useEffect(() => {
    if (roleProp) return; // Parent already knows the role; no fetch needed.
    let active = true;
    getMe()
      .then((me) => {
        if (active) setFetchedRole(me.role);
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          router.replace("/admin/login");
        }
      });
    return () => {
      active = false;
    };
  }, [roleProp, router]);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Redirect regardless of whether the request succeeded.
    }
    router.replace("/admin/login");
  }

  const links = [
    { href: "/admin", label: "Registrations" },
    ...(role === "SUPER_ADMIN"
      ? [{ href: "/admin/admins", label: "Admins" }]
      : []),
  ];

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
      <div className="flex items-center gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                active
                  ? "bg-navy-900 text-cream-50"
                  : "text-navy-900/70 hover:bg-cream-200 hover:text-navy-900",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <Button type="button" variant="outline" onClick={handleLogout}>
        Log Out
      </Button>
    </nav>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PremiumSelect } from "@/components/ui/premium-select";
import { StatBlock } from "@/components/ui/StatBlock";
import { committees } from "@/lib/data/committees";
import { ApiError } from "@/lib/api/client";
import {
  getStats,
  listRegistrations,
  logout,
  updateRegistrationStatus,
  type RegistrationStatus,
  type Stats,
} from "@/lib/api/admin";
import type { Registration } from "@/lib/api/registrations";

const PAGE_SIZE = 25;

const statusFilterOptions = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "cancelled", label: "Cancelled" },
];

const statusUpdateOptions = statusFilterOptions.filter((o) => o.value !== "");

const committeeFilterOptions = [
  { value: "", label: "All Committees" },
  ...committees.map((c) => ({ value: c.tag, label: c.tag })),
];

export function AdminDashboard() {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState("");
  const [committeeFilter, setCommitteeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [list, statsResult] = await Promise.all([
        listRegistrations({
          status: (statusFilter || undefined) as RegistrationStatus | undefined,
          committee: committeeFilter || undefined,
          limit: PAGE_SIZE,
          offset,
        }),
        getStats(),
      ]);
      setRegistrations(list.registrations);
      setTotal(list.total);
      setStats(statsResult);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setLoadError(
        error instanceof ApiError ? error.message : "Could not load registrations.",
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter, committeeFilter, offset, router]);

  useEffect(() => {
    // Standard effect-driven data fetch (no query library in this project);
    // loadData's setState calls happen inside its async body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Even if the request fails, send the admin back to the login screen.
    }
    router.replace("/admin/login");
  }

  async function handleStatusChange(id: string, status: RegistrationStatus) {
    setUpdatingId(id);
    try {
      const updated = await updateRegistrationStatus(id, status);
      setRegistrations((prev) => prev.map((r) => (r.id === id ? updated : r)));
      getStats()
        .then(setStats)
        .catch(() => {});
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace("/admin/login");
        return;
      }
      setLoadError(
        error instanceof ApiError ? error.message : "Could not update status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredRegistrations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.institution.toLowerCase().includes(q),
    );
  }, [registrations, search]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-navy-900">Registrations</h1>
        <Button type="button" variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-cream-50/60 p-6 sm:grid-cols-4">
          <StatBlock tone="light" value={String(stats.total)} label="Total" />
          <StatBlock
            tone="light"
            value={String(stats.byStatus.pending ?? 0)}
            label="Pending"
          />
          <StatBlock
            tone="light"
            value={String(stats.byStatus.confirmed ?? 0)}
            label="Confirmed"
          />
          <StatBlock
            tone="light"
            value={String(stats.byStatus.waitlisted ?? 0)}
            label="Waitlisted"
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-cream-50/60 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-search">Search</Label>
            <Input
              id="admin-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email, institution"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-status-filter">Status</Label>
            <PremiumSelect
              id="admin-status-filter"
              value={statusFilter}
              onValueChange={(value) => {
                setOffset(0);
                setStatusFilter(value);
              }}
              options={statusFilterOptions}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-committee-filter">Committee</Label>
            <PremiumSelect
              id="admin-committee-filter"
              value={committeeFilter}
              onValueChange={(value) => {
                setOffset(0);
                setCommitteeFilter(value);
              }}
              options={committeeFilterOptions}
            />
          </div>
        </div>
        <p className="text-xs text-muted">
          Search filters within the current page of results. Status and committee
          filters query the server.
        </p>

        {loadError ? (
          <p role="alert" className="text-xs text-red-500">
            {loadError}
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide-label text-muted">
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Committee</th>
                <th className="py-3 pr-4 font-medium">Portfolio</th>
                <th className="py-3 pr-4 font-medium">Submitted</th>
                <th className="py-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((registration) => (
                  <tr key={registration.id} className="border-b border-border/60">
                    <td className="py-3 pr-4 text-navy-900">{registration.fullName}</td>
                    <td className="py-3 pr-4 text-navy-900/80">{registration.email}</td>
                    <td className="py-3 pr-4 text-navy-900/80">
                      {registration.committeePreference1}
                    </td>
                    <td className="py-3 pr-4 text-navy-900/80">
                      {registration.portfolio ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-navy-900/80">
                      {new Date(registration.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4">
                      <PremiumSelect
                        value={registration.status}
                        onValueChange={(value) =>
                          handleStatusChange(registration.id, value as RegistrationStatus)
                        }
                        options={statusUpdateOptions}
                        disabled={updatingId === registration.id}
                        className="min-w-[9rem]"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted">
          <span>
            {total === 0
              ? "0 results"
              : `${offset + 1}–${Math.min(offset + PAGE_SIZE, total)} of ${total}`}
          </span>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              disabled={offset === 0 || loading}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOffset((o) => o + PAGE_SIZE)}
              disabled={offset + PAGE_SIZE >= total || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

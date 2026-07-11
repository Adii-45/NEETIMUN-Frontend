"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PremiumSelect } from "@/components/ui/premium-select";
import { ApiError } from "@/lib/api/client";
import {
  createAdmin,
  deleteAdmin,
  getMe,
  listAdmins,
  updateAdmin,
  type Admin,
  type AdminProfile,
  type AdminRole,
} from "@/lib/api/admin";
import { AdminNav } from "./AdminNav";

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "ADMIN" as AdminRole,
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function AdminManagement() {
  const router = useRouter();

  const [me, setMe] = useState<AdminProfile | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [resetId, setResetId] = useState<string | null>(null);
  const [resetValue, setResetValue] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await getMe();
      if (profile.role !== "SUPER_ADMIN") {
        router.replace("/admin");
        return;
      }
      setMe(profile);
      setAdmins(await listAdmins());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (err instanceof ApiError && err.status === 403) {
        router.replace("/admin");
        return;
      }
      setError(errorMessage(err, "Could not load admins."));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      const created = await createAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      setAdmins((prev) => [...prev, created]);
      setForm(emptyForm);
      setShowCreate(false);
    } catch (err) {
      setCreateError(errorMessage(err, "Could not create the admin."));
    } finally {
      setCreating(false);
    }
  }

  async function runRowAction(id: string, action: () => Promise<void>) {
    setBusyId(id);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(errorMessage(err, "Could not update the admin."));
    } finally {
      setBusyId(null);
    }
  }

  function handleRoleChange(admin: Admin, role: AdminRole) {
    if (role === admin.role) return;
    void runRowAction(admin.id, async () => {
      const updated = await updateAdmin(admin.id, { role });
      setAdmins((prev) => prev.map((a) => (a.id === admin.id ? updated : a)));
    });
  }

  function handleToggleActive(admin: Admin) {
    void runRowAction(admin.id, async () => {
      const updated = await updateAdmin(admin.id, { isActive: !admin.isActive });
      setAdmins((prev) => prev.map((a) => (a.id === admin.id ? updated : a)));
    });
  }

  function handleResetPassword(id: string) {
    if (resetValue.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    void runRowAction(id, async () => {
      await updateAdmin(id, { password: resetValue });
      setResetId(null);
      setResetValue("");
    });
  }

  function handleDelete(admin: Admin) {
    if (!window.confirm(`Delete ${admin.email}? This cannot be undone.`)) return;
    void runRowAction(admin.id, async () => {
      await deleteAdmin(admin.id);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminNav role={me?.role} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-navy-900">Admins</h1>
        <Button type="button" onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? "Cancel" : "Add Admin"}
        </Button>
      </div>

      {showCreate ? (
        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-4 rounded-3xl border border-border bg-cream-50/60 p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-admin-name">Name</Label>
              <Input
                id="new-admin-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-admin-email">Email</Label>
              <Input
                id="new-admin-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-admin-password">Password</Label>
              <Input
                id="new-admin-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-admin-role">Role</Label>
              <PremiumSelect
                id="new-admin-role"
                value={form.role}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, role: value as AdminRole }))
                }
                options={roleOptions}
              />
            </div>
          </div>
          {createError ? (
            <p role="alert" className="text-xs text-red-500">
              {createError}
            </p>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-cream-50/60 p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide-label text-muted">
                <th className="py-3 pr-4 font-medium">Name</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Role</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Last Login</th>
                <th className="py-3 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No admins found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const isSelf = me?.id === admin.id;
                  const busy = busyId === admin.id;
                  return (
                    <tr key={admin.id} className="border-b border-border/60 align-top">
                      <td className="py-3 pr-4 text-navy-900">
                        {admin.name}
                        {isSelf ? (
                          <span className="ml-2 text-xs text-muted">(you)</span>
                        ) : null}
                      </td>
                      <td className="py-3 pr-4 text-navy-900/80">{admin.email}</td>
                      <td className="py-3 pr-4">
                        <PremiumSelect
                          value={admin.role}
                          onValueChange={(value) =>
                            handleRoleChange(admin, value as AdminRole)
                          }
                          options={roleOptions}
                          disabled={busy}
                          className="min-w-[9.5rem]"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={
                            admin.isActive
                              ? "text-emerald-700"
                              : "text-muted"
                          }
                        >
                          {admin.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-navy-900/80">
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleToggleActive(admin)}
                            disabled={busy}
                            className="px-3 py-1.5 text-xs"
                          >
                            {admin.isActive ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setResetValue("");
                              setResetId(resetId === admin.id ? null : admin.id);
                            }}
                            disabled={busy}
                            className="px-3 py-1.5 text-xs"
                          >
                            Reset Password
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleDelete(admin)}
                            disabled={busy || isSelf}
                            className="px-3 py-1.5 text-xs text-red-500 hover:text-red-600"
                          >
                            Delete
                          </Button>
                        </div>
                        {resetId === admin.id ? (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Input
                              type="password"
                              autoComplete="new-password"
                              value={resetValue}
                              onChange={(e) => setResetValue(e.target.value)}
                              placeholder="New password (min 8)"
                              className="max-w-[16rem]"
                            />
                            <Button
                              type="button"
                              onClick={() => handleResetPassword(admin.id)}
                              disabled={busy}
                              className="px-3 py-1.5 text-xs"
                            >
                              Save
                            </Button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

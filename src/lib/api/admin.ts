import { apiRequest } from "./client";
import type { Registration } from "./registrations";

export type RegistrationStatus = Registration["status"];

export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

export type Admin = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAdminInput = {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
};

export type UpdateAdminInput = {
  name?: string;
  role?: AdminRole;
  isActive?: boolean;
  password?: string;
};

export type RegistrationListParams = {
  status?: RegistrationStatus | "";
  committee?: string;
  limit?: number;
  offset?: number;
};

export type RegistrationListResult = {
  registrations: Registration[];
  total: number;
  limit: number;
  offset: number;
};

export type Stats = {
  total: number;
  byStatus: Record<string, number>;
  byCommittee: { committee: string; count: number }[];
};

// --- Session (authentication travels in an HTTP-only cookie set by the API) ---

export async function login(
  email: string,
  password: string,
): Promise<AdminProfile> {
  const { data } = await apiRequest<AdminProfile>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data;
}

export async function logout(): Promise<void> {
  await apiRequest<unknown>("/api/admin/logout", { method: "POST" });
}

export async function getMe(): Promise<AdminProfile> {
  const { data } = await apiRequest<AdminProfile>("/api/admin/me");
  return data;
}

// --- Registrations ---

export async function listRegistrations(
  params: RegistrationListParams = {},
): Promise<RegistrationListResult> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.committee) query.set("committee", params.committee);
  query.set("limit", String(params.limit ?? 50));
  query.set("offset", String(params.offset ?? 0));

  const { data, meta } = await apiRequest<Registration[]>(
    `/api/registrations?${query.toString()}`,
  );

  return {
    registrations: data,
    total: Number(meta?.total ?? data.length),
    limit: Number(meta?.limit ?? params.limit ?? 50),
    offset: Number(meta?.offset ?? params.offset ?? 0),
  };
}

export async function getStats(): Promise<Stats> {
  const { data } = await apiRequest<Stats>("/api/registrations/stats");
  return data;
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Promise<Registration> {
  const { data } = await apiRequest<Registration>(
    `/api/registrations/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
  return data;
}

// --- Admin management (SUPER_ADMIN only) ---

export async function listAdmins(): Promise<Admin[]> {
  const { data } = await apiRequest<Admin[]>("/api/admins");
  return data;
}

export async function createAdmin(input: CreateAdminInput): Promise<Admin> {
  const { data } = await apiRequest<Admin>("/api/admins", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data;
}

export async function updateAdmin(
  id: string,
  input: UpdateAdminInput,
): Promise<Admin> {
  const { data } = await apiRequest<Admin>(`/api/admins/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return data;
}

export async function deleteAdmin(id: string): Promise<void> {
  await apiRequest<unknown>(`/api/admins/${id}`, { method: "DELETE" });
}

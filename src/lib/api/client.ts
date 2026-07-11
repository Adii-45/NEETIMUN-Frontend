const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ApiErrorPayload = {
  code: string;
  message: string;
  fields?: Record<string, string>;
};

/** Thrown for any non-2xx response, or when the request can't reach the API. */
export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string>;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.status = status;
    this.code = payload.code;
    this.fields = payload.fields;
  }
}

type Envelope<T> = {
  data?: T;
  error?: ApiErrorPayload;
  meta?: Record<string, unknown>;
};

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  if (!API_URL) {
    throw new ApiError(0, {
      code: "config_error",
      message: "The application is not configured to reach the server.",
    });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      // Send/receive the admin session cookie on cross-origin requests.
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, {
      code: "network_error",
      message: "Could not reach the server. Please check your connection and try again.",
    });
  }

  const body: Envelope<T> | null = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.error ?? {
        code: "unknown_error",
        message: "Something went wrong. Please try again.",
      },
    );
  }

  return { data: body?.data as T, meta: body?.meta };
}

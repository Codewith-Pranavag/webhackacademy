/* ------------------------------------------------------------------ *
 * Real API client — the single seam between the UI and the backend.
 *
 * Talks to the deployed NestJS backend (NEXT_PUBLIC_API_URL) under its
 * URI version prefix (/v1). Attaches the JWT access token, transparently
 * refreshes it on 401 using the rotating refresh token, and normalises
 * backend errors into a typed ApiError.
 * ------------------------------------------------------------------ */

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
  type StoredTokens,
} from "./tokens";

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://webhackacademyapi-production.up.railway.app";

/** e.g. https://…railway.app/v1 */
export const API_BASE = `${RAW_BASE.replace(/\/+$/, "")}/v1`;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Attach the Authorization header + attempt refresh on 401 (default true). */
  auth?: boolean;
  /** Internal — prevents infinite refresh recursion. */
  _retried?: boolean;
}

/**
 * The backend wraps errors as { error: { code, message, details } }.
 * (Falls back to the raw Nest shape { message } for robustness.)
 */
function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;

    // Standard envelope: { error: { message, details } }
    if (p.error && typeof p.error === "object") {
      const err = p.error as Record<string, unknown>;
      if (Array.isArray(err.details) && err.details.length) {
        return err.details.join(", ");
      }
      if (typeof err.message === "string") return err.message;
    }

    // Fallback: raw Nest shape { message: string | string[] }
    if (Array.isArray(p.message)) return p.message.join(", ");
    if (typeof p.message === "string") return p.message;
  }
  return fallback;
}

// Single in-flight refresh shared across concurrent 401s (no stampede).
let refreshInFlight: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        clearTokens();
        return false;
      }
      const data = (await res.json()) as { tokens: StoredTokens };
      if (!data?.tokens?.accessToken) {
        clearTokens();
        return false;
      }
      setTokens(data.tokens);
      return true;
    } catch {
      clearTokens();
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true, _retried = false } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Network error — could not reach the server.");
  }

  // Access token expired → refresh once and retry.
  if (res.status === 401 && auth && !_retried) {
    const ok = await refreshTokens();
    if (ok) {
      return apiRequest<T>(path, { ...options, _retried: true });
    }
  }

  if (res.status === 204) return undefined as T;

  let payload: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      extractMessage(payload, "Something went wrong. Please try again."),
    );
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "DELETE" }),
};

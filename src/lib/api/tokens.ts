/* ------------------------------------------------------------------ *
 * JWT token storage.
 *
 * The backend also sets a httpOnly refresh cookie, but its SameSite=strict
 * scope means it will not travel on cross-origin requests from this app.
 * We therefore persist the refresh token client-side and send it in the
 * request body on /auth/refresh and /auth/logout.
 * ------------------------------------------------------------------ */

const ACCESS_KEY = "wha-access-token";
const REFRESH_KEY = "wha-refresh-token";
const EXPIRES_KEY = "wha-access-expires"; // epoch ms

export interface StoredTokens {
  /** Short-lived JWT access token. */
  accessToken: string;
  /** Seconds until the access token expires (from the backend). */
  accessExpiresIn: number;
  /** Rotating refresh token (opaque). */
  refreshToken: string;
}

const isBrowser = () => typeof window !== "undefined";

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

/** Epoch-ms timestamp at which the current access token expires (or 0). */
export function getAccessExpiry(): number {
  if (!isBrowser()) return 0;
  return Number(window.localStorage.getItem(EXPIRES_KEY) ?? 0);
}

export function setTokens(tokens: StoredTokens): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  window.localStorage.setItem(
    EXPIRES_KEY,
    String(Date.now() + tokens.accessExpiresIn * 1000),
  );
}

export function clearTokens(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  window.localStorage.removeItem(EXPIRES_KEY);
}

export function hasTokens(): boolean {
  return Boolean(getAccessToken() || getRefreshToken());
}

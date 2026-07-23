/* ------------------------------------------------------------------ *
 * Auth service — real calls to the WebHack Academy backend (/v1/auth).
 *
 * JWT access + rotating refresh tokens are persisted by the API client's
 * token store; this module maps the backend's PublicUser onto the app's
 * User type and exposes the auth operations the UI depends on.
 * ------------------------------------------------------------------ */

import { api } from "@/lib/api/client";
import { setTokens, clearTokens, getRefreshToken } from "@/lib/api/tokens";
import type { AuthSession, Role, User } from "@/types";

/** Shape returned by the backend for a user (auth.service.ts::PublicUser). */
interface BackendUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  roles: string[];
  emailVerified: boolean;
  headline?: string;
  joinedAt: string;
}

interface BackendTokens {
  accessToken: string;
  accessExpiresIn: number;
  refreshToken: string;
  tokenType: "Bearer";
}

interface AuthResult {
  user: BackendUser;
  tokens: BackendTokens;
  devVerificationToken?: string;
}

const VALID_ROLES: Role[] = ["student", "instructor", "admin"];

function toUser(u: BackendUser): User {
  const role = (VALID_ROLES as string[]).includes(u.role)
    ? (u.role as Role)
    : "student";
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar ?? "",
    role,
    headline: u.headline,
    joinedAt: u.joinedAt,
    emailVerified: u.emailVerified,
  };
}

function toSession(result: AuthResult): AuthSession {
  setTokens(result.tokens);
  return {
    user: toUser(result.user),
    token: result.tokens.accessToken,
    expiresAt: Date.now() + result.tokens.accessExpiresIn * 1000,
  };
}

export interface LoginInput {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login({ email, password, remember }: LoginInput): Promise<AuthSession> {
    const result = await api.post<AuthResult>(
      "/auth/login",
      { email, password, remember: Boolean(remember) },
      { auth: false },
    );
    return toSession(result);
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    const result = await api.post<AuthResult>("/auth/register", input, {
      auth: false,
    });
    return toSession(result);
  },

  async requestPasswordReset(email: string): Promise<{ status: string }> {
    return api.post<{ status: string }>(
      "/auth/forgot-password",
      { email },
      { auth: false },
    );
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post<void>(
      "/auth/reset-password",
      { token, password },
      { auth: false },
    );
  },

  async verifyEmail(token: string): Promise<{ ok: boolean }> {
    return api.post<{ ok: boolean }>(
      "/auth/verify-email",
      { token },
      { auth: false },
    );
  },

  async resendVerification(): Promise<{ ok: boolean }> {
    return api.post<{ ok: boolean }>("/auth/resend-verification");
  },

  async changePassword(current: string, next: string): Promise<void> {
    await api.post<void>("/auth/change-password", { current, next });
  },

  async me(): Promise<User> {
    const user = await api.get<BackendUser>("/auth/me");
    return toUser(user);
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken() ?? undefined;
    try {
      await api.post<void>("/auth/logout", { refreshToken });
    } finally {
      // Always clear client state even if the network call fails.
      clearTokens();
    }
  },
};

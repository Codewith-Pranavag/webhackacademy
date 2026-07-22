import { mockRequest, mockError } from "@/lib/mock/client";
import { currentUser } from "@/mocks/db";
import type { AuthSession, User } from "@/types";

const SESSION_TTL = 1000 * 60 * 60; // 1 hour

function makeSession(user: User): AuthSession {
  return {
    user,
    token: `mock.jwt.${user.id}.${Math.floor(Math.random() * 1e9)}`,
    expiresAt: Date.now() + SESSION_TTL,
  };
}

export interface LoginInput {
  email: string;
  password: string;
  remember?: boolean;
}

export const authService = {
  /** Simulated login. Use password "locked" to see the account-locked flow. */
  async login({ email, password }: LoginInput): Promise<AuthSession> {
    if (password === "locked") {
      return mockError(423, "Your account has been locked after too many attempts.");
    }
    if (password === "wrong") {
      return mockError(401, "Incorrect email or password.");
    }
    return mockRequest(() => makeSession({ ...currentUser, email }));
  },

  async register(input: { name: string; email: string }): Promise<AuthSession> {
    return mockRequest(() =>
      makeSession({
        ...currentUser,
        name: input.name,
        email: input.email,
        emailVerified: false,
      }),
    );
  },

  async requestPasswordReset(email: string): Promise<{ email: string }> {
    return mockRequest({ email });
  },

  async resetPassword(): Promise<{ ok: true }> {
    return mockRequest({ ok: true });
  },

  async verifyEmail(code: string): Promise<{ ok: boolean }> {
    if (code.length !== 6) return mockError(400, "Invalid verification code.");
    return mockRequest({ ok: true });
  },

  async verifyOtp(code: string): Promise<AuthSession> {
    if (code !== "000000" && code.length === 6) {
      return mockRequest(() => makeSession(currentUser));
    }
    return mockError(401, "Invalid or expired code.");
  },

  async changePassword(): Promise<{ ok: true }> {
    return mockRequest({ ok: true });
  },

  async me(): Promise<User> {
    return mockRequest(currentUser);
  },

  async logout(): Promise<{ ok: true }> {
    return mockRequest({ ok: true }, { delay: 150 });
  },
};

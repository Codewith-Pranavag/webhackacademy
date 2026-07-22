"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService, type LoginInput } from "@/services/auth.service";
import { currentUser } from "@/mocks/db";
import type { AuthSession, Role, User } from "@/types";

type Status = "authenticated" | "unauthenticated" | "expired";

interface AuthState {
  session: AuthSession | null;
  status: Status;
  user: User | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: { name: string; email: string }) => Promise<void>;
  logout: () => Promise<void>;
  expireSession: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
  /** Demo helper: switch the active role to preview instructor/admin areas. */
  switchRole: (role: Role) => void;
}

// Seed an authenticated demo session so the app is immediately explorable.
const seedSession: AuthSession = {
  user: currentUser,
  token: "mock.jwt.seed",
  expiresAt: Date.now() + 1000 * 60 * 60,
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      session: seedSession,
      status: "authenticated",
      user: currentUser,

      async login(input) {
        const session = await authService.login(input);
        set({ session, user: session.user, status: "authenticated" });
      },

      async register(input) {
        const session = await authService.register(input);
        set({ session, user: session.user, status: "authenticated" });
      },

      async logout() {
        await authService.logout();
        set({ session: null, user: null, status: "unauthenticated" });
      },

      expireSession() {
        set({ status: "expired" });
      },

      hasRole(roles) {
        const role = get().user?.role;
        if (!role) return false;
        return Array.isArray(roles) ? roles.includes(role) : roles === role;
      },

      switchRole(role) {
        const user = get().user;
        if (user) set({ user: { ...user, role } });
      },
    }),
    {
      name: "wha-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ session: s.session, user: s.user, status: s.status }),
    },
  ),
);

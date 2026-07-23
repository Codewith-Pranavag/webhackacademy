"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  authService,
  type LoginInput,
  type RegisterInput,
} from "@/services/auth.service";
import { clearTokens, hasTokens } from "@/lib/api/tokens";
import type { Role, User } from "@/types";

type Status = "authenticated" | "unauthenticated" | "expired";

interface AuthState {
  status: Status;
  user: User | null;
  /** True once the initial token validation has completed. */
  hydrated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  /** Validate any persisted tokens against the backend on app load. */
  hydrate: () => Promise<void>;
  expireSession: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      status: "unauthenticated",
      user: null,
      hydrated: false,

      async login(input) {
        const session = await authService.login(input);
        set({ user: session.user, status: "authenticated", hydrated: true });
      },

      async register(input) {
        const session = await authService.register(input);
        set({ user: session.user, status: "authenticated", hydrated: true });
      },

      async logout() {
        await authService.logout();
        set({ user: null, status: "unauthenticated" });
      },

      async hydrate() {
        // No stored tokens → definitely signed out.
        if (!hasTokens()) {
          set({ user: null, status: "unauthenticated", hydrated: true });
          return;
        }
        try {
          const user = await authService.me();
          set({ user, status: "authenticated", hydrated: true });
        } catch {
          clearTokens();
          set({ user: null, status: "unauthenticated", hydrated: true });
        }
      },

      expireSession() {
        set({ status: "expired" });
      },

      hasRole(roles) {
        const role = get().user?.role;
        if (!role) return false;
        return Array.isArray(roles) ? roles.includes(role) : roles === role;
      },
    }),
    {
      name: "wha-auth",
      storage: createJSONStorage(() => localStorage),
      // Persist only the user for an instant first paint; the source of truth
      // is the token store, re-validated via hydrate() on load.
      partialize: (s) => ({ user: s.user, status: s.status }),
    },
  ),
);

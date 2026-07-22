import { mockRequest } from "@/lib/mock/client";
import { notifications } from "@/mocks/db";
import type { Notification } from "@/types";

export const notificationService = {
  async list(): Promise<Notification[]> {
    return mockRequest(() => [...notifications]);
  },
  async markRead(id: string): Promise<{ ok: true }> {
    void id; // wired for the future backend; no-op in the mock
    return mockRequest({ ok: true }, { delay: 150 });
  },
  async markAllRead(): Promise<{ ok: true }> {
    return mockRequest({ ok: true }, { delay: 200 });
  },
};

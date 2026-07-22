"use client";

import { create } from "zustand";
import { notificationService } from "@/services/notification.service";
import type { Notification } from "@/types";

interface NotificationState {
  items: Notification[];
  loading: boolean;
  loaded: boolean;
  unreadCount: () => number;
  load: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotifications = create<NotificationState>((set, get) => ({
  items: [],
  loading: false,
  loaded: false,

  unreadCount: () => get().items.filter((n) => !n.read).length,

  async load() {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    const items = await notificationService.list();
    set({ items, loading: false, loaded: true });
  },

  async markRead(id) {
    set({ items: get().items.map((n) => (n.id === id ? { ...n, read: true } : n)) });
    await notificationService.markRead(id);
  },

  async markAllRead() {
    set({ items: get().items.map((n) => ({ ...n, read: true })) });
    await notificationService.markAllRead();
  },
}));

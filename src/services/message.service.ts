import { mockRequest } from "@/lib/mock/client";
import { conversations } from "@/mocks/db";
import type { Conversation, Message } from "@/types";

export const messageService = {
  async conversations(): Promise<Conversation[]> {
    return mockRequest(() => conversations.map((c) => ({ ...c })));
  },
  async get(id: string): Promise<Conversation | null> {
    return mockRequest(() => conversations.find((c) => c.id === id) ?? null);
  },
  async send(conversationId: string, text: string): Promise<Message> {
    void conversationId;
    return mockRequest(
      () => ({
        id: `m_${Math.floor(Math.random() * 1e9)}`,
        senderId: "u_1",
        text,
        createdAt: new Date().toISOString(),
      }),
      { delay: 250 },
    );
  },
};

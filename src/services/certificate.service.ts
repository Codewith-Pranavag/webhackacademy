import { mockRequest, mockError } from "@/lib/mock/client";
import { certificates } from "@/mocks/db";
import type { Certificate } from "@/types";

export const certificateService = {
  async list(): Promise<Certificate[]> {
    return mockRequest(certificates);
  },
  async get(id: string): Promise<Certificate | null> {
    return mockRequest(() => certificates.find((c) => c.id === id) ?? null);
  },
  async verify(credentialId: string): Promise<Certificate> {
    const found = certificates.find((c) => c.credentialId === credentialId);
    if (!found) return mockError(404, "No certificate found for that credential ID.");
    return mockRequest(found);
  },
};

/* ------------------------------------------------------------------ *
 * Mock API client — the single seam between the UI and the "backend".
 *
 * When a real backend arrives, replace the bodies of the service
 * functions with fetch() calls; the UI contracts stay identical.
 * ------------------------------------------------------------------ */

import type { Paginated } from "@/types";

const BASE_LATENCY = 350; // ms
const JITTER = 350; // ms

/** Deterministic-ish latency so the UI exercises loading states. */
function latency() {
  // Math.random is fine here — this is presentation-only simulation.
  return BASE_LATENCY + Math.floor(Math.random() * JITTER);
}

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
  /** Probability (0-1) that the call fails, to exercise error states. */
  failRate?: number;
  /** Override latency for this call. */
  delay?: number;
}

/**
 * Simulates an async API call resolving with `data` after a delay.
 * Pass `failRate` to occasionally reject with an ApiError.
 */
export function mockRequest<T>(
  data: T | (() => T),
  options: RequestOptions = {},
): Promise<T> {
  const { failRate = 0, delay } = options;
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (failRate > 0 && Math.random() < failRate) {
        reject(new ApiError(500, "Something went wrong. Please try again."));
        return;
      }
      resolve(typeof data === "function" ? (data as () => T)() : data);
    }, delay ?? latency());
  });
}

/** Rejects with a typed ApiError after a delay (for auth failures etc.). */
export function mockError(status: number, message: string, delay?: number) {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new ApiError(status, message)), delay ?? latency());
  });
}

/** Slices an array into a paginated envelope. */
export function paginate<T>(
  all: T[],
  page = 1,
  pageSize = 10,
): Paginated<T> {
  const start = (page - 1) * pageSize;
  return {
    items: all.slice(start, start + pageSize),
    total: all.length,
    page,
    pageSize,
  };
}

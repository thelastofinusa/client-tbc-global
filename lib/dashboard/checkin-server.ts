import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Check-in codes are an HMAC of (service + 30-second window), signed with
 * BETTER_AUTH_SECRET. No database table is needed: the server can recompute
 * the code for the current and previous window and compare.
 */
const WINDOW_MS = 30_000;

function sign(serviceId: string, windowIndex: number): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("Missing BETTER_AUTH_SECRET.");

  return createHmac("sha256", secret)
    .update(`${serviceId}:${windowIndex}`)
    .digest("hex")
    .slice(0, 10)
    .toUpperCase();
}

function same(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function issueCode(serviceId: string, now = Date.now()) {
  const windowIndex = Math.floor(now / WINDOW_MS);
  return {
    code: sign(serviceId, windowIndex),
    /** Accepted until the end of the next window (30–60 seconds). */
    expiresAt: (windowIndex + 2) * WINDOW_MS,
  };
}

export function isValidCode(
  serviceId: string,
  code: string,
  now = Date.now(),
): boolean {
  const windowIndex = Math.floor(now / WINDOW_MS);
  const value = code.trim().toUpperCase();
  return (
    same(value, sign(serviceId, windowIndex)) ||
    same(value, sign(serviceId, windowIndex - 1))
  );
}

/** Today's date in Nigeria, e.g. "2026-11-29". */
export function lagosDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

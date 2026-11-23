/**
 * Check-in codes.
 *
 * The QR code holds a plain link to the dashboard scan page, e.g.
 *   https://site.com/dashboard/scan?service=s_sun&name=Sunday+service
 *     &day=Sunday&time=9%3A00+AM&code=7K2M9QX4TB&exp=1763870000000
 *
 * - Scanning it with the in-dashboard scanner reads the data directly.
 * - Scanning it with a phone's normal camera opens the page and checks in.
 *
 * NOTE: without a database the scanner can only check that the code hasn't
 * expired. Once there is a backend, verify `code` + `service` on the server.
 */

/** How long a code is accepted after it is issued (it rotates every 30s). */
export const CODE_TTL_MS = 45_000;

export interface CheckInData {
  serviceId: string;
  service: string;
  day: string;
  time: string;
  code: string;
  /** Epoch ms after which the code is no longer accepted. */
  expiresAt: number;
}

export const SCAN_PATH = "/dashboard/scan";

export function buildCheckInUrl(origin: string, data: CheckInData): string {
  const params = new URLSearchParams({
    service: data.serviceId,
    name: data.service,
    day: data.day,
    time: data.time,
    code: data.code,
    exp: String(data.expiresAt),
  });
  return `${origin}${SCAN_PATH}?${params.toString()}`;
}

function fromParams(params: URLSearchParams): CheckInData | null {
  const serviceId = params.get("service");
  const code = params.get("code");
  const exp = Number(params.get("exp"));
  if (!serviceId || !code || !Number.isFinite(exp)) return null;

  return {
    serviceId,
    service: params.get("name") ?? "Service",
    day: params.get("day") ?? "",
    time: params.get("time") ?? "",
    code,
    expiresAt: exp,
  };
}

/** Accepts a scanned link, a bare "?service=…" query string, or JSON. */
export function parseCheckIn(text: string): CheckInData | null {
  const value = text.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return fromParams(url.searchParams);
  } catch {
    // not a URL
  }

  if (value.startsWith("?")) return fromParams(new URLSearchParams(value));

  try {
    const json = JSON.parse(value) as Partial<CheckInData>;
    if (json.serviceId && json.code && typeof json.expiresAt === "number") {
      return {
        serviceId: json.serviceId,
        service: json.service ?? "Service",
        day: json.day ?? "",
        time: json.time ?? "",
        code: json.code,
        expiresAt: json.expiresAt,
      };
    }
  } catch {
    // not JSON
  }

  return null;
}

export function isExpired(data: CheckInData, now = Date.now()): boolean {
  return now > data.expiresAt;
}

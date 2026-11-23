import { cookies } from "next/headers";
import type { Member, MemberStatus, Role } from "./types";

/**
 * Until there is a database, role/status changes made by the super admin are
 * kept in a cookie in the super admin's own browser. That is enough to test
 * every role's dashboard. They are only honoured for the super admin (see
 * access.ts), so nobody else can use the cookie to promote themselves.
 */

export const OVERRIDE_COOKIE = "tbcgm_demo_overrides";

export interface Override {
  role?: Role;
  status?: MemberStatus;
  removed?: boolean;
}

export type Overrides = Record<string, Override>;

export async function readOverrides(): Promise<Overrides> {
  const store = await cookies();
  const raw = store.get(OVERRIDE_COOKIE)?.value;
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Overrides;
  } catch {
    return {};
  }
}

export async function writeOverrides(overrides: Overrides): Promise<void> {
  const store = await cookies();
  store.set(OVERRIDE_COOKIE, JSON.stringify(overrides), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearOverrides(): Promise<void> {
  const store = await cookies();
  store.delete(OVERRIDE_COOKIE);
}

/**
 * Applies overrides to the sample members. People still waiting for approval
 * start with the role they asked for, so approving simply confirms it.
 */
export function applyOverrides(
  members: Member[],
  overrides: Overrides,
): Member[] {
  return members
    .filter((m) => !overrides[m.email.toLowerCase()]?.removed)
    .map((m) => {
      const o = overrides[m.email.toLowerCase()];
      const status = o?.status ?? m.status;
      const role = o?.role ?? (status === "pending" ? m.requestedRole : m.role);
      return { ...m, role, status };
    });
}

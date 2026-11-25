import { cookies } from "next/headers";
import { ROLES } from "./roles";
import type { Role } from "./types";

/**
 * Super admins can preview the dashboard as another role. The choice lives in
 * a cookie in their own browser and is only honoured for real super admins
 * (see access.ts). It never changes anyone's role in the database.
 */
export const PREVIEW_COOKIE = "tbcg_preview_role";

export async function readPreviewRole(): Promise<Role | null> {
  const store = await cookies();
  const value = store.get(PREVIEW_COOKIE)?.value;
  return value && (ROLES as string[]).includes(value) ? (value as Role) : null;
}

"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "./access";
import { clearOverrides, readOverrides, writeOverrides } from "./overrides";
import { ROLES } from "./roles";
import type { MemberStatus, Role } from "./types";

// TODO: replace the cookie store with database writes. Keep the
// requireSuperAdmin() call as the first line of every action.

async function patch(
  email: string,
  change: { role?: Role; status?: MemberStatus; removed?: boolean },
) {
  const key = email.toLowerCase();
  const overrides = await readOverrides();
  overrides[key] = { ...overrides[key], ...change };
  await writeOverrides(overrides);
  revalidatePath("/dashboard", "layout");
}

export async function setMemberRole(email: string, role: Role) {
  await requireSuperAdmin();
  if (!ROLES.includes(role)) throw new Error("Unknown role.");
  await patch(email, { role });
}

export async function approveMember(email: string, role: Role) {
  await requireSuperAdmin();
  if (!ROLES.includes(role)) throw new Error("Unknown role.");
  await patch(email, { role, status: "approved" });
}

export async function setMemberStatus(email: string, status: MemberStatus) {
  await requireSuperAdmin();
  await patch(email, { status });
}

export async function removeMember(email: string) {
  await requireSuperAdmin();
  await patch(email, { removed: true });
}

export async function resetSampleData() {
  await requireSuperAdmin();
  await clearOverrides();
  revalidatePath("/dashboard", "layout");
}

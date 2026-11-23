"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/db";
import { communities, type Community, user as userTable } from "~/db/schema";
import { requireAuth, requireSuperAdmin } from "./access";
import { clearOverrides, readOverrides, writeOverrides } from "./overrides";
import { ROLES } from "./roles";
import type { MemberStatus, Role } from "./types";

/* ─────────────────────────────────────────────────────────────
 * User Profile Actions
 * ───────────────────────────────────────────────────────────── */

export async function updateUserProfile(data: {
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  address?: string;
  birthday?: string;
}) {
  const viewer = await requireAuth();

  const name = data.name.trim() || viewer.fullName;
  const firstName =
    data.firstName?.trim() || name.split(" ")[0] || viewer.firstName;
  const lastName =
    data.lastName?.trim() ||
    name.split(" ").slice(1).join(" ") ||
    viewer.lastName;

  await db
    .update(userTable)
    .set({
      name,
      firstName,
      lastName,
      phone: data.phone?.trim() ?? "",
      location: data.location?.trim() ?? "",
      address: data.address?.trim() ?? "",
      birthday: data.birthday?.trim() ?? "",
      updatedAt: new Date(),
    })
    .where(eq(userTable.id, viewer.id));

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/settings");

  return { success: true };
}

/* ─────────────────────────────────────────────────────────────
 * Community Channel Actions (Database Backed)
 * ───────────────────────────────────────────────────────────── */

export async function getCommunities(): Promise<Community[]> {
  try {
    const list = await db
      .select()
      .from(communities)
      .orderBy(asc(communities.createdAt));

    // Seed defaults if table is empty
    if (list.length === 0) {
      const defaults = [
        {
          id: "comm_whatsapp",
          name: "WhatsApp Community",
          description:
            "Daily fellowship updates, reminders, and announcements.",
          href: "https://chat.whatsapp.com/",
          icon: "whatsapp",
          badge: "Active",
        },
        {
          id: "comm_telegram",
          name: "Telegram Channel",
          description: "Broadcasts, event notes, and shared resources.",
          href: "https://t.me/",
          icon: "telegram",
          badge: "Channel",
        },
        {
          id: "comm_forum",
          name: "Member & Volunteer Forum",
          description:
            "Coordinate serving, outreach, and small-group check-ins.",
          href: "https://chat.whatsapp.com/",
          icon: "users",
          badge: "Members",
        },
      ];

      await db.insert(communities).values(defaults);
      return await db
        .select()
        .from(communities)
        .orderBy(asc(communities.createdAt));
    }

    return list;
  } catch (err) {
    console.error("Error fetching communities:", err);
    return [];
  }
}

export async function addCommunity(data: {
  name: string;
  description: string;
  href: string;
  icon?: string;
  badge?: string;
}) {
  await requireSuperAdmin();

  if (!data.name.trim() || !data.href.trim()) {
    throw new Error("Community name and link are required.");
  }

  const id = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  await db.insert(communities).values({
    id,
    name: data.name.trim(),
    description: data.description.trim(),
    href: data.href.trim(),
    icon: data.icon || "message",
    badge: data.badge?.trim() || "Active",
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function deleteCommunity(id: string) {
  await requireSuperAdmin();

  await db.delete(communities).where(eq(communities.id, id));

  revalidatePath("/dashboard/settings");
  return { success: true };
}

/* ─────────────────────────────────────────────────────────────
 * Member Management Actions
 * ───────────────────────────────────────────────────────────── */

async function patch(
  email: string,
  change: { role?: Role; status?: MemberStatus; removed?: boolean },
) {
  const key = email.toLowerCase();
  const overrides = await readOverrides();
  overrides[key] = { ...overrides[key], ...change };
  await writeOverrides(overrides);

  // Sync to database if user exists in db
  try {
    const updateData: Record<string, unknown> = {};
    if (change.role) updateData.role = change.role;
    if (change.status) updateData.status = change.status;

    if (Object.keys(updateData).length > 0) {
      await db
        .update(userTable)
        .set(updateData)
        .where(eq(userTable.email, key));
    }
  } catch (err) {
    console.error("Failed to sync role change to database:", err);
  }

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

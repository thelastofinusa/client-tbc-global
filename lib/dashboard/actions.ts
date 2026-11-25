"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db } from "~/db";
import {
  type Community,
  communities,
  submissions,
  user as userTable,
} from "~/db/schema";
import { requireAccess, requireAuth, requireSuperAdmin } from "./access";
import { PREVIEW_COOKIE } from "./preview";
import { ROLES } from "./roles";
import type { MemberStatus, Role, SubmissionStatus } from "./types";

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
      // const defaults = [
      //   {
      //     id: "comm_whatsapp",
      //     name: "WhatsApp Community",
      //     description:
      //       "Daily fellowship updates, reminders, and announcements.",
      //     href: "https://chat.whatsapp.com/",
      //     icon: "whatsapp",
      //     badge: "Active",
      //   },
      //   {
      //     id: "comm_telegram",
      //     name: "Telegram Channel",
      //     description: "Broadcasts, event notes, and shared resources.",
      //     href: "https://t.me/",
      //     icon: "telegram",
      //     badge: "Channel",
      //   },
      //   {
      //     id: "comm_forum",
      //     name: "Member & Volunteer Forum",
      //     description:
      //       "Coordinate serving, outreach, and small-group check-ins.",
      //     href: "https://chat.whatsapp.com/",
      //     icon: "users",
      //     badge: "Members",
      //   },
      // ];

      // await db.insert(communities).values(defaults);
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
 * Member Management Actions (super admin only, stored in Neon)
 * ───────────────────────────────────────────────────────────── */

async function updateMember(
  email: string,
  change: { role?: Role; status?: MemberStatus },
) {
  const viewer = await requireSuperAdmin();
  const key = email.toLowerCase();
  const isSelf = key === viewer.email.toLowerCase();

  if (isSelf) {
    // Allow approving yourself as super_admin, while still blocking demoting yourself
    // or locking yourself out with "suspended".
    const locksSelfOut =
      change.status === "suspended" ||
      (change.role !== undefined && change.role !== "super_admin");

    if (locksSelfOut) {
      throw new Error(
        "You can't demote or suspend your own account. Use “View as” to preview other roles.",
      );
    }
  }

  await db.update(userTable).set(change).where(eq(userTable.email, key));
  revalidatePath("/dashboard", "layout");
}

export async function setMemberRole(email: string, role: Role) {
  if (!ROLES.includes(role)) throw new Error("Unknown role.");
  await updateMember(email, { role });
}

export async function approveMember(email: string, role: Role) {
  if (!ROLES.includes(role)) throw new Error("Unknown role.");
  await updateMember(email, { role, status: "approved" });
}

export async function setMemberStatus(email: string, status: MemberStatus) {
  await updateMember(email, { status });
}

/** Declines a registration or removes a member (their sessions and check-ins go with them). */
export async function removeMember(email: string) {
  const viewer = await requireSuperAdmin();
  const key = email.toLowerCase();

  if (key === viewer.email.toLowerCase()) {
    throw new Error("You can't remove your own account here.");
  }

  const [target] = await db
    .select({ role: userTable.role })
    .from(userTable)
    .where(eq(userTable.email, key))
    .limit(1);

  if (target?.role === "super_admin") {
    throw new Error("Super admins can't be removed from the dashboard.");
  }

  await db.delete(userTable).where(eq(userTable.email, key));
  revalidatePath("/dashboard", "layout");
}

/* ─────────────────────────────────────────────────────────────
 * "View as" preview (cookie only, never touches the database)
 * ───────────────────────────────────────────────────────────── */

export async function setPreviewRole(role: Role) {
  const viewer = await requireSuperAdmin();
  if (!ROLES.includes(role)) throw new Error("Unknown role.");

  const store = await cookies();
  if (role === viewer.baseRole) {
    store.delete(PREVIEW_COOKIE);
  } else {
    store.set(PREVIEW_COOKIE, role, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }

  revalidatePath("/dashboard", "layout");
}

/* ─────────────────────────────────────────────────────────────
 * Sponsor / partner requests
 * ───────────────────────────────────────────────────────────── */

const SUBMISSION_STATUSES: SubmissionStatus[] = [
  "new",
  "in_review",
  "active",
  "declined",
];

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
) {
  if (!SUBMISSION_STATUSES.includes(status)) throw new Error("Unknown status.");

  const [row] = await db
    .select({ type: submissions.type })
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);

  if (!row) throw new Error("That request no longer exists.");

  await requireAccess(row.type === "partner" ? "partners" : "sponsors");
  await db.update(submissions).set({ status }).where(eq(submissions.id, id));

  revalidatePath("/dashboard/sponsors");
  revalidatePath("/dashboard/partners");
}

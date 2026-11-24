import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";
import { db } from "~/db";
import { user as userTable } from "~/db/schema";
import { auth } from "~/lib/auth/auth";
import { members as sampleMembers } from "./mock-data";
import { readOverrides } from "./overrides";
import { ROLES } from "./roles";
import type { Member, Role } from "./types";

export interface DashboardViewer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  imageUrl: string;
  initials: string;
  phone: string;
  location: string;
  address: string;
  birthday: string;
  /** The role whose dashboard is shown right now. */
  role: Role;
  /** The role the account really has in the database. Super admins can preview other roles. */
  baseRole: Role;
  /** Matching sample member, if any (replace with a DB lookup later). */
  member: Member | null;
}

async function withDbRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 150,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * (attempt + 1)),
      );
    }
  }
  throw lastError;
}

function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

function superAdminEmails(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Retrieves the current dashboard viewer from the database.
 * Returns null when signed out.
 *
 * Role hierarchy:
 *  1. Database user `role` column (stored in the database)
 *  2. If the user's email matches SUPER_ADMIN_EMAILS and DB is not super_admin,
 *     we automatically sync & persist `super_admin` in the database so it's backed by DB.
 *  3. Default fallback: "attendee"
 */
export const getDashboardViewer = cache(
  async (): Promise<DashboardViewer | null> => {
    await connection();

    const requestHeaders = await headers();
    let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;

    try {
      session = await withDbRetry(() =>
        auth.api.getSession({
          headers: requestHeaders,
        }),
      );
    } catch {
      return null;
    }

    if (!session?.user) return null;

    // Fetch the freshest user record directly from the database
    let [dbUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    // Fallback lookup by email if not found by id
    if (!dbUser && session.user.email) {
      [dbUser] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, session.user.email))
        .limit(1);
    }

    const email = dbUser?.email ?? session.user.email ?? "";
    const emailKey = email.toLowerCase();

    // Check if the user is in SUPER_ADMIN_EMAILS and sync to database if not yet marked
    if (
      dbUser &&
      superAdminEmails().includes(emailKey) &&
      dbUser.role !== "super_admin"
    ) {
      try {
        await db
          .update(userTable)
          .set({ role: "super_admin" })
          .where(eq(userTable.id, dbUser.id));
        dbUser.role = "super_admin";
      } catch (err) {
        console.error("Failed to sync super_admin role to database:", err);
      }
    }

    const fullName =
      dbUser?.name ||
      [dbUser?.firstName, dbUser?.lastName].filter(Boolean).join(" ") ||
      session.user.name ||
      "Member";

    const initials =
      fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "MB";

    const sample =
      sampleMembers.find((m) => m.email.toLowerCase() === emailKey) ?? null;

    // The user's role comes from the database!
    let baseRole: Role = "attendee";
    if (dbUser && isRole(dbUser.role)) {
      baseRole = dbUser.role;
    } else if (superAdminEmails().includes(emailKey)) {
      baseRole = "super_admin";
    } else if (sample && sample.status !== "pending") {
      baseRole = sample.role;
    }

    // Super admins can temporarily preview another role via header switcher
    const overrides = baseRole === "super_admin" ? await readOverrides() : {};
    const role = overrides[emailKey]?.role ?? baseRole;

    const firstName = dbUser?.firstName || (fullName.split(" ")[0] ?? "there");
    const lastName =
      dbUser?.lastName || (fullName.split(" ").slice(1).join(" ") ?? "");

    return {
      id: dbUser?.id ?? session.user.id,
      firstName,
      lastName,
      fullName,
      email,
      imageUrl: dbUser?.image ?? session.user.image ?? "",
      initials,
      phone: dbUser?.phone ?? "",
      location: dbUser?.location ?? "",
      address: dbUser?.address ?? "",
      birthday: dbUser?.birthday ?? "",
      role,
      baseRole,
      member: sample,
    };
  },
);

/**
 * Call at the top of every server action / route handler that changes data.
 * Checks the REAL baseRole in the database.
 */
export async function requireSuperAdmin(): Promise<DashboardViewer> {
  const viewer = await getDashboardViewer();
  if (viewer?.baseRole !== "super_admin") {
    throw new Error("Forbidden: super admin only.");
  }
  return viewer;
}

/**
 * Retrieves the current authenticated user or throws an unauthorized error.
 */
export async function requireAuth(): Promise<DashboardViewer> {
  const viewer = await getDashboardViewer();
  if (!viewer) {
    throw new Error("Unauthorized: Please sign in.");
  }
  return viewer;
}

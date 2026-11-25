import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";
import { db } from "~/db";
import { user as userTable } from "~/db/schema";
import { auth } from "~/lib/auth/auth";
import { canAccess, type DashboardSection } from "./access-control";
import { readPreviewRole } from "./preview";
import { ROLES } from "./roles";
import type { MemberStatus, Role } from "./types";

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
  status: MemberStatus;
  requestedRole: Role;
  emailVerified: boolean;
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

function isStatus(value: unknown): value is MemberStatus {
  return value === "pending" || value === "approved" || value === "suspended";
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
 * The role always comes from the `user.role` column. Emails listed in
 * SUPER_ADMIN_EMAILS are promoted to super_admin once, but only when the
 * email is verified (Google verifies it), so nobody can claim that role by
 * typing someone else's address into the sign-up form.
 */
export const getDashboardViewer = cache(
  async (): Promise<DashboardViewer | null> => {
    await connection();

    const requestHeaders = await headers();
    let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;

    try {
      session = await withDbRetry(() =>
        auth.api.getSession({ headers: requestHeaders }),
      );
    } catch (err) {
      // Don't hide this: a failing database would otherwise look like "signed out".
      console.error("Dashboard session lookup failed:", err);
      return null;
    }

    if (!session?.user) return null;

    const [dbUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    if (!dbUser) return null;

    const email = dbUser.email;
    const emailKey = email.toLowerCase();

    if (
      dbUser.emailVerified &&
      superAdminEmails().includes(emailKey) &&
      dbUser.role !== "super_admin"
    ) {
      try {
        await db
          .update(userTable)
          .set({ role: "super_admin", status: "approved" })
          .where(eq(userTable.id, dbUser.id));
        dbUser.role = "super_admin";
        dbUser.status = "approved";
      } catch (err) {
        console.error("Failed to promote super admin:", err);
      }
    }

    const fullName =
      dbUser.name ||
      [dbUser.firstName, dbUser.lastName].filter(Boolean).join(" ") ||
      "Member";

    const initials =
      fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "MB";

    const baseRole: Role = isRole(dbUser.role) ? dbUser.role : "attendee";
    const preview = baseRole === "super_admin" ? await readPreviewRole() : null;

    return {
      id: dbUser.id,
      firstName: dbUser.firstName || (fullName.split(" ")[0] ?? "there"),
      lastName: dbUser.lastName || fullName.split(" ").slice(1).join(" "),
      fullName,
      email,
      imageUrl: dbUser.image ?? "",
      initials,
      phone: dbUser.phone ?? "",
      location: dbUser.location ?? "",
      address: dbUser.address ?? "",
      birthday: dbUser.birthday ?? "",
      role: preview ?? baseRole,
      baseRole,
      status: isStatus(dbUser.status) ? dbUser.status : "pending",
      requestedRole: isRole(dbUser.requestedRole)
        ? dbUser.requestedRole
        : "attendee",
      emailVerified: dbUser.emailVerified,
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

/** Requires a signed-in, non-suspended user. */
export async function requireAuth(): Promise<DashboardViewer> {
  const viewer = await getDashboardViewer();
  if (!viewer) {
    throw new Error("Unauthorized: Please sign in.");
  }
  if (viewer.baseRole !== "super_admin" && viewer.status === "suspended") {
    throw new Error("Forbidden: this account is suspended.");
  }
  return viewer;
}

/** Requires the REAL role to be allowed on a dashboard section. */
export async function requireAccess(
  section: DashboardSection,
): Promise<DashboardViewer> {
  const viewer = await requireAuth();
  if (!canAccess(viewer.baseRole, section)) {
    throw new Error("Forbidden: your role can't do this.");
  }
  return viewer;
}

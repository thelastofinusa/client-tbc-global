import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { members as sampleMembers } from "./mock-data";
import { readOverrides } from "./overrides";
import { ROLES } from "./roles";
import type { Member, Role } from "./types";

export interface DashboardViewer {
  firstName: string;
  fullName: string;
  email: string;
  imageUrl: string;
  initials: string;
  /** The role whose dashboard is shown right now. */
  role: Role;
  /** The role the account really has. Super admins can preview other roles. */
  baseRole: Role;
  /** Matching sample member, if any (replace with a DB lookup later). */
  member: Member | null;
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
 * Who is looking at the dashboard? Returns null when signed out.
 *
 * Base role, first match wins:
 *  1. Clerk `publicMetadata.role`
 *  2. email listed in SUPER_ADMIN_EMAILS  -> super_admin
 *  3. email found in the sample members   -> that member's role
 *  4. anyone else (every new registration) -> attendee
 *
 * A super admin can preview another role (header switcher / Members table).
 * That choice is stored in a cookie and is ignored for everyone else.
 */
export const getDashboardViewer = cache(
  async (): Promise<DashboardViewer | null> => {
    const user = await currentUser();
    if (!user) return null;

    const email =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      "";
    const emailKey = email.toLowerCase();

    const fullName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
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

    const metadataRole = user.publicMetadata?.role;
    let baseRole: Role = "attendee";
    if (superAdminEmails().includes(emailKey)) baseRole = "super_admin";
    else if (isRole(metadataRole)) baseRole = metadataRole;
    else if (sample && sample.status !== "pending") baseRole = sample.role;

    const overrides = baseRole === "super_admin" ? await readOverrides() : {};
    const role = overrides[emailKey]?.role ?? baseRole;

    return {
      firstName: user.firstName ?? fullName.split(" ")[0] ?? "there",
      fullName,
      email,
      imageUrl: user.imageUrl,
      initials,
      role,
      baseRole,
      member: sample,
    };
  },
);

/**
 * Call at the top of every server action / route handler that changes data.
 * It checks the REAL role, so a super admin who is previewing another role can
 * still switch back.
 */
export async function requireSuperAdmin(): Promise<DashboardViewer> {
  const viewer = await getDashboardViewer();
  if (viewer?.baseRole !== "super_admin") {
    throw new Error("Forbidden: super admin only.");
  }
  return viewer;
}

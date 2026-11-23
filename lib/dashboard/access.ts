import { currentUser } from "@clerk/nextjs/server";

export interface DashboardViewer {
  firstName: string;
  fullName: string;
  email: string;
  imageUrl: string;
  initials: string;
  isSuperAdmin: boolean;
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
 * A user is a super admin when EITHER:
 *  - their Clerk `publicMetadata.role` is "super_admin", or
 *  - their email is listed in the SUPER_ADMIN_EMAILS env var (comma separated).
 */
export async function getDashboardViewer(): Promise<DashboardViewer | null> {
  const user = await currentUser();
  if (!user) return null;

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";

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

  const isSuperAdmin =
    user.publicMetadata?.role === "super_admin" ||
    superAdminEmails().includes(email.toLowerCase());

  return {
    firstName: user.firstName ?? fullName.split(" ")[0] ?? "there",
    fullName,
    email,
    imageUrl: user.imageUrl,
    initials,
    isSuperAdmin,
  };
}

/**
 * Call this at the top of every server action / route handler that changes
 * data. The dashboard layout only guards rendering; mutations must re-check.
 */
export async function requireSuperAdmin(): Promise<DashboardViewer> {
  const viewer = await getDashboardViewer();
  if (!viewer?.isSuperAdmin) {
    throw new Error("Forbidden: super admin only.");
  }
  return viewer;
}

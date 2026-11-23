import type { Role } from "./types";

export type DashboardSection =
  | "overview"
  | "scan"
  | "my-attendance"
  | "members"
  | "roles"
  | "attendance"
  | "services"
  | "projects"
  | "sponsors"
  | "partners"
  | "reports"
  | "settings";

const EVERYONE: Role[] = ["super_admin", "admin", "usher", "media", "attendee"];

/** Which roles may open which dashboard page. Super admin sees everything. */
export const SECTION_ACCESS: Record<DashboardSection, Role[]> = {
  overview: EVERYONE,
  scan: EVERYONE,
  "my-attendance": EVERYONE,
  members: ["super_admin"],
  roles: ["super_admin"],
  attendance: ["super_admin", "admin", "usher"],
  services: ["super_admin", "admin", "media"],
  projects: ["super_admin"],
  sponsors: ["super_admin", "admin"],
  partners: ["super_admin", "admin"],
  reports: ["super_admin", "admin"],
  settings: ["super_admin"],
};

export function canAccess(role: Role, section: DashboardSection): boolean {
  return role === "super_admin" || SECTION_ACCESS[section].includes(role);
}

export const SECTION_LABELS: Record<DashboardSection, string> = {
  overview: "Overview",
  scan: "Scan to check in",
  "my-attendance": "My attendance",
  members: "Members",
  roles: "Roles & access",
  attendance: "Attendance",
  services: "Services & Events",
  projects: "Projects",
  sponsors: "Sponsors",
  partners: "Partners",
  reports: "Reports",
  settings: "Settings",
};

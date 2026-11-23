import type { Role } from "./types";

export const ROLES: Role[] = [
  "super_admin",
  "admin",
  "usher",
  "media",
  "attendee",
];

/** Roles a person can pick at registration (super admin is never self-assigned). */
export const REGISTRATION_ROLES: Role[] = ["attendee", "usher", "media"];

export const ROLE_META: Record<
  Role,
  { label: string; description: string; tone: string }
> = {
  super_admin: {
    label: "Super admin",
    description:
      "Full control: approves members, assigns roles, manages projects, reports and settings.",
    tone: "bg-primary text-primary-foreground",
  },
  admin: {
    label: "Admin",
    description:
      "Runs day-to-day church operations: services, attendance and follow-ups.",
    tone: "bg-navy text-white",
  },
  usher: {
    label: "Usher",
    description:
      "Opens check-in at the venue by showing the attendance QR code.",
    tone: "bg-accent/30 text-foreground",
  },
  media: {
    label: "Media team",
    description: "Posts service updates, photos and announcements.",
    tone: "bg-muted text-foreground",
  },
  attendee: {
    label: "Attendee",
    description:
      "Scans the QR code at church and sees their own attendance history.",
    tone: "border border-border bg-card text-muted-foreground",
  },
};

export const ROLE_ITEMS = ROLES.map((role) => ({
  value: role,
  label: ROLE_META[role].label,
}));

export type Permission =
  | "Approve registrations"
  | "Change member roles"
  | "Show attendance QR"
  | "Scan attendance QR"
  | "Email absent members"
  | "Manage services & events"
  | "Manage projects"
  | "View sponsors & partners"
  | "View reports"
  | "Edit settings";

export const PERMISSIONS: Permission[] = [
  "Approve registrations",
  "Change member roles",
  "Show attendance QR",
  "Scan attendance QR",
  "Email absent members",
  "Manage services & events",
  "Manage projects",
  "View sponsors & partners",
  "View reports",
  "Edit settings",
];

export const PERMISSION_MATRIX: Record<Role, Permission[]> = {
  super_admin: PERMISSIONS,
  admin: [
    "Show attendance QR",
    "Scan attendance QR",
    "Email absent members",
    "Manage services & events",
    "View sponsors & partners",
    "View reports",
  ],
  usher: ["Show attendance QR", "Scan attendance QR"],
  media: ["Scan attendance QR", "Manage services & events"],
  attendee: ["Scan attendance QR"],
};

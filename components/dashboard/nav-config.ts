import type { Route } from "next";
import type { ComponentType } from "react";
import { FaRegHandshake } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { GoSponsorTiers } from "react-icons/go";
import { HiCalendarDays, HiOutlineUsers } from "react-icons/hi2";
import type { IconType } from "react-icons/lib";
import { LuBadgeCheck, LuScanQrCode } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import {
  PiCircleDashed,
  PiProjectorScreenChart,
  PiQrCode,
} from "react-icons/pi";
import {
  canAccess,
  type DashboardSection,
} from "~/lib/dashboard/access-control";
import type { Role } from "~/lib/dashboard/types";

export type DashboardNavItemType = {
  label: string;
  section: DashboardSection;
  href: Route;
  icon: ComponentType<{ className?: string }>;
  roleLabels?: Partial<Record<string, string>>;
  description: string;
  alternates: {
    canonical: string;
  };
};

export type DashboardNavGroup = {
  label: string;
  items: DashboardNavItemType[];
};

export const dashboardNav: DashboardNavGroup[] = [
  {
    label: "Personal",
    items: [
      {
        label: "Overview",
        section: "overview",
        href: "/dashboard",
        icon: PiCircleDashed,
        description:
          "View your personal church dashboard summary, quick actions, and ministry updates.",
        alternates: { canonical: "/dashboard" },
      },
      {
        label: "Scan to check in",
        section: "scan",
        href: "/dashboard/scan",
        icon: LuScanQrCode,
        description:
          "Scan the service check-in QR code to record your attendance for today's gathering.",
        alternates: { canonical: "/dashboard/scan" },
      },
      {
        label: "My attendance",
        section: "my-attendance",
        href: "/dashboard/my-attendance",
        icon: MdHistory,
        description:
          "Review your personal attendance history across services, fellowships, and special gatherings.",
        alternates: { canonical: "/dashboard/my-attendance" },
      },
    ],
  },
  {
    label: "Congregation",
    items: [
      {
        label: "Members",
        section: "members",
        href: "/dashboard/members",
        icon: HiOutlineUsers,
        description:
          "Manage registered church members, review pending sign-ups, and update member statuses.",
        alternates: { canonical: "/dashboard/members" },
      },
      {
        label: "Roles & access",
        section: "roles",
        href: "/dashboard/roles",
        icon: LuBadgeCheck,
        description:
          "Assign and manage dashboard roles and access permissions across ministry team members.",
        alternates: { canonical: "/dashboard/roles" },
      },
      {
        label: "Attendance",
        section: "attendance",
        href: "/dashboard/attendance",
        icon: PiQrCode,
        roleLabels: { usher: "Check-in code" },
        description:
          "Track congregation attendance, generate check-in codes, and monitor service turnouts.",
        alternates: { canonical: "/dashboard/attendance" },
      },
      {
        label: "Services & Events",
        section: "services",
        href: "/dashboard/services",
        icon: HiCalendarDays,
        description:
          "Schedule and manage weekly services, special gatherings, and ministry events.",
        alternates: { canonical: "/dashboard/services" },
      },
    ],
  },
  {
    label: "Outreach & Giving",
    items: [
      {
        label: "Projects",
        section: "projects",
        href: "/dashboard/projects",
        icon: PiProjectorScreenChart,
        description:
          "Create, monitor, and manage kingdom projects, outreach drives, and building initiatives.",
        alternates: { canonical: "/dashboard/projects" },
      },
      {
        label: "Sponsors",
        section: "sponsors",
        href: "/dashboard/sponsors",
        icon: GoSponsorTiers,
        description:
          "View and manage project sponsors, tier commitments, and outreach contributions.",
        alternates: { canonical: "/dashboard/sponsors" },
      },
      {
        label: "Partners",
        section: "partners",
        href: "/dashboard/partners",
        icon: FaRegHandshake,
        description:
          "Manage kingdom partners, recurring commitments, and partnership records.",
        alternates: { canonical: "/dashboard/partners" },
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        label: "Settings",
        section: "settings",
        href: "/dashboard/settings",
        icon: FiSettings,
        description:
          "Configure church dashboard preferences, account settings, and workspace options.",
        alternates: { canonical: "/dashboard/settings" },
      },
    ],
  },
];

export const dashboardNavData = (href: Route) =>
  dashboardNav
    .flatMap((group) => group.items)
    .find((item) => item.href === href);

export function navForRole(role: Role): DashboardNavGroup[] {
  return dashboardNav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccess(role, item.section)),
    }))
    .filter((group) => group.items.length > 0);
}

export function isDashboardActive(href: string, pathname: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

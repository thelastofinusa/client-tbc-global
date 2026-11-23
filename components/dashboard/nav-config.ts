import { FaRegHandshake } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { GoSponsorTiers } from "react-icons/go";
import { HiCalendarDays, HiOutlineUsers } from "react-icons/hi2";
import { ImStatsBars2 } from "react-icons/im";
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

export interface DashboardNavItem {
  label: string;
  section: DashboardSection;
  href: string;
  icon: IconType;
  /** Different label for specific roles. */
  roleLabels?: Partial<Record<Role, string>>;
}

export interface DashboardNavGroup {
  label: string;
  items: DashboardNavItem[];
}

export const dashboardNav: DashboardNavGroup[] = [
  {
    label: "Personal",
    items: [
      {
        label: "Overview",
        section: "overview",
        href: "/dashboard",
        icon: PiCircleDashed,
      },
      {
        label: "Scan to check in",
        section: "scan",
        href: "/dashboard/scan",
        icon: LuScanQrCode,
      },
      {
        label: "My attendance",
        section: "my-attendance",
        href: "/dashboard/my-attendance",
        icon: MdHistory,
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
      },
      {
        label: "Roles & access",
        section: "roles",
        href: "/dashboard/roles",
        icon: LuBadgeCheck,
      },
      {
        label: "Attendance",
        section: "attendance",
        href: "/dashboard/attendance",
        icon: PiQrCode,
        roleLabels: { usher: "Check-in code" },
      },
      {
        label: "Services & Events",
        section: "services",
        href: "/dashboard/services",
        icon: HiCalendarDays,
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
      },
      {
        label: "Sponsors",
        section: "sponsors",
        href: "/dashboard/sponsors",
        icon: GoSponsorTiers,
      },
      {
        label: "Partners",
        section: "partners",
        href: "/dashboard/partners",
        icon: FaRegHandshake,
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        label: "Reports",
        section: "reports",
        href: "/dashboard/reports",
        icon: ImStatsBars2,
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
      },
    ],
  },
];

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

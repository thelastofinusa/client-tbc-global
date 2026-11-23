import {
  BarChart3Icon,
  BuildingIcon,
  CalendarIcon,
  HandshakeIcon,
  HeartHandshakeIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  QrCodeIcon,
  ScanLineIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";
import {
  canAccess,
  type DashboardSection,
} from "~/lib/dashboard/access-control";
import type { Role } from "~/lib/dashboard/types";

export interface DashboardNavItem {
  label: string;
  section: DashboardSection;
  href: string;
  icon: LucideIcon;
  /** Different label for specific roles. */
  roleLabels?: Partial<Record<Role, string>>;
}

export interface DashboardNavGroup {
  label: string;
  items: DashboardNavItem[];
}

export const dashboardNav: DashboardNavGroup[] = [
  {
    label: "You",
    items: [
      {
        label: "Overview",
        section: "overview",
        href: "/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        label: "Scan to check in",
        section: "scan",
        href: "/dashboard/scan",
        icon: ScanLineIcon,
      },
      {
        label: "My attendance",
        section: "my-attendance",
        href: "/dashboard/my-attendance",
        icon: HistoryIcon,
      },
    ],
  },
  {
    label: "Church",
    items: [
      {
        label: "Members",
        section: "members",
        href: "/dashboard/members",
        icon: UsersIcon,
      },
      {
        label: "Roles & access",
        section: "roles",
        href: "/dashboard/roles",
        icon: ShieldCheckIcon,
      },
      {
        label: "Attendance",
        section: "attendance",
        href: "/dashboard/attendance",
        icon: QrCodeIcon,
        roleLabels: { usher: "Check-in code" },
      },
      {
        label: "Services & Events",
        section: "services",
        href: "/dashboard/services",
        icon: CalendarIcon,
      },
    ],
  },
  {
    label: "Ministry",
    items: [
      {
        label: "Projects",
        section: "projects",
        href: "/dashboard/projects",
        icon: BuildingIcon,
      },
      {
        label: "Sponsors",
        section: "sponsors",
        href: "/dashboard/sponsors",
        icon: HeartHandshakeIcon,
      },
      {
        label: "Partners",
        section: "partners",
        href: "/dashboard/partners",
        icon: HandshakeIcon,
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        label: "Reports",
        section: "reports",
        href: "/dashboard/reports",
        icon: BarChart3Icon,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        section: "settings",
        href: "/dashboard/settings",
        icon: SettingsIcon,
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

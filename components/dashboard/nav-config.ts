import {
  BarChart3Icon,
  BuildingIcon,
  CalendarIcon,
  HandshakeIcon,
  HeartHandshakeIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  QrCodeIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Breadcrumb label for the current section. */
  crumb?: string;
}

export interface DashboardNavGroup {
  label: string;
  items: DashboardNavItem[];
}

export const dashboardNav: DashboardNavGroup[] = [
  {
    label: "Church",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboardIcon },
      { label: "Members", href: "/dashboard/members", icon: UsersIcon },
      {
        label: "Roles & access",
        href: "/dashboard/roles",
        icon: ShieldCheckIcon,
      },
      { label: "Attendance", href: "/dashboard/attendance", icon: QrCodeIcon },
      {
        label: "Services & Events",
        href: "/dashboard/services",
        icon: CalendarIcon,
      },
    ],
  },
  {
    label: "Ministry",
    items: [
      { label: "Projects", href: "/dashboard/projects", icon: BuildingIcon },
      {
        label: "Sponsors",
        href: "/dashboard/sponsors",
        icon: HeartHandshakeIcon,
      },
      { label: "Partners", href: "/dashboard/partners", icon: HandshakeIcon },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", href: "/dashboard/reports", icon: BarChart3Icon },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
    ],
  },
];

export function isDashboardActive(href: string, pathname: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

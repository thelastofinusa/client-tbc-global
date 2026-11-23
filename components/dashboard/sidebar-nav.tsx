"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/reusable/shadcn/sidebar";
import { dashboardNav, isDashboardActive } from "./nav-config";

export function DashboardSidebarNav({
  pendingCount = 0,
}: {
  pendingCount?: number;
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <>
      {dashboardNav.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isDashboardActive(item.href, pathname)}
                    render={
                      <Link
                        href={item.href as Route}
                        onClick={() => setOpenMobile(false)}
                      />
                    }
                  >
                    <item.icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.href === "/dashboard/members" && pendingCount > 0 && (
                    <SidebarMenuBadge>{pendingCount}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

"use client";

import { useClerk } from "@clerk/nextjs";
import {
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/reusable/shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/reusable/shadcn/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/reusable/shadcn/sidebar";

export function DashboardAccountMenu({
  user,
}: {
  user: {
    fullName: string;
    email: string;
    imageUrl: string;
    initials: string;
    roleLabel: string;
  };
}) {
  const { signOut } = useClerk();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar>
              <AvatarImage src={user.imageUrl} alt={user.fullName} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate text-sm font-medium">
                {user.fullName}
              </span>
              <span className="text-sidebar-foreground/70 truncate text-xs">
                {user.roleLabel}
              </span>
            </span>
            <ChevronsUpDownIcon
              className="ml-auto opacity-60"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col">
                <span>{user.fullName}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  {user.email}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                <SettingsIcon aria-hidden="true" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/" />}>
                <ExternalLinkIcon aria-hidden="true" />
                View website
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => signOut({ redirectUrl: "/" })}
                variant="destructive"
              >
                <LogOutIcon aria-hidden="true" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

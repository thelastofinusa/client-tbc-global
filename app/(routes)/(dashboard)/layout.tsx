import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  BarChart3Icon,
  BellIcon,
  CalendarIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  QrCodeIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/reusable/shadcn/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/reusable/shadcn/breadcrumb";
import { Button } from "~/components/reusable/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/reusable/shadcn/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "~/components/reusable/shadcn/sidebar";
import { Container } from "~/components/shared/container";
import { LogoComponent } from "~/components/shared/logo";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
}

interface SidebarUser {
  fullName: string;
  email: string;
  imageUrl: string;
  initials: string;
}

const CHURCH_NAV: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboardIcon aria-hidden="true" />,
    isActive: true,
  },
  {
    id: "members",
    label: "Members",
    href: "/dashboard/members",
    icon: <UsersIcon aria-hidden="true" />,
  },
  {
    id: "attendance",
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: <QrCodeIcon aria-hidden="true" />,
  },
  {
    id: "services",
    label: "Services & Events",
    href: "/dashboard/services",
    icon: <CalendarIcon aria-hidden="true" />,
  },
  {
    id: "reports",
    label: "Reports",
    href: "/dashboard/reports",
    icon: <BarChart3Icon aria-hidden="true" />,
  },
];

function ChurchNav() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Church</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {CHURCH_NAV.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={item.isActive}
                render={<Link href={item.href as Route} />}
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AccountMenu({ user }: { user: SidebarUser }) {
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
                {user.email}
              </span>
            </span>
            <ChevronsUpDownIcon
              className="ml-auto opacity-60"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{user.fullName}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon aria-hidden="true" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon aria-hidden="true" />
                Giving & Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon aria-hidden="true" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LogOutIcon aria-hidden="true" />
                Sign out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

async function DashboardShell({ children }: { children: ReactNode }) {
  await auth.protect({ unauthenticatedUrl: "/sign-in" });
  const clerkUser = await currentUser();

  const fullName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    "Member";
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses[0]?.emailAddress ||
    "";
  const imageUrl = clerkUser?.imageUrl || "";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "MB";

  const sidebarUser: SidebarUser = {
    fullName,
    email,
    imageUrl,
    initials,
  };

  return (
    <SidebarProvider className="relative h-dvh min-h-0 w-full overflow-hidden">
      <Sidebar variant="inset" className="absolute h-full">
        <SidebarHeader>
          <LogoComponent />
        </SidebarHeader>
        <SidebarContent role="navigation" aria-label="Church navigation">
          <ChurchNav />
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator className="mx-0" />
          <AccountMenu user={sidebarUser} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="h-12 border-b">
          <Container size="lg" className="size-full">
            <nav className="flex h-full items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Breadcrumb className="min-w-0">
                <BreadcrumbList className="flex-nowrap">
                  <BreadcrumbItem className="min-w-0">
                    <BreadcrumbLink href="/dashboard" className="truncate">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto flex items-center gap-2">
                <Suspense>
                  <Show when="signed-out">
                    <SignInButton />
                    <SignUpButton>
                      <Button>Sign Up</Button>
                    </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </Suspense>
              </div>
            </nav>
          </Container>
        </header>

        <div className="flex-1 overflow-auto py-3">
          <Container size="lg" className="size-full">
            {children}
          </Container>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}

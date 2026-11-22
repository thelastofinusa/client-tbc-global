import { auth } from "@clerk/nextjs/server";
import {
  ArchiveIcon,
  BarChart3Icon,
  BellIcon,
  ChevronsUpDownIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  InboxIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RocketIcon,
  UserIcon,
} from "lucide-react";
import { ReactNode, Suspense } from "react";
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
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "~/components/reusable/shadcn/sidebar";
import { LogoComponent } from "~/components/shared/logo";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  isActive?: boolean;
}

const NAV: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboardIcon aria-hidden="true" />,
  },
  {
    id: "inbox",
    label: "Inbox",
    badge: 12,
    icon: <InboxIcon aria-hidden="true" />,
  },
  {
    id: "deployments",
    label: "Deployments",
    isActive: true,
    icon: <RocketIcon aria-hidden="true" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3Icon aria-hidden="true" />,
  },
  {
    id: "logs",
    label: "Logs",
    badge: 3,
    icon: <FileTextIcon aria-hidden="true" />,
  },
  {
    id: "storage",
    label: "Storage",
    icon: <LayersIcon aria-hidden="true" />,
  },
];

const PROJECTS = [
  { id: "checkout", name: "Checkout API" },
  { id: "design-system", name: "Design system" },
  { id: "marketing", name: "Marketing site" },
  { id: "edge-cache", name: "Edge cache" },
];

function WorkspaceNav() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                render={<a href="#" />}
                isActive={item.isActive}
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
              {item.badge ? (
                <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ProjectNav() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction type="button">
        <PlusIcon aria-hidden="true" />
        <span className="sr-only">New project</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {PROJECTS.map((project) => (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton render={<a href="#" />}>
                <FolderIcon aria-hidden="true" />
                <span>{project.name}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuAction
                      showOnHover
                      aria-label={`Actions for ${project.name}`}
                    />
                  }
                >
                  <MoreHorizontalIcon aria-hidden="true" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>
                      <CopyIcon aria-hidden="true" />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <ArchiveIcon aria-hidden="true" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AccountMenu() {
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
              <AvatarImage src="https://github.com/shadcn.png" alt="" />
              <AvatarFallback>NR</AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate text-sm font-medium">Nadia Rahman</span>
              <span className="text-sidebar-foreground/70 truncate text-xs">
                nadia@reui.io
              </span>
            </span>
            <ChevronsUpDownIcon
              className="ml-auto opacity-60"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Nadia Rahman</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon aria-hidden="true" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon aria-hidden="true" />
                Billing
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

  return (
    <SidebarProvider className="relative h-dvh min-h-0 w-full overflow-hidden">
      <Sidebar variant="inset" className="absolute h-full">
        <SidebarHeader>
          <LogoComponent />
        </SidebarHeader>
        <SidebarContent role="navigation" aria-label="Workspace">
          <WorkspaceNav />
          <ProjectNav />
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator className="mx-0" />
          <AccountMenu />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
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
          <Button variant="outline" size="sm" className="ml-auto">
            Invite
          </Button>
        </header>
        <div className="flex-1 overflow-auto p-4">{children}</div>
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

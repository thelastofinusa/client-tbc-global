import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { AccessRestricted } from "~/components/dashboard/access-restricted";
import { DashboardAccountMenu } from "~/components/dashboard/account-menu";
import { DashboardBreadcrumbs } from "~/components/dashboard/breadcrumbs";
import { RoleSwitcher } from "~/components/dashboard/role-switcher";
import { DashboardSidebarNav } from "~/components/dashboard/sidebar-nav";
import { Button } from "~/components/reusable/shadcn/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "~/components/reusable/shadcn/sidebar";
import { Container } from "~/components/shared/container";
import { LogoComponent } from "~/components/shared/logo";
import { getDashboardViewer } from "~/lib/dashboard/access";
import { members } from "~/lib/dashboard/mock-data";
import { ROLE_META } from "~/lib/dashboard/roles";

/**
 * Signed-out visitors are redirected by proxy.ts. This layout never calls
 * redirect() (that breaks prefetching with cacheComponents). Everyone who is
 * signed in gets the dashboard for their role (new sign-ups are attendees);
 * individual pages are guarded with <RoleGate>.
 */
async function DashboardShell({ children }: { children: ReactNode }) {
  const viewer = await getDashboardViewer();

  if (!viewer) return <AccessRestricted reason="signed-out" />;
  if (
    viewer.baseRole !== "super_admin" &&
    viewer.member?.status === "suspended"
  ) {
    return <AccessRestricted reason="suspended" />;
  }

  // TODO: replace with a real count from the database.
  const pendingCount =
    viewer.role === "super_admin"
      ? members.filter((m) => m.status === "pending").length
      : 0;

  return (
    <SidebarProvider className="relative h-dvh min-h-0 w-full overflow-hidden">
      <Sidebar variant="inset" className="absolute h-full">
        <SidebarHeader>
          <LogoComponent />
        </SidebarHeader>
        <SidebarContent role="navigation" aria-label="Dashboard navigation">
          <DashboardSidebarNav role={viewer.role} pendingCount={pendingCount} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator className="mx-0" />
          <DashboardAccountMenu
            user={{
              fullName: viewer.fullName,
              email: viewer.email,
              imageUrl: viewer.imageUrl,
              initials: viewer.initials,
              roleLabel: ROLE_META[viewer.role].label,
            }}
          />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="h-12 border-b">
          <Container size="lg" className="size-full">
            <nav className="flex h-full items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <DashboardBreadcrumbs />
              <div className="ml-auto flex items-center gap-2">
                {viewer.baseRole === "super_admin" && (
                  <RoleSwitcher
                    email={viewer.email}
                    role={viewer.role}
                    baseRole={viewer.baseRole}
                  />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/" />}
                  className="max-sm:hidden"
                >
                  <span>View website</span>
                  <ExternalLinkIcon />
                </Button>
              </div>
            </nav>
          </Container>
        </header>

        <div className="flex-1 overflow-auto py-6">
          <Container size="lg">{children}</Container>
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

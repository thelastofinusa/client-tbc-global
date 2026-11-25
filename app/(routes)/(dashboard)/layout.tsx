import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
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
import { Skeleton } from "~/components/reusable/shadcn/skeleton";
import { Container } from "~/components/shared/container";
import { LogoComponent } from "~/components/shared/logo";
import { siteConfig } from "~/config/site.config";
import { getDashboardViewer } from "~/lib/dashboard/access";
import { getPendingCount } from "~/lib/dashboard/data";
import { ROLE_META } from "~/lib/dashboard/roles";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s – Dashboard | ${siteConfig.slogan}`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

function DashboardLayoutSkeleton() {
  return (
    <div className="bg-background text-foreground flex h-dvh min-h-0 w-full overflow-hidden p-2">
      {/* Static Sidebar Chrome Skeleton */}
      <aside className="bg-sidebar border-line hidden w-72 shrink-0 flex-col justify-between rounded-xl border p-3 md:flex">
        <div className="space-y-5">
          <div className="px-1 py-1">
            <Skeleton className="h-7 w-28 rounded-md" />
          </div>

          <div className="space-y-1.5">
            <Skeleton className="mx-2 mb-1.5 h-3 w-12" />
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Skeleton className="mx-2 mb-1.5 h-3 w-16" />
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Skeleton className="mx-2 mb-1.5 h-3 w-20" />
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-20" />
            </div>
          </div>
        </div>

        <div className="border-line space-y-2 border-t pt-3">
          <div className="flex items-center gap-2.5 px-1.5">
            <Skeleton className="size-8 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Inset Chrome Skeleton */}
      <div className="bg-card border-line flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border md:ml-2">
        <header className="border-line h-12 shrink-0 border-b">
          <Container size="lg" className="size-full">
            <div className="flex h-full items-center gap-2">
              <Skeleton className="size-7 shrink-0 rounded-md" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-3 rounded-full" />
              <Skeleton className="h-3.5 w-24" />
              <div className="ml-auto flex items-center gap-2">
                <Skeleton className="h-7 w-28 rounded-md" />
                <Skeleton className="hidden h-8 w-28 rounded-md sm:block" />
              </div>
            </div>
          </Container>
        </header>

        <div className="flex-1 overflow-auto py-6">
          <Container size="lg" className="space-y-4">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
            <Skeleton className="mt-4 h-64 w-full rounded-xl" />
          </Container>
        </div>
      </div>
    </div>
  );
}

/**
 * Signed-out visitors are redirected by proxy.ts. This layout never calls
 * redirect() (that breaks prefetching with cacheComponents). Everyone who is
 * signed in gets the dashboard for their role (new sign-ups are attendees);
 * individual pages are guarded with <RoleGate>.
 */
async function DashboardShell({ children }: { children: ReactNode }) {
  const viewer = await getDashboardViewer();

  if (!viewer) return <AccessRestricted reason="signed-out" />;
  if (viewer.baseRole !== "super_admin" && viewer.status === "suspended") {
    return <AccessRestricted reason="suspended" />;
  }

  const pendingCount =
    viewer.role === "super_admin" ? await getPendingCount() : 0;

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
                  <RoleSwitcher role={viewer.role} baseRole={viewer.baseRole} />
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
    <Suspense fallback={<DashboardLayoutSkeleton />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}

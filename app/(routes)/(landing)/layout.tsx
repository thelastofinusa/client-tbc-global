import { headers } from "next/headers";
import { type ReactNode, Suspense } from "react";
import { AuthStateProvider } from "~/components/providers/auth-state";
import { ScheduleProvider } from "~/components/providers/schedule";
import { Footer } from "~/components/shared/footer";
import { Header } from "~/components/shared/header";
import { InstallAppFab } from "~/components/shared/install-app-fab";
import { PwaPullToRefresh } from "~/components/shared/pwa-pull-to-refresh";
import { PwaRegister } from "~/components/shared/pwa-register";
import { auth } from "~/lib/auth/auth";
import { getScheduleSummary } from "~/lib/data/services";

const STUDIO_ROLES = new Set(["super_admin", "admin", "media"]);

/** Cached Sanity read, so this stays part of the static page. */
async function ScheduleBoundary({ children }: { children: ReactNode }) {
  const schedule = await getScheduleSummary();
  return <ScheduleProvider value={schedule}>{children}</ScheduleProvider>;
}

/**
 * Reads the signed session cookie only (no database round trip, see
 * `session.cookieCache` in lib/auth/auth.ts). The Studio link can lag a role
 * change by a few minutes, which is fine for a menu item.
 */
async function LandingHeader() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string } | undefined)?.role ?? "";

  return (
    <AuthStateProvider signedIn={Boolean(session?.user)}>
      <Header shouldAccessStudio={STUDIO_ROLES.has(role)} />
    </AuthStateProvider>
  );
}

export default function LandingLayout(props: Readonly<LayoutProps<"/">>) {
  return (
    <ScheduleBoundary>
      <Suspense
        fallback={
          <AuthStateProvider signedIn={null}>
            <Header shouldAccessStudio={false} />
          </AuthStateProvider>
        }
      >
        <LandingHeader />
      </Suspense>

      <main className="flex-1">
        <PwaRegister />
        {props.children}
        <Suspense fallback={null}>
          <InstallAppFab />
        </Suspense>
        <PwaPullToRefresh />
      </main>
      <Footer />
    </ScheduleBoundary>
  );
}

import React, { Suspense } from "react";
import { Footer } from "~/components/shared/footer";
import { Header } from "~/components/shared/header";
import { InstallAppFab } from "~/components/shared/install-app-fab";
import { PwaPullToRefresh } from "~/components/shared/pwa-pull-to-refresh";
import { PwaRegister } from "~/components/shared/pwa-register";
import { getDashboardViewer } from "~/lib/dashboard/access";
import { getServices, type ServiceRow } from "~/lib/data/services";

const STUDIO_ROLES = new Set(["super_admin", "admin", "media"]);

async function LandingHeader({ services }: { services: ServiceRow[] }) {
  const viewer = await getDashboardViewer();
  const shouldAccessStudio = Boolean(
    viewer && STUDIO_ROLES.has(viewer.baseRole),
  );

  return <Header services={services} shouldAccessStudio={shouldAccessStudio} />;
}

export default async function LandingLayout(props: Readonly<LayoutProps<"/">>) {
  const services = await getServices();

  return (
    <React.Fragment>
      <Suspense
        fallback={<Header services={services} shouldAccessStudio={false} />}
      >
        <LandingHeader services={services} />
      </Suspense>

      <main className="flex-1">
        <PwaRegister />
        {props.children}
        <Suspense fallback={null}>
          <InstallAppFab />
        </Suspense>
        <PwaPullToRefresh />
      </main>
      <Footer services={services} />
    </React.Fragment>
  );
}

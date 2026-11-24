import React, { Suspense } from "react";
import { Footer } from "~/components/shared/footer";
import { Header } from "~/components/shared/header";
import { getDashboardViewer } from "~/lib/dashboard/access";

const STUDIO_ROLES = new Set(["super_admin", "admin", "media"]);

async function LandingHeader() {
  const viewer = await getDashboardViewer();
  const shouldAccessStudio = Boolean(
    viewer && STUDIO_ROLES.has(viewer.baseRole),
  );

  return <Header shouldAccessStudio={shouldAccessStudio} />;
}

export default function LandingLayout(props: Readonly<LayoutProps<"/">>) {
  return (
    <React.Fragment>
      <Suspense fallback={<Header shouldAccessStudio={false} />}>
        <LandingHeader />
      </Suspense>
      <main className="flex-1">{props.children}</main>
      <Footer />
    </React.Fragment>
  );
}

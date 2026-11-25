import type { Metadata } from "next";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";
import { RoleGate } from "~/components/dashboard/role-gate";
import { ServicesBoard } from "~/components/dashboard/services-board";

const navItem = dashboardNavData("/dashboard/services");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

function Content() {
  return (
    <>
      <PageHeader
        eyebrow="Church"
        title="Services & Events"
        description="Weekly gatherings and one-off events. Times here feed the public services page and the attendance screen."
      />
      <ServicesBoard />
    </>
  );
}

export default function Page() {
  return (
    <RoleGate section="services">
      <Content />
    </RoleGate>
  );
}

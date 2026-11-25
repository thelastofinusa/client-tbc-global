import type { Metadata } from "next";
import { Suspense } from "react";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";
import { RoleGate } from "~/components/dashboard/role-gate";
import { SubmissionsTable } from "~/components/dashboard/submissions-table";
import { getSubmissions } from "~/lib/dashboard/data";

const navItem = dashboardNavData("/dashboard/sponsors");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

async function Content() {
  const rows = await getSubmissions("sponsor");

  return (
    <>
      <PageHeader
        eyebrow="Ministry"
        title="Sponsors"
        description="People who registered to sponsor a student or a project from the website’s sponsorship form."
      />
      <SubmissionsTable
        initialRows={rows}
        subjectLabel="Sponsoring"
        emptyLabel="No sponsorship requests yet."
      />
    </>
  );
}

export default function Page() {
  return (
    <RoleGate section="sponsors">
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </RoleGate>
  );
}

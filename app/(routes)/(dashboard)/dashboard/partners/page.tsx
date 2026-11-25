import type { Metadata } from "next";
import { Suspense } from "react";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";
import { RoleGate } from "~/components/dashboard/role-gate";
import { SubmissionsTable } from "~/components/dashboard/submissions-table";
import { getSubmissions } from "~/lib/dashboard/data";

const navItem = dashboardNavData("/dashboard/partners");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

async function Content() {
  const rows = await getSubmissions("partner");

  return (
    <>
      <PageHeader
        eyebrow="Ministry"
        title="Partners"
        description="Organisations and individuals who applied to partner with the church through the partnership form."
      />
      <SubmissionsTable
        initialRows={rows}
        subjectLabel="Interested in"
        emptyLabel="No partnership requests yet."
      />
    </>
  );
}

export default function Page() {
  return (
    <RoleGate section="partners">
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </RoleGate>
  );
}

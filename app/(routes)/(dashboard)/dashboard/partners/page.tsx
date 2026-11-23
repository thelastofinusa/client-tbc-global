import type { Metadata } from "next";
import { PageHeader } from "~/components/dashboard/page-header";
import { RoleGate } from "~/components/dashboard/role-gate";
import { SubmissionsTable } from "~/components/dashboard/submissions-table";
import { partnerSubmissions } from "~/lib/dashboard/mock-data";

export const metadata: Metadata = { title: "Partners" };

function Content() {
  return (
    <>
      <PageHeader
        eyebrow="Ministry"
        title="Partners"
        description="Organisations and individuals who applied to partner with the church through the partnership form."
      />
      <SubmissionsTable
        initialRows={partnerSubmissions}
        subjectLabel="Interested in"
        emptyLabel="No partnership requests yet."
      />
    </>
  );
}

export default function Page() {
  return (
    <RoleGate section="partners">
      <Content />
    </RoleGate>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "~/components/dashboard/page-header";
import { SubmissionsTable } from "~/components/dashboard/submissions-table";
import { sponsorSubmissions } from "~/lib/dashboard/mock-data";

export const metadata: Metadata = { title: "Sponsors" };

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Ministry"
        title="Sponsors"
        description="People who registered to sponsor a student or a project from the website’s sponsorship form."
      />
      <SubmissionsTable
        initialRows={sponsorSubmissions}
        subjectLabel="Sponsoring"
        emptyLabel="No sponsorship requests yet."
      />
    </>
  );
}

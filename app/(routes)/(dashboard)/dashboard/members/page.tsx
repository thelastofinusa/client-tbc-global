import type { Metadata } from "next";
import { Suspense } from "react";
import { MembersTable } from "~/components/dashboard/members-table";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";
import { ResetSampleDataButton } from "~/components/dashboard/reset-sample-data";
import { RoleGate } from "~/components/dashboard/role-gate";
import { members } from "~/lib/dashboard/mock-data";
import { applyOverrides, readOverrides } from "~/lib/dashboard/overrides";
import type { MemberStatus } from "~/lib/dashboard/types";

const navItem = dashboardNavData("/dashboard/members");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

const statuses: MemberStatus[] = ["pending", "approved", "suspended"];

type SearchParams = Promise<{ status?: string }>;

async function MembersContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;
  const initialFilter = statuses.find((s) => s === status) ?? "all";
  const list = applyOverrides(members, await readOverrides());

  return <MembersTable initialMembers={list} initialFilter={initialFilter} />;
}

export default function Page(props: { searchParams: SearchParams }) {
  return (
    <RoleGate section="members">
      <PageHeader
        eyebrow="Church"
        title="Members"
        description="Everyone who has registered. New sign-ups start as attendees. Approve them and give them a role, or change a role at any time."
        actions={<ResetSampleDataButton />}
      />
      <Suspense
        fallback={
          <p className="text-muted-foreground text-sm">Loading members…</p>
        }
      >
        <MembersContent searchParams={props.searchParams} />
      </Suspense>
    </RoleGate>
  );
}

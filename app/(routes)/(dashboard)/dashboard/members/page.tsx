import type { Metadata } from "next";
import { Suspense } from "react";
import { MembersTable } from "~/components/dashboard/members-table";
import { PageHeader } from "~/components/dashboard/page-header";
import { members } from "~/lib/dashboard/mock-data";
import type { MemberStatus } from "~/lib/dashboard/types";

export const metadata: Metadata = { title: "Members" };

const statuses: MemberStatus[] = ["pending", "approved", "suspended"];

type SearchParams = Promise<{ status?: string }>;

async function MembersContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;
  const initialFilter = statuses.find((s) => s === status) ?? "all";

  return (
    <MembersTable initialMembers={members} initialFilter={initialFilter} />
  );
}

export default function Page(props: { searchParams: SearchParams }) {
  return (
    <>
      <PageHeader
        eyebrow="Church"
        title="Members"
        description="Everyone who has registered. Approve new people, confirm the role they asked for, or change it at any time."
      />
      <Suspense
        fallback={
          <p className="text-muted-foreground text-sm">Loading members…</p>
        }
      >
        <MembersContent searchParams={props.searchParams} />
      </Suspense>
    </>
  );
}

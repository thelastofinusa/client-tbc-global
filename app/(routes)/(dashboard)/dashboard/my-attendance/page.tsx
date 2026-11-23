import type { Metadata } from "next";
import { Suspense } from "react";
import { MyAttendance } from "~/components/dashboard/my-attendance";
import { PageHeader } from "~/components/dashboard/page-header";
import { getDashboardViewer } from "~/lib/dashboard/access";

export const metadata: Metadata = { title: "My attendance" };

async function Content() {
  const viewer = await getDashboardViewer();

  return (
    <MyAttendance
      baseline={{
        attendanceRate: viewer?.member?.attendanceRate ?? null,
        lastAttended: viewer?.member?.lastAttended ?? null,
      }}
    />
  );
}

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="You"
        title="My attendance"
        description="Every service you’ve checked in to."
      />
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </>
  );
}

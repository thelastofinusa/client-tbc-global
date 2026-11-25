import type { Metadata } from "next";
import { Suspense } from "react";
import { MyAttendance } from "~/components/dashboard/my-attendance";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";
import { getDashboardViewer } from "~/lib/dashboard/access";
import { getMyAttendance } from "~/lib/dashboard/data";

const navItem = dashboardNavData("/dashboard/my-attendance");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

async function Content() {
  const viewer = await getDashboardViewer();
  if (!viewer) return null;

  const mine = await getMyAttendance(viewer.id);

  return (
    <MyAttendance
      records={mine.records}
      attendanceRate={mine.attendanceRate}
      lastAttended={mine.lastAttended}
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

import type { Metadata } from "next";
import { Suspense } from "react";
import { AttendanceSession } from "~/components/dashboard/attendance-session";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";
import { RoleGate } from "~/components/dashboard/role-gate";
import { getDashboardViewer } from "~/lib/dashboard/access";
import { getAttendanceSnapshot } from "~/lib/dashboard/data";
import { getServices } from "~/lib/data/services";

const navItem = dashboardNavData("/dashboard/attendance");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

async function Content() {
  const [viewer, services, snapshot] = await Promise.all([
    getDashboardViewer(),
    getServices(),
    getAttendanceSnapshot(),
  ]);
  const isUsher = viewer?.role === "usher";

  return (
    <>
      <PageHeader
        eyebrow="Church"
        title={isUsher ? "Check-in code" : "Attendance"}
        description="Open check-in and show the code at the venue. Members scan it from their own dashboard, they never see the code themselves."
      />
      {services.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Add at least one service in Sanity Studio to start taking attendance.
        </p>
      ) : (
        <AttendanceSession
          services={services}
          snapshot={snapshot}
          mode={isUsher ? "qr-only" : "full"}
        />
      )}
    </>
  );
}

export default function Page() {
  return (
    <RoleGate section="attendance">
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </RoleGate>
  );
}

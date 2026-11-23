import type { Metadata } from "next";
import { AttendanceSession } from "~/components/dashboard/attendance-session";
import { PageHeader } from "~/components/dashboard/page-header";
import { RoleGate } from "~/components/dashboard/role-gate";
import { getDashboardViewer } from "~/lib/dashboard/access";
import { members, services } from "~/lib/dashboard/mock-data";

export const metadata: Metadata = { title: "Attendance" };

async function Content() {
  const viewer = await getDashboardViewer();
  const isUsher = viewer?.role === "usher";

  return (
    <>
      <PageHeader
        eyebrow="Church"
        title={isUsher ? "Check-in code" : "Attendance"}
        description="Open check-in and show the code at the venue. Members scan it from their own dashboard, they never see the code themselves."
      />
      <AttendanceSession
        services={services}
        members={members}
        lastServiceDate="2026-11-22"
        mode={isUsher ? "qr-only" : "full"}
      />
    </>
  );
}

export default function Page() {
  return (
    <RoleGate section="attendance">
      <Content />
    </RoleGate>
  );
}

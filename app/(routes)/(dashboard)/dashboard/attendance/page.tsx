import type { Metadata } from "next";
import { AttendanceSession } from "~/components/dashboard/attendance-session";
import { PageHeader } from "~/components/dashboard/page-header";
import { members, services } from "~/lib/dashboard/mock-data";

export const metadata: Metadata = { title: "Attendance" };

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Church"
        title="Attendance"
        description="Open check-in and show the code at the venue. Members scan it from their own dashboard, they never see the code themselves."
      />
      <AttendanceSession
        services={services}
        members={members}
        lastServiceDate="2026-11-22"
      />
    </>
  );
}

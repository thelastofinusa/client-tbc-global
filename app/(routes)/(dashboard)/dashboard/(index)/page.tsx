import { Suspense } from "react";
import {
  AdminOverview,
  AttendeeOverview,
  MediaOverview,
  SuperAdminOverview,
  UsherOverview,
} from "~/components/dashboard/overviews";
import { getDashboardViewer } from "~/lib/dashboard/access";

export const instant = false;

async function OverviewContent() {
  const viewer = await getDashboardViewer();
  if (!viewer) return null;

  switch (viewer.role) {
    case "super_admin":
      return <SuperAdminOverview viewer={viewer} />;
    case "admin":
      return <AdminOverview viewer={viewer} />;
    case "usher":
      return <UsherOverview viewer={viewer} />;
    case "media":
      return <MediaOverview viewer={viewer} />;
    default:
      return <AttendeeOverview viewer={viewer} />;
  }
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OverviewContent />
    </Suspense>
  );
}

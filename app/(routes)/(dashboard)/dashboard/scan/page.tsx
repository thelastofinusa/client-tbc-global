import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckInScanner } from "~/components/dashboard/checkin-scanner";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";

const navItem = dashboardNavData("/dashboard/scan");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="You"
        title="Scan to check in"
        description="Scan the QR code shown at church to record your attendance."
      />
      <Suspense fallback={null}>
        <CheckInScanner />
      </Suspense>
    </>
  );
}

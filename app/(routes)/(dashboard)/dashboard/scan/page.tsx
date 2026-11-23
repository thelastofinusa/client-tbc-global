import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckInScanner } from "~/components/dashboard/checkin-scanner";
import { PageHeader } from "~/components/dashboard/page-header";

export const metadata: Metadata = { title: "Scan to check in" };

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

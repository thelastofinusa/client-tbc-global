import type { Metadata } from "next";
import { PageHeader } from "~/components/dashboard/page-header";
import { ServicesBoard } from "~/components/dashboard/services-board";
import { services } from "~/lib/dashboard/mock-data";

export const metadata: Metadata = { title: "Services & Events" };

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Church"
        title="Services & Events"
        description="Weekly gatherings and one-off events. Times here feed the public services page and the attendance screen."
      />
      <ServicesBoard initialServices={services} />
    </>
  );
}

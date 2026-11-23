import type { Metadata } from "next";
import { PageHeader } from "~/components/dashboard/page-header";
import { SettingsForm } from "~/components/dashboard/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="System"
        title="Settings"
        description="Church details and what the super admin gets notified about."
      />
      <div className="max-w-3xl">
        <SettingsForm />
      </div>
    </>
  );
}

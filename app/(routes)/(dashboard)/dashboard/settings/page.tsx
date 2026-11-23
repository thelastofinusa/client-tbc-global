import type { Metadata } from "next";
import { PageHeader } from "~/components/dashboard/page-header";
import { RoleGate } from "~/components/dashboard/role-gate";
import { SettingsForm } from "~/components/dashboard/settings-form";
import { getDashboardViewer } from "~/lib/dashboard/access";
import { getCommunities } from "~/lib/dashboard/actions";

export const metadata: Metadata = { title: "Settings" };

export const instant = false;

async function Content() {
  const viewer = await getDashboardViewer();
  if (!viewer) return null;

  const communities = await getCommunities();

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Update your member profile information and connect with church groups."
      />
      <div className="max-w-3xl">
        <SettingsForm viewer={viewer} initialCommunities={communities} />
      </div>
    </>
  );
}

export default function Page() {
  return (
    <RoleGate section="settings">
      <Content />
    </RoleGate>
  );
}

import type { Metadata } from "next";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";
import { ProjectForm } from "~/components/dashboard/project-form";
import { RoleGate } from "~/components/dashboard/role-gate";

const navItem = dashboardNavData("/dashboard/projects/new");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

export const instant = false;

export default function Page() {
  return (
    <RoleGate section="projects">
      <PageHeader
        eyebrow="Ministry"
        title="Add a project"
        description="Create a new project. It will appear on the dashboard and can be shown on the public site."
      />
      <ProjectForm />
    </RoleGate>
  );
}

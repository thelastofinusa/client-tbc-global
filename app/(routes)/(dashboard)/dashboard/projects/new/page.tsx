import type { Metadata } from "next";
import { PageHeader } from "~/components/dashboard/page-header";
import { ProjectForm } from "~/components/dashboard/project-form";
import { RoleGate } from "~/components/dashboard/role-gate";

export const metadata: Metadata = { title: "New project" };

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

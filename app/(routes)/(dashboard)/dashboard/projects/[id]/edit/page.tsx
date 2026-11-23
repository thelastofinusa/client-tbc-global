import type { Metadata } from "next";
import { PageHeader } from "~/components/dashboard/page-header";
import { ProjectForm } from "~/components/dashboard/project-form";
import { RoleGate } from "~/components/dashboard/role-gate";

export const metadata: Metadata = { title: "Edit project" };

export const instant = false;

export default async function Page(
  props: PageProps<"/dashboard/projects/[id]/edit">,
) {
  const { id } = await props.params;

  return (
    <RoleGate section="projects">
      <PageHeader
        eyebrow="Ministry"
        title="Edit project"
        description="Update the project details."
      />
      <ProjectForm projectId={id} />
    </RoleGate>
  );
}

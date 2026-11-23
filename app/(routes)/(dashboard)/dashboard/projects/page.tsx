import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "~/components/dashboard/page-header";
import { ProjectsList } from "~/components/dashboard/project-list";
import { RoleGate } from "~/components/dashboard/role-gate";
import { Button } from "~/components/reusable/shadcn/button";

export const metadata: Metadata = { title: "Projects" };

function Content() {
  return (
    <>
      <PageHeader
        eyebrow="Ministry"
        title="Projects"
        description="Progress and sponsor counts for each project. These numbers appear on the public Projects page and the home page."
        actions={
          <Button
            variant="red"
            size="sm"
            nativeButton={false}
            render={<Link href="/dashboard/projects/new" />}
          >
            <PlusIcon className="size-4" />
            <span>Add project</span>
          </Button>
        }
      />
      <ProjectsList />
    </>
  );
}

export default function Page() {
  return (
    <RoleGate section="projects">
      <Content />
    </RoleGate>
  );
}

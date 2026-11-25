import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";
import { RoleGate } from "~/components/dashboard/role-gate";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import { Progress } from "~/components/reusable/shadcn/progress";
import { getProjects } from "~/lib/data/projects";

const navItem = dashboardNavData("/dashboard/projects");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

async function Content() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Ministry"
        title="Projects"
        description="Project stories, progress and photos live in Sanity Studio. Sponsor counts here come from the sponsorship requests."
        actions={
          <Button
            variant="red"
            nativeButton={false}
            render={
              <a
                href="/studio/structure/project"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Edit in Studio
            <ExternalLinkIcon />
          </Button>
        }
      />

      <Card variant="surface" className="gap-5">
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No projects yet. Open Studio and add your first one.
          </p>
        ) : (
          <ul className="flex flex-col gap-5">
            {projects.map((p) => (
              <li key={p.slug} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium">
                    {p.title}
                    <span className="text-muted-foreground ml-2 text-xs">
                      {p.status} · {p.category}
                    </span>
                  </span>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {p.progress.percentage}% · {p.progress.supportersCount}{" "}
                    sponsors
                  </span>
                </div>
                <Progress value={p.progress.percentage} variant="project" />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

export default function Page() {
  return (
    <RoleGate section="projects">
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </RoleGate>
  );
}

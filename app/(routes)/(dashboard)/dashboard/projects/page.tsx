import { HeartHandshakeIcon } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "~/components/dashboard/page-header";
import { Badge } from "~/components/reusable/shadcn/badge";
import { Card } from "~/components/reusable/shadcn/card";
import { Progress } from "~/components/reusable/shadcn/progress";
import { projects } from "~/lib/dashboard/mock-data";

export const metadata: Metadata = { title: "Projects" };

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Ministry"
        title="Projects"
        description="Progress and sponsor counts for each project. These numbers appear on the public Projects page and the home page."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} variant="surface" className="gap-5">
            <div className="flex items-center justify-between">
              <Badge variant="tag">{p.category}</Badge>
              <span className="text-muted-foreground text-xs capitalize">
                {p.status}
              </span>
            </div>

            <div>
              <h2 className="font-serif text-xl font-extrabold tracking-[-0.03em]">
                {p.name}
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <span className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
                  Progress
                </span>
                <strong className="font-serif text-2xl leading-none tabular-nums">
                  {p.progress}%
                </strong>
              </div>
              <Progress value={p.progress} variant="project" />
              <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                <HeartHandshakeIcon className="size-3.5" aria-hidden="true" />
                {p.sponsors} sponsors
              </p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

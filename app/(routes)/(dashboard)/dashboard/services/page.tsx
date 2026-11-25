import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { dashboardNavData } from "~/components/dashboard/nav-config";
import { PageHeader } from "~/components/dashboard/page-header";
import { RoleGate } from "~/components/dashboard/role-gate";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import { getServices } from "~/lib/data/services";

const navItem = dashboardNavData("/dashboard/services");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

async function Content() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="Church"
        title="Services & Events"
        description="Services are content, so they’re edited in Sanity Studio. Changes feed the public Services page and the attendance screen within a few minutes."
        actions={
          <Button
            variant="red"
            nativeButton={false}
            render={
              <a
                href="/studio/structure/service"
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

      <Card variant="surface" className="gap-4">
        {services.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No services yet. Open Studio and add your first one.
          </p>
        ) : (
          <ul className="divide-line divide-y">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {s.day} · {s.time} · {s.location}
                  </p>
                </div>
                <span className="text-muted-foreground text-xs capitalize">
                  {s.kind}
                  {s.expected ? ` · ~${s.expected} expected` : ""}
                </span>
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
    <RoleGate section="services">
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </RoleGate>
  );
}

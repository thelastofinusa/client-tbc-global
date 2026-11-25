import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "~/components/reusable/shadcn/skeleton";
import { Container } from "~/components/shared/container";
import { getProjectBySlug } from "~/lib/data/projects";
import { fetchProjects } from "~/sanity/queries/project.query";
import { Banner } from "./_components/banner";
import { MainContent } from "./_components/content";
import { ProjectDetailsHeroComponents } from "./_components/hero";

export async function generateStaticParams() {
  try {
    const projects = await fetchProjects();
    if (projects.length > 0) {
      return projects.map((project) => ({ slug: project.slug }));
    }
  } catch (err) {
    console.error("Could not list projects for static params:", err);
  }
  // Cache Components needs at least one param to validate the route. This
  // placeholder renders "not found"; real projects load on demand.
  return [{ slug: "_" }];
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
  };
}

function ProjectDetailsSkeleton() {
  return (
    <div className="pb-16 md:pb-24">
      {/* Hero Skeleton */}
      <section className="bg-navy border-b border-white/10 pt-10 pb-14 md:pt-14 md:pb-20">
        <Container>
          <div className="max-w-2xl">
            <Skeleton className="h-4 w-32 bg-white/10" />
            <div className="mt-6 flex items-center gap-3">
              <Skeleton className="h-4 w-28 bg-white/10" />
              <Skeleton className="h-5 w-20 rounded-full bg-white/10" />
            </div>
            <Skeleton className="mt-4 h-12 w-3/4 max-w-2xl bg-white/10" />
            <Skeleton className="mt-4 h-5 w-full max-w-xl bg-white/10" />
            <Skeleton className="mt-2 h-5 w-2/3 max-w-md bg-white/10" />
          </div>
        </Container>
      </section>

      {/* Banner Skeleton */}
      <section className="-mt-6 md:-mt-10">
        <Container size="lg">
          <div className="bg-background aspect-video max-h-120 w-full rounded-2xl">
            <Skeleton className="size-full" />
          </div>
        </Container>
      </section>

      {/* Content + Sticky Aside Skeleton */}
      <section className="pt-12 md:pt-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start xl:gap-14">
            <div className="space-y-10">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <div className="bg-card border-line space-y-4 rounded-2xl border p-6 sm:p-8">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-7 w-72" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-7 w-44" />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="aspect-4/3 w-full rounded-xl" />
                  <Skeleton className="aspect-4/3 w-full rounded-xl" />
                  <Skeleton className="aspect-4/3 w-full rounded-xl" />
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-card border-line space-y-4 rounded-2xl border p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
                <Skeleton className="h-8 w-36" />
                <div className="space-y-2.5 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>

              <div className="bg-navy space-y-4 rounded-2xl border border-white/15 p-6">
                <Skeleton className="h-4 w-32 bg-white/10" />
                <Skeleton className="h-7 w-48 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-11 w-full rounded-md bg-white/10" />
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </div>
  );
}

async function ProjectDetailsContent(props: {
  params: PageProps<"/projects/[slug]">["params"];
}) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <>
      <ProjectDetailsHeroComponents project={project} />
      <Banner project={project} />
      <MainContent project={project} />
    </>
  );
}

export default function ProjectDetailsPage(
  props: PageProps<"/projects/[slug]">,
) {
  return (
    <main className="bg-background text-foreground pb-16 md:pb-24">
      <Suspense fallback={<ProjectDetailsSkeleton />}>
        <ProjectDetailsContent params={props.params} />
      </Suspense>
    </main>
  );
}

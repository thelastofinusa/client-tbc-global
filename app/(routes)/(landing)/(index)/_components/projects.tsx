import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { GoSponsorTiers } from "react-icons/go";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { CountingNumber } from "~/components/shared/count-number";
import { Eyebrow } from "~/components/shared/eyebrow";
import { getFeaturedProject } from "~/lib/data/projects";

function ProjectsView({
  featured,
}: {
  featured?: { title: string; summary: string; percentage: number };
}) {
  const progress = featured?.percentage ?? 0;

  return (
    <section aria-label="Projects" className="bg-muted flex-1 overflow-x-clip">
      <Container className="py-16 md:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow lineClass="bg-primary" label="What we’re building" />
            <h2 className="mt-5 font-serif text-3xl font-extrabold tracking-[-0.06em] md:text-4xl md:leading-[1.05] lg:text-5xl">
              Faith with
              <br />
              sleeves rolled up.
            </h2>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-max"
            nativeButton={false}
            render={<Link href="/projects" />}
          >
            <span>See all projects</span>
            <ArrowUpRightIcon size={16} />
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-12">
          {/* Featured project (set "Feature on the home page" in Sanity) */}
          <div className="bg-navy flex flex-col justify-between gap-12 p-7 text-white md:col-span-7 md:row-span-2 md:p-10">
            <div>
              <span className="bg-accent/15 text-accent inline-block px-2 py-1 text-[10px] font-semibold tracking-wider uppercase">
                {featured ? `Project ${featured.title}` : "Our projects"}
              </span>
              <h3 className="mt-5 max-w-md font-serif text-3xl font-extrabold tracking-[-0.05em] md:text-4xl md:leading-[1.05]">
                {featured ? (
                  <>
                    We’re{" "}
                    <CountingNumber
                      fromNumber={0}
                      number={progress}
                      inViewMargin="-50px"
                    />
                    % of the way there.
                  </>
                ) : (
                  "Faith that gets to work."
                )}
              </h3>
              <p className="text-secondary/80 mt-4 max-w-md text-sm leading-[1.8]">
                {featured
                  ? featured.summary
                  : "New projects are being added. Check back soon to follow the work."}
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-end justify-between">
                <span className="text-secondary/70 text-xs tracking-[0.14em] uppercase">
                  Progress
                </span>
                <strong className="font-mono text-2xl tabular-nums">
                  <CountingNumber
                    fromNumber={0}
                    number={progress}
                    inViewMargin="-50px"
                  />
                  %
                </strong>
              </div>
              <div
                role="progressbar"
                aria-label={`${featured?.title ?? "Project"} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-2 w-full bg-white/15"
              >
                <div
                  className="bg-accent h-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <Button
                variant="cream"
                size="lg"
                className="mt-8"
                nativeButton={false}
                render={<Link href="/projects" />}
              >
                <span>Follow the build</span>
                <ArrowUpRightIcon size={16} />
              </Button>
            </div>
          </div>

          {/* Sponsor a student */}
          <Link
            href="/partner"
            className="bg-card border-line hover:border-primary group flex flex-col justify-between gap-8 border p-6 transition-colors md:col-span-5 md:p-8"
          >
            <div className="flex items-start justify-between">
              <GoSponsorTiers className="text-primary size-7" />
              <ArrowUpRightIcon className="text-muted-foreground group-hover:text-primary size-5 transition-colors" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold tracking-[-0.03em]">
                Sponsor a student
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-[1.7]">
                Cover a child’s school fees and open a door that stays open.
              </p>
            </div>
          </Link>

          {/* Academic projects */}
          <Link
            href="/projects"
            className="bg-card border-line hover:border-primary group flex flex-col justify-between gap-8 border p-6 transition-colors md:col-span-5 md:p-8"
          >
            <div className="flex items-start justify-between">
              <HiOutlineAcademicCap className="text-primary size-7" />
              <ArrowUpRightIcon className="text-muted-foreground group-hover:text-primary size-5 transition-colors" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold tracking-[-0.03em]">
                Academic projects
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-[1.7]">
                Learning programs that help young people in Kudenda grow their
                skills and dream bigger.
              </p>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}

async function ProjectsData() {
  const featured = await getFeaturedProject();

  return (
    <ProjectsView
      featured={
        featured
          ? {
              title: featured.title,
              summary: featured.summary,
              percentage: featured.progress.percentage,
            }
          : undefined
      }
    />
  );
}

export const ProjectsComponent = () => (
  <Suspense fallback={<ProjectsView />}>
    <ProjectsData />
  </Suspense>
);

/** biome-ignore-all lint/suspicious/noArrayIndexKey: ignore */
/** biome-ignore-all lint/performance/noImgElement: ignore */
import {
  ArrowUpRightIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  HeartHandshakeIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import type { ProjectItem } from "~/lib/projects";

export const MainContent: React.FC<{ project: ProjectItem }> = ({
  project,
}) => {
  return (
    <section className="pt-12 md:pt-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start xl:gap-14">
          {/* Left Column: About, Purpose & Gallery */}
          <div className="space-y-12">
            {/* What It's About */}
            <div>
              <Eyebrow label="Overview" className="text-primary" />
              <h2 className="mt-2 font-serif text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
                What this project is about
              </h2>
              <div className="text-foreground/85 mt-4 space-y-4 text-base leading-relaxed">
                {project.about.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Purpose of the Project */}
            <div className="bg-card border-line rounded-2xl border p-6 sm:p-8">
              <div className="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <TargetIcon size={15} />
                <span>Purpose &amp; Objectives</span>
              </div>
              <h2 className="mt-2 font-serif text-2xl font-extrabold tracking-[-0.03em]">
                {project.purpose.heading}
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                {project.purpose.description}
              </p>

              <ul className="border-line mt-6 space-y-3 border-t pt-6">
                {project.purpose.objectives.map((objective) => (
                  <li
                    key={objective}
                    className="flex items-start gap-3 text-sm leading-relaxed sm:text-base"
                  >
                    <CheckCircle2Icon
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project Gallery */}
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <Eyebrow label="From the Field" className="text-primary" />
                  <h2 className="mt-2 font-serif text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
                    Project Gallery
                  </h2>
                </div>
                <span className="text-muted-foreground text-xs font-semibold">
                  {project.gallery.length} photos
                </span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {project.gallery.map((photo, index) => (
                  <figure
                    key={`${photo.src}-${index}`}
                    className="bg-card border-line group overflow-hidden rounded-xl border"
                  >
                    <div className="bg-muted aspect-4/3 overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="text-muted-foreground p-3.5 text-xs leading-relaxed">
                      {photo.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>

          {/* Right Aside: Progress & Support */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Progress Card */}
            <div className="bg-card border-line rounded-2xl border p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Project Progress
                </span>
                <span className="text-primary font-serif text-xl font-extrabold">
                  {project.progress.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="bg-muted mt-3 h-2.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${project.progress.percentage}%` }}
                />
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-2">
                {project.progress.goalLabel ? (
                  <div>
                    <p className="font-serif text-2xl font-extrabold tracking-[-0.03em]">
                      {project.progress.raisedLabel || "₦0"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      raised of {project.progress.goalLabel} goal
                    </p>
                  </div>
                ) : (
                  <p className="font-serif text-2xl font-extrabold tracking-[-0.03em]">
                    {project.progress.percentage}%
                    <span className="text-muted-foreground ml-1.5 text-xs font-normal">
                      complete
                    </span>
                  </p>
                )}

                <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <UsersIcon size={14} className="text-primary" />
                  <span>{project.progress.supportersCount} partners</span>
                </div>
              </div>

              {/* Milestones */}
              <div className="border-line mt-6 border-t pt-5">
                <h3 className="text-xs font-semibold tracking-wider uppercase">
                  Key Milestones
                </h3>
                <ul className="mt-3.5 space-y-3">
                  {project.progress.milestones.map((milestone) => (
                    <li
                      key={milestone.label}
                      className="flex items-start gap-2.5 text-xs leading-relaxed"
                    >
                      {milestone.completed ? (
                        <CheckCircle2Icon
                          size={15}
                          className="text-green mt-0.5 shrink-0"
                        />
                      ) : (
                        <CircleDashedIcon
                          size={15}
                          className="text-muted-foreground mt-0.5 shrink-0"
                        />
                      )}
                      <span
                        className={
                          milestone.completed
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {milestone.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-navy rounded-2xl border border-white/15 p-6 text-white shadow-md">
              <div className="text-accent flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <HeartHandshakeIcon size={15} />
                <span>Support This Initiative</span>
              </div>

              <h3 className="mt-2 font-serif text-xl font-extrabold tracking-[-0.03em]">
                Partner with us on {project.code}
              </h3>

              <p className="text-secondary/80 mt-2 text-sm leading-relaxed">
                Give toward this project or volunteer your time with our team in
                Kudenda, Kaduna.
              </p>

              <div className="mt-5 flex flex-col gap-2.5">
                <Button
                  variant="red"
                  size="lg"
                  nativeButton={false}
                  render={
                    <Link
                      href={`/partner?project=${encodeURIComponent(project.slug)}`}
                    />
                  }
                  className="w-full"
                >
                  <span>Support This Project</span>
                  <ArrowUpRightIcon />
                </Button>

                <Button
                  variant="glass"
                  size="default"
                  nativeButton={false}
                  render={<Link href="/services" />}
                  className="w-full"
                >
                  <span>Plan Your Visit</span>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
};

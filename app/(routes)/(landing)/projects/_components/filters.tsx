/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";

import { cn } from "cn";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiMapPinRangeLine } from "react-icons/ri";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import {
  type ProjectCategory,
  type ProjectItem,
  projectCategories,
  projectsData,
} from "~/lib/projects";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function RadialProgress({ percentage }: { percentage: number }) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <div className="relative flex size-12 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 44 44"
        className="size-12 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          className="text-muted"
        />
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold tabular-nums">
        {clamped}%
      </span>
    </div>
  );
}

function ProjectLedgerCard({ project }: { project: ProjectItem }) {
  const completedMilestones = project.progress.milestones.filter(
    (m) => m.completed,
  ).length;
  const totalMilestones = project.progress.milestones.length;

  return (
    <article className="group bg-card border-line relative flex flex-col justify-between rounded-2xl border shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Top Dossier Strip */}
      <div>
        <div className="border-line relative flex items-center justify-between gap-2 border-b border-dashed px-6 pt-5 pb-4">
          {/* Ledger side notches */}
          <span
            aria-hidden="true"
            className="bg-background border-line absolute top-full -left-2.5 size-5 -translate-y-1/2 rounded-full border"
          />
          <span
            aria-hidden="true"
            className="bg-background border-line absolute top-full -right-2.5 size-5 -translate-y-1/2 rounded-full border"
          />

          <div className="flex items-center gap-2.5">
            <span className="bg-navy text-accent rounded-md px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider">
              {project.code}
            </span>
            <Eyebrow
              label={project.category}
              className="text-muted-foreground"
              line={false}
            />
          </div>

          <span className="text-foreground/80 inline-flex items-center gap-1.5 text-[11px] font-semibold">
            <span
              className={cn(
                "size-2 rounded-full",
                project.status === "Active"
                  ? "bg-green"
                  : project.status === "Ongoing"
                    ? "bg-primary"
                    : "bg-gold",
              )}
            />
            {project.status}
          </span>
        </div>

        {/* Main Body + Specimen Photo */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground flex items-center gap-1 text-[11px] font-medium">
                <RiMapPinRangeLine
                  size={12}
                  className="text-primary shrink-0"
                />
                <span className="truncate">{project.location}</span>
              </div>

              <h2 className="mt-1.5 font-serif text-xl leading-snug font-extrabold tracking-[-0.03em]">
                <Link
                  href={`/projects/${project.slug}`}
                  className="group-hover:text-primary transition-colors before:absolute before:inset-0"
                >
                  {project.title}
                </Link>
              </h2>
            </div>

            {/* Tilted Specimen Image Frame */}
            <div className="bg-navy border-line relative size-16 shrink-0 rotate-2 overflow-hidden rounded-lg border-2 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-0">
              <img
                src={project.bannerImage}
                alt={project.bannerAlt}
                className="size-full object-cover"
              />
            </div>
          </div>

          <p className="text-muted-foreground mt-3.5 line-clamp-3 text-sm leading-relaxed">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Bottom Ledger Metric + Action */}
      <div className="px-6 pb-6">
        <div className="bg-muted/60 border-line flex items-center justify-between gap-3 rounded-xl border p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <RadialProgress percentage={project.progress.percentage} />
            <div className="min-w-0">
              <p className="truncate font-serif text-base font-extrabold tracking-[-0.02em]">
                {project.progress.raisedLabel}
              </p>
              <p className="text-muted-foreground truncate text-[11px]">
                of {project.progress.goalLabel} ·{" "}
                {project.progress.supportersCount} partners
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-foreground/80 inline-flex items-center gap-1 text-[11px] font-semibold">
              <IoMdCheckmarkCircleOutline size={12} className="text-green" />
              {completedMilestones}/{totalMilestones}
            </span>
            <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
              Milestones
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs font-semibold">
          <span className="text-muted-foreground font-mono text-[11px]">
            {project.timeline}
          </span>
          <span className="text-primary group-hover:text-maroon inline-flex items-center gap-1 transition-colors">
            <span>Open dossier</span>
            <ArrowUpRightIcon
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </article>
  );
}

export const Filters = () => {
  const [selectedCategory, setSelectedCategory] =
    React.useState<ProjectCategory>("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projectsData
      : projectsData.filter((project) => project.category === selectedCategory);

  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="border-line flex flex-col justify-between gap-4 pb-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Filter initiatives
            </span>
            <p className="text-muted-foreground mt-1 text-sm">
              Showing {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Project categories"
            className="flex flex-wrap gap-2"
          >
            {projectCategories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                    active
                      ? "bg-navy border-navy text-white"
                      : "border-line bg-card text-foreground/80 hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </Container>

      <Container size="lg">
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectLedgerCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
};

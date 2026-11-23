"use client";

import { cn } from "cn";
import { ArrowUpRightIcon, CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Container } from "~/components/shared/container";

type ProjectCategory = "All" | "Outreach" | "Infrastructure" | "Discipleship";

interface Project {
  id: string;
  code: string;
  title: string;
  category: Exclude<ProjectCategory, "All">;
  status: "Active" | "In Progress" | "Ongoing";
  location: string;
  summary: string;
  highlight: string;
}

const categories: ProjectCategory[] = [
  "All",
  "Outreach",
  "Infrastructure",
  "Discipleship",
];

const projects: Project[] = [
  {
    id: "kudenda-community-outreach",
    code: "PRJ-01",
    title: "Kudenda Neighborhood Care & Relief",
    category: "Outreach",
    status: "Ongoing",
    location: "Kudenda, Kaduna",
    summary:
      "Monthly food drives, family support parcels, and practical community care for households across Kudenda and surrounding wards.",
    highlight: "Monthly community distribution",
  },
  {
    id: "sanctuary-media-acoustic-upgrade",
    code: "PRJ-02",
    title: "Gathering Space & Media Readiness",
    category: "Infrastructure",
    status: "In Progress",
    location: "Kudenda, Kaduna",
    summary:
      "Improving seating comfort, acoustic clarity, and audio-visual reliability for Wednesday, Saturday, and Sunday gatherings.",
    highlight: "Sound & seating expansion",
  },
  {
    id: "nextgen-mentorship-hub",
    code: "PRJ-03",
    title: "Youth & Young Adults Mentorship",
    category: "Discipleship",
    status: "Active",
    location: "Kaduna",
    summary:
      "Weekly small-group mentorship, practical life skills, and scripture study designed to equip young believers and students.",
    highlight: "Weekly cohort & study",
  },
  {
    id: "back-to-school-drive",
    code: "PRJ-04",
    title: "Back-to-School Essentials Drive",
    category: "Outreach",
    status: "Active",
    location: "Kudenda, Kaduna",
    summary:
      "Providing notebooks, school supplies, and learning support to children ahead of new academic terms.",
    highlight: "Termly student support",
  },
];

export const Filters = () => {
  const [selectedCategory, setSelectedCategory] =
    React.useState<ProjectCategory>("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="border-line flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
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
            {categories.map((category) => {
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

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-card border-line flex flex-col justify-between rounded-xl border p-6 shadow-xs transition-shadow hover:shadow-md sm:p-7"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-muted-foreground font-mono text-xs font-semibold">
                    {project.code} · {project.category}
                  </span>
                  <span className="bg-muted text-secondary-foreground rounded-full px-3 py-1 text-[11px] font-semibold">
                    {project.status}
                  </span>
                </div>

                <h2 className="mt-4 font-serif text-2xl font-extrabold tracking-[-0.03em]">
                  {project.title}
                </h2>

                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                  {project.summary}
                </p>
              </div>

              <div className="border-line mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
                <div className="text-foreground/80 flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle2Icon
                    size={15}
                    className="text-primary shrink-0"
                  />
                  <span>{project.highlight}</span>
                  <span className="text-muted-foreground">
                    · {project.location}
                  </span>
                </div>

                <Link
                  href={`/partner?project=${encodeURIComponent(project.id)}`}
                  className="text-primary hover:text-maroon inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                >
                  <span>Support</span>
                  <ArrowUpRightIcon size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

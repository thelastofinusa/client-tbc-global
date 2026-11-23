import { ArrowLeftIcon, CalendarDaysIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { RiMapPinRangeLine } from "react-icons/ri";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import type { ProjectItem } from "~/lib/projects";

export const ProjectDetailsHeroComponents: React.FC<{
  project: ProjectItem;
}> = ({ project }) => {
  return (
    <section className="bg-navy border-b border-white/10 pt-10 pb-14 text-white md:pt-14 md:pb-20">
      <Container>
        <div className="max-w-2xl">
          <Link
            href="/projects"
            className="text-secondary/80 inline-flex items-center gap-2 text-xs font-semibold transition-colors hover:text-white"
          >
            <ArrowLeftIcon size={14} />
            <span>Back to all projects</span>
          </Link>

          <Eyebrow
            label={`${project.category} · ${project.status}`}
            className="text-accent mt-6"
          />

          <h1 className="mt-4 max-w-4xl font-serif text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl md:text-6xl">
            {project.title}
          </h1>

          <p className="text-secondary/80 mt-4 max-w-xl text-sm leading-[1.75] sm:text-base">
            {project.summary}
          </p>

          <div className="text-secondary/75 mt-6 flex flex-wrap items-center gap-5 text-xs font-medium sm:text-sm">
            <span className="flex items-center gap-1.5">
              <RiMapPinRangeLine size={15} className="text-accent" />
              {project.location}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDaysIcon size={15} className="text-accent" />
              {project.timeline}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

import type React from "react";
import { Container } from "~/components/shared/container";
import type { ProjectItem } from "~/lib/projects";

export const Banner: React.FC<{ project: ProjectItem }> = ({ project }) => {
  if (!project.bannerImage) return null;

  return (
    <section className="-mt-6 md:-mt-10">
      <Container size="lg">
        <div className="bg-navy border-line overflow-hidden rounded-2xl border shadow-lg">
          <div className="relative aspect-video max-h-140 w-full">
            <img
              src={project.bannerImage}
              alt={project.bannerAlt}
              className="size-full object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

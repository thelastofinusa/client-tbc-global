import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

export const ProjectsHeroComponent = () => {
  return (
    <section className="bg-navy border-b border-white/10 py-16 text-white md:py-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow label="Our Projects" className="text-accent" />
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Faith in action across our community.
          </h1>
          <p className="text-secondary/80 mt-5 max-w-xl text-sm leading-[1.75] sm:text-base">
            Every initiative is built to serve families in Kudenda and beyond
            through consistent care, practical support, and spiritual growth.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              variant="red"
              size="lg"
              nativeButton={false}
              render={<Link href="/partner" />}
            >
              <span>Partner on a project</span>
              <ArrowUpRightIcon />
            </Button>
            <Button
              variant="glass"
              size="lg"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              <span>Service &amp; visit times</span>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

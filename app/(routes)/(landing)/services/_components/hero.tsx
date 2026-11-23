import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { siteConfig } from "~/config/site.config";

export const ServicesHeroComponent = () => {
  return (
    <section className="bg-navy border-b border-white/10 py-16 text-white md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <Eyebrow label="Services & Visits" className="text-accent" />
            <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl md:text-6xl">
              Gather with us in Kudenda, Kaduna.
            </h1>
            <p className="text-secondary/80 mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
              Join us across our weekly rhythm—Wednesdays, Saturdays, and our
              Sunday service at 9:00 AM. Plan a visit or get directions ahead of
              time.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                variant="red"
                size="lg"
                nativeButton={false}
                render={
                  <a
                    href={siteConfig.map.direction}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <span>Get directions</span>
                <ArrowUpRightIcon />
              </Button>
              <Button
                variant="cream"
                size="lg"
                nativeButton={false}
                render={<Link href="/sign-up" />}
              >
                <span>Join the Family</span>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-6">
            <span className="text-accent text-xs font-semibold tracking-wider uppercase">
              Next Weekly Highlight
            </span>
            <p className="mt-2 font-serif text-2xl font-extrabold tracking-[-0.03em]">
              Sunday service · 9:00 AM
            </p>
            <p className="text-secondary/75 mt-1 text-sm">
              Kudenda, Kaduna · Wed · Sat · Sun
            </p>
            <p className="mt-4 font-mono text-xs text-white/60">
              Coords: 10.478445, 7.368035
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

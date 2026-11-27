import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { siteConfig } from "~/config/site.config";
import { getServices } from "~/lib/data/services";

export const ServicesHeroComponent = async () => {
  const services = await getServices();
  // "Highlight on the website" in Sanity, else the first service.
  const highlight = services.find((s) => s.featured) ?? services[0];

  return (
    <section className="bg-navy border-b border-white/10 py-16 text-white md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div className="max-w-xl">
            <Eyebrow label="Services & Expressions" className="text-accent" />
            <h1 className="mt-6 font-serif text-[clamp(48px,8vw,78px)] leading-[0.85] font-extrabold tracking-[-0.075em]">
              One house, many expressions.
            </h1>
            <p className="text-secondary/80 mt-5 max-w-xl text-sm leading-[1.75] sm:text-base">
              Gather with us in Kudenda, Kaduna every week, then step into the
              expressions where the culture of the house is lived out: Christ,
              the Word, prayer, fellowship, commitment, service and growth.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                variant="red"
                size="lg"
                nativeButton={false}
                render={<a href="#services" />}
              >
                <span>See the schedule</span>
                <ArrowUpRightIcon />
              </Button>
              <Button
                variant="glass"
                size="lg"
                nativeButton={false}
                render={<Link href="/sign-up" />}
              >
                <span>Join the Family</span>
              </Button>
            </div>
          </div>

          {highlight && (
            <div className="rounded-xl border border-white/15 bg-white/5 p-6">
              <Eyebrow label="Join Us" />
              <p className="mt-2 text-xl font-extrabold tracking-[-0.03em]">
                {highlight.name}
              </p>
              <p className="text-secondary/75 mt-1 text-sm">
                {highlight.day} - {highlight.time}
              </p>
              <a
                href={siteConfig.map.direction}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent mt-4 inline-flex text-xs font-semibold underline-offset-4 hover:underline"
              >
                Get directions
              </a>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

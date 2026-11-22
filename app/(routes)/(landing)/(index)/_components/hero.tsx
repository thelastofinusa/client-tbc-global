"use client";

import { Image } from "keltra/image/next";
import { CalendarDaysIcon, ChevronRightIcon, FlameIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { siteConfig } from "~/config/site.config";

const motto = ["Love God", "Serve People", "Transform Our Community"];

export const HomeHeroComponent = () => {
  return (
    <section aria-label="Hero" className="relative w-full overflow-hidden">
      <Container>
        <div className="grid items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          {/* ─── Left: message ─── */}
          <div>
            <Eyebrow
              lineClass="bg-primary"
              label="Kudenda, Kaduna · Everyone is welcome"
            />

            <h1 className="my-6 font-serif text-[clamp(48px,7vw,92px)] leading-[0.95] font-extrabold tracking-[-0.075em]">
              Faith that
              <br />
              moves <em className="text-primary not-italic">forward.</em>
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md text-sm leading-[1.75] sm:text-base">
              We’re building a community where young people find purpose,
              families find hope, and faith turns into action.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/sign-up" />}
                className="flex-1 sm:flex-none"
              >
                <span>Join the family</span>
                <ChevronRightIcon size={16} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={<Link href="/projects" />}
              >
                <span>See what we’re building</span>
              </Button>
            </div>

            <p className="text-muted-foreground mt-8 flex items-center gap-2 text-xs">
              <FlameIcon size={14} className="text-primary" />
              Gathering every Wednesday, Saturday and Sunday
            </p>
          </div>

          {/* ─── Right: framed photo + floating card ─── */}
          <div className="relative isolate">
            {/* Offset color block behind the photo */}
            <div
              aria-hidden="true"
              className="bg-primary absolute -right-3 -bottom-3 -z-10 hidden size-3/4 sm:block"
            />

            <div className="relative aspect-4/5 w-full overflow-hidden sm:aspect-5/4 lg:aspect-auto lg:h-155">
              <Image
                src="/hero.avif"
                alt="Faith that moves forward."
                className="pointer-events-none absolute inset-0 size-full object-cover object-[58%_center]"
                fill
                loading="eager"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent"
              />

              <span className="bg-navy absolute top-4 left-4 flex items-center gap-2 px-3 py-2 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                <FlameIcon size={14} className="text-accent" />
                {siteConfig.slogan}
              </span>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute right-4 bottom-4 left-4 sm:right-auto sm:w-80"
              >
                <Link
                  href="/services"
                  aria-label="See service details"
                  className="bg-background text-foreground group flex w-full items-center gap-4 p-4 shadow-xl"
                >
                  <div className="text-primary bg-muted grid size-10 shrink-0 place-items-center">
                    <CalendarDaysIcon size={18} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-muted-foreground font-serif text-[9px] font-semibold tracking-[0.14em]">
                      NEXT GATHERING
                    </span>
                    <strong className="text-sm font-semibold">
                      Sunday service · 9:00 AM
                    </strong>
                    <small className="text-muted-foreground text-xs">
                      Kudenda, Kaduna
                    </small>
                  </div>
                  <span className="text-primary grid size-10 place-items-center transition-transform group-hover:translate-x-0.5">
                    <ChevronRightIcon size={18} />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>

      {/* ─── Motto strip ─── */}
      <div className="bg-navy text-white">
        <Container>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4">
            {motto.map((item, i) => (
              <li
                key={item}
                className="flex items-center gap-6 font-serif text-[11px] font-semibold tracking-[0.16em] uppercase"
              >
                {item}
                {i < motto.length - 1 && (
                  <FlameIcon
                    size={12}
                    aria-hidden="true"
                    className="text-accent max-sm:hidden"
                  />
                )}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
};

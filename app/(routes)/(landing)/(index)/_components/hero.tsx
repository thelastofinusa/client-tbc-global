"use client";

import { Image } from "keltra/image/next";
import { CalendarDaysIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";

export const HomeHeroComponent = () => {
  return (
    <section
      aria-label="Hero"
      className="text-primary-foreground relative w-full overflow-hidden"
    >
      {/* Keltra Image layer */}
      <Image
        src="/hero.avif"
        alt="Faith that moves forward."
        className="pointer-events-none absolute inset-0 size-full object-cover object-[center_42%] max-md:object-[57%_center]"
        fill
        loading="eager"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(20,15,13,0.83)_0%,rgba(22,15,13,0.63)_40%,rgba(23,15,13,0.08)_100%),linear-gradient(0deg,rgba(20,15,13,0.34),transparent_45%)] max-md:bg-[linear-gradient(90deg,#150f0dd9,#180f0d56_90%),linear-gradient(0deg,#150f0db0,transparent_55%)]"
      />

      <Container>
        <div className="relative py-16 md:py-24 md:pt-28 lg:pt-32">
          <h1 className="mb-6 font-serif text-[clamp(56px,7vw,88px)] leading-[0.97] font-extrabold tracking-[-0.075em] max-md:text-5xl">
            Faith that
            <br />
            moves <em className="text-accent not-italic">forward.</em>
          </h1>

          <p className="text-secondary mb-7 max-w-102.5 text-sm max-sm:max-w-82.5 sm:text-base sm:leading-[1.75]">
            We're building a community where young people find purpose, families
            find hope, and faith turns into action.
          </p>

          <div className="flex gap-2 md:gap-4">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/join" />}
            >
              <span>Join the family</span>
              <ChevronRightIcon size={16} />
            </Button>
            <Button
              variant="glass"
              size="lg"
              nativeButton={false}
              render={<Link href="/projects" />}
              className="flex-1 sm:flex-none"
            >
              <span>See what we're building</span>
            </Button>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 max-md:mt-11 md:flex-row md:items-end">
            <div className="flex items-center gap-3 text-[9px] tracking-[0.16em]">
              <span className="bg-accent h-px w-7" />
              <span className="font-serif font-semibold">
                KUDEDA, KADUNA · EVERYONE IS WELCOME
              </span>
            </div>

            <Link
              href="/services"
              aria-label="See service details"
              className="text-ink bg-background flex w-full items-center gap-4 p-4 shadow-[0_12px_40px_#17100d33] sm:max-w-84"
            >
              <div className="text-red bg-card grid size-10 shrink-0 place-items-center">
                <CalendarDaysIcon size={18} />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-muted-foreground font-serif text-[8px] font-semibold tracking-[0.14em]">
                  NEXT GATHERING
                </span>
                <strong className="text-sm font-semibold">
                  Sunday service - 9:00 AM
                </strong>
                <small className="text-muted-foreground text-xs">
                  Kudenda, Kaduna
                </small>
              </div>
              <span className="text-red grid size-10 place-items-center transition-transform hover:translate-x-0.5">
                <ChevronRightIcon size={18} />
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

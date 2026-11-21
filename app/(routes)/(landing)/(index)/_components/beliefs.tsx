import { Image } from "keltra/image/next";
import { ArrowRight, ChevronRightIcon } from "lucide-react";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { siteConfig } from "~/config/site.config";

export const BeliefsComponent = () => {
  return (
    <section aria-label="Beliefs" className="relative flex-1 overflow-x-clip">
      {/* Full-bleed split background */}
      <div
        aria-hidden="true"
        className="bg-muted pointer-events-none inset-0 grid grid-cols-1 md:absolute md:grid-cols-3 lg:grid-cols-2"
      >
        <div className="relative z-10 aspect-video overflow-hidden md:aspect-auto md:h-full">
          <Image
            src="/belief.avif"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="bg-muted absolute inset-0 md:relative md:col-span-2 md:h-full lg:col-span-1" />
      </div>

      {/* Foreground content (drives the section's natural height) */}
      <Container>
        <div className="relative z-10 py-8 md:py-10 lg:py-16 xl:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12 lg:grid-cols-2">
            {/* Left spacer on desktop so text sits over the right half */}
            <div className="hidden md:block" />

            {/* Right column content */}
            <div className="flex flex-col md:col-span-2 md:pl-8 lg:col-span-1 lg:pl-10 xl:pl-16">
              <Eyebrow label="Who we are" />

              <h2 className="my-5 font-serif text-3xl font-extrabold tracking-[-0.06em] md:text-4xl md:leading-[1.05] lg:text-5xl">
                Not just a place
                <br className="hidden md:block" /> to go.{" "}
                <br className="md:hidden" /> A place to
                <br className="hidden md:block" />{" "}
                <span className="text-accent">become.</span>
              </h2>
              <p className="mb-7 text-sm leading-[1.75] sm:text-[15px]">
                {siteConfig.description}
              </p>

              <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* 01 — Mission (Muted surface) */}
                <div className="border-line bg-background flex flex-col justify-between border p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-red text-[10px] font-bold tracking-[0.16em]">
                      01
                    </span>
                    <span className="bg-border h-px w-6" />
                  </div>
                  <div>
                    <strong className="font-serif text-base font-bold">
                      Mission
                    </strong>
                    <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed sm:text-sm">
                      Love God. Serve people. Transform our community.
                    </p>
                  </div>
                </div>

                {/* 02 — Vision (Primary surface) */}
                <div className="bg-primary text-primary-foreground flex flex-col justify-between p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-accent text-[10px] font-bold tracking-[0.16em]">
                      02
                    </span>
                    <span className="bg-primary-foreground/30 h-px w-6" />
                  </div>
                  <div>
                    <strong className="font-serif text-base font-bold">
                      Vision
                    </strong>
                    <p className="text-primary-foreground/85 mt-1.5 text-xs leading-relaxed sm:text-sm">
                      To raise a generation burning with purpose.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="dark" size="lg" className="sm:w-max">
                <span>See the rest of our story</span>
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

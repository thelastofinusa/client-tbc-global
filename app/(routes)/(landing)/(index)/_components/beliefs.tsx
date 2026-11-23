import { Image } from "keltra/image/next";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { RiMapPinRangeLine } from "react-icons/ri";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { siteConfig } from "~/config/site.config";

export const BeliefsComponent = () => {
  return (
    <section
      aria-label="Beliefs"
      className="bg-muted relative flex-1 overflow-x-clip"
    >
      <Container className="py-16 md:py-24">
        {/* Header row: statement left, story right */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
          <div className="md:col-span-7">
            <Eyebrow lineClass="bg-primary" label="Who we are" />
            <h2 className="mt-5 font-serif text-4xl leading-[1.02] font-extrabold tracking-[-0.06em] md:text-5xl lg:text-[68px]">
              Not just a place to go.
              <br />A place to <span className="text-primary">become.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-6 md:col-span-5">
            <p className="text-muted-foreground text-sm leading-[1.8] sm:text-[15px]">
              {siteConfig.description}
            </p>
            <Button
              variant="dark"
              size="lg"
              nativeButton={false}
              render={<Link href="/about" />}
            >
              <span>See the rest of our story</span>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>

        {/* Photo + mission / vision */}
        <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-12">
          <div className="relative aspect-[4/3] overflow-hidden md:col-span-5 md:aspect-auto md:min-h-[460px]">
            <Image
              src="/belief.avif"
              alt="Friends celebrating together at a long table"
              fill
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"
            />
            <span className="bg-background text-foreground absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 text-xs font-semibold">
              <RiMapPinRangeLine size={14} className="text-primary" />
              Kudenda, Kaduna
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:col-span-7 md:grid-rows-2">
            {/* Mission */}
            <div className="bg-card border-line flex flex-col justify-between gap-10 border p-7 md:p-10">
              <Eyebrow
                label="01 · Mission"
                className="text-primary"
                lineClass="bg-border"
              />
              <p className="font-serif text-2xl leading-[1.15] font-extrabold tracking-[-0.045em] md:text-3xl lg:text-4xl">
                Love God. Serve people.
                <br />
                Transform our community.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-primary text-primary-foreground flex flex-col justify-between gap-10 p-7 md:p-10">
              <Eyebrow
                label="02 · Vision"
                className="text-accent"
                lineClass="bg-primary-foreground/30"
              />
              <p className="font-serif text-2xl leading-[1.15] font-extrabold tracking-[-0.045em] md:text-3xl lg:text-4xl">
                To raise a generation
                <br />
                burning with purpose.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

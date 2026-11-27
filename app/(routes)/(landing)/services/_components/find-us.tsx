import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { siteConfig } from "~/config/site.config";

export const FindUs = () => {
  return (
    <section className="border-line border-t py-14 md:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Eyebrow label="Plan your visit" className="text-primary" />
            <h2 className="mt-5 font-serif text-5xl font-bold tracking-[-0.06em] md:text-6xl md:leading-[1.05]">
              There’s a seat
              <br />
              <span className="text-primary">waiting for you.</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-[1.75]">
              Join us in Kudenda, Kaduna. Arrive 10 to 15 minutes early so we
              can welcome you, introduce you around, and help you feel right at
              home.
            </p>

            <Button
              variant="red"
              size="lg"
              className="mt-6"
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
          </div>

          <div className="border-line aspect-video overflow-hidden rounded-xl border">
            <iframe
              title="Map to The Burning Church Global"
              src={siteConfig.map.embed}
              className="size-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

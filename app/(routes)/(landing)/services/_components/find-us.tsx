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
            <Eyebrow label="Visit us" className="text-primary" />
            <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-[-0.03em]">
              Come just as you are
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-[1.75]">
              We meet in Kudenda, Kaduna. Arrive 10 to 15 minutes early so our
              welcome team can help you settle in.
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

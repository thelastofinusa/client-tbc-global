import { Image } from "keltra/image/next";
import { Container } from "~/components/shared/container";

export const AboutHeroComponent = () => {
  return (
    <section aria-label="Hero" className="relative w-full overflow-hidden">
      <Container className="py-16 md:py-24">
        <div className="relative">
          <div className="flex items-center gap-3 text-[9px] tracking-[0.16em]">
            <span className="bg-accent h-px w-7" />
            <span className="font-serif font-semibold">
              KUDEDA, KADUNA · EVERYONE IS WELCOME
            </span>
          </div>

          <h1 className="my-6 font-serif text-[clamp(32px,7vw,62px)] leading-[1.08] font-extrabold tracking-[-0.075em] max-md:text-[40px]">
            Our roots run deep. <br className="hidden sm:block" /> Our future is{" "}
            <em className="text-accent not-italic">on fire.</em>
          </h1>

          <p className="text-muted-foreground max-w-lg text-sm sm:text-base">
            The Burning Church began with a simple belief: the love we
            experience in church should be the love we carry into the world.
          </p>

          <div className="relative my-10 aspect-[1.7] w-full overflow-hidden sm:aspect-auto sm:h-80 md:h-97.5">
            <Image
              src="/hero.avif"
              alt="Faith that moves forward."
              className="pointer-events-none absolute inset-0 size-full object-cover object-[center_42%] max-md:object-[57%_center]"
              fill
              loading="eager"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

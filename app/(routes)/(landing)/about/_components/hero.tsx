import { Image } from "keltra/image/next";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

export const AboutHeroComponent = () => {
  return (
    <section
      aria-label="About hero"
      className="relative w-full overflow-hidden"
    >
      <Container className="pt-16 pb-6 md:pt-24 md:pb-10">
        <Eyebrow label="Kudenda, Kaduna · Everyone is welcome" />

        <h1 className="my-6 font-serif text-7xl leading-[0.85] font-extrabold tracking-[-0.075em] md:text-8xl lg:text-[clamp(68px,8vw,118px)]">
          Our roots run deep. <br className="hidden sm:block" /> Our future is{" "}
          <em className="text-primary not-italic">on fire.</em>
        </h1>

        <p className="text-muted-foreground max-w-lg text-sm sm:text-base">
          The Burning Church began with a simple belief: the love we experience
          in church should be the love we carry into the world.
        </p>

        <div className="relative mt-10 aspect-[1.7] w-full overflow-hidden sm:aspect-auto sm:h-80 md:h-97.5">
          <Image
            src="/hero.avif"
            alt="Faith that moves forward."
            className="pointer-events-none absolute inset-0 size-full object-cover object-[center_42%] max-md:object-[57%_center]"
            fill
            loading="eager"
          />
        </div>
      </Container>
    </section>
  );
};

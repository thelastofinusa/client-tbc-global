import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

export const PartnerHeroComponent = () => {
  return (
    <section className="bg-navy border-b border-white/10 py-16 text-white md:py-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow label="Partner With Us" className="text-accent" />
          <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Stand with the mission and impact lives with us.
          </h1>
          <p className="text-secondary/80 mt-5 max-w-xl text-sm leading-[1.75] sm:text-base">
            Partnership is how we sustain weekly gatherings, serve families in
            Kudenda, Kaduna, and grow practical initiatives year-round.
          </p>
        </div>
      </Container>
    </section>
  );
};

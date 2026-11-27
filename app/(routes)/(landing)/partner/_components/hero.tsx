import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

export const PartnerHeroComponent = () => {
  return (
    <section className="bg-navy border-b border-white/10 py-16 text-white md:py-24">
      <Container>
        <div className="max-w-xl">
          <Eyebrow label="Partner With Us" className="text-accent" />
          <h1 className="mt-6 font-serif text-[clamp(48px,8vw,78px)] leading-[0.85] font-bold tracking-[-0.075em]">
            Together in faith,
            <br />
            <span className="text-accent">partners in grace.</span>
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

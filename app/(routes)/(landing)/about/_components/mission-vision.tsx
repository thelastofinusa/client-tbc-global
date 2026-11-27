import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

const headingClass =
  "font-serif font-extrabold tracking-[-0.06em] leading-[1.05]";

export const MissionVision = () => {
  return (
    <section aria-label="Mission and vision" className="w-full">
      <Container className="py-12 md:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col justify-center md:col-span-7">
            <Eyebrow label="Our mission" lineClass="bg-primary" />
            <h2 className="mt-5 font-serif text-5xl font-bold tracking-[-0.06em] md:text-6xl md:leading-[1.05]">
              Rooted in faith,
              <br />
              <span className="text-primary">alive in love.</span>
            </h2>

            <p className="text-muted-foreground mt-6 max-w-md text-sm leading-[1.8] sm:text-base">
              Our faith is more than what happens on Sunday. It shapes how we
              show up for one another throughout the week.
            </p>
          </div>

          <div className="bg-primary text-primary-foreground flex min-h-72 flex-col justify-between gap-10 p-8 md:col-span-5 md:p-10">
            <Eyebrow label="Our vision" className="text-accent" />
            <div>
              <h3
                className={`${headingClass} text-3xl md:text-4xl lg:text-[40px]`}
              >
                A generation burning with purpose.
              </h3>
              <p className="text-primary-foreground/85 mt-4 text-sm leading-[1.8]">
                We see young people discovering their gifts, families finding
                support, and neighbours becoming a stronger community together.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

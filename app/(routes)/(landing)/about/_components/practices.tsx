import { Image } from "keltra/image/next";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

const practices = [
  {
    number: "01",
    title: "Gather",
    description:
      "Worship together and find a community where you can be yourself.",
  },
  {
    number: "02",
    title: "Grow",
    description:
      "Build your faith, ask honest questions, and discover how you can contribute.",
  },
  {
    number: "03",
    title: "Give",
    description:
      "Put compassion into action through projects that support our neighbours.",
  },
];

const headingClass =
  "font-serif font-extrabold tracking-[-0.06em] leading-[1.05]";

export const Practices = () => {
  return (
    <section aria-label="Our rhythms" className="w-full pb-16 md:pb-24">
      <Container>
        <div className="bg-muted p-6 sm:p-8 md:p-14">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow label="What this looks like" lineClass="bg-primary" />
              <h2
                className={`${headingClass} mt-5 text-4xl md:text-5xl lg:text-[64px]`}
              >
                Gather. Grow. <em className="text-primary not-italic">Give.</em>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-[1.8]">
              Three simple rhythms that shape life at The Burning Church.
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-3 md:gap-6">
            {practices.map(({ number, title, description }) => (
              <li
                key={number}
                className="border-foreground/15 hover:border-primary border-t-2 pt-5 transition-colors"
              >
                <span className="text-primary text-xs font-bold tracking-[0.14em]">
                  {number}
                </span>
                <h3
                  className={`${headingClass} mt-3 mb-2 text-3xl md:text-4xl`}
                >
                  {title}
                </h3>
                <p className="text-muted-foreground max-w-xs text-sm leading-[1.8]">
                  {description}
                </p>
              </li>
            ))}
          </ol>

          <div className="relative mt-10 aspect-[2.2] w-full overflow-hidden md:mt-14">
            <Image
              src="/belief.avif"
              alt="A community gathered around a table"
              className="pointer-events-none absolute inset-0 size-full object-cover object-center"
              fill
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

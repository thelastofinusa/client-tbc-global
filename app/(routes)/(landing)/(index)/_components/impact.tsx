import { cn } from "cn";
import { Container } from "~/components/shared/container";
import { CountingNumber } from "~/components/shared/count-number";
import { Eyebrow } from "~/components/shared/eyebrow";

const impactStats = [
  {
    value: 5210,
    suffix: "+",
    suffixClassName: "text-primary",
    label: "people in our community",
  },
  {
    value: 209,
    suffix: null,
    suffixClassName: "",
    label: "students to sponsor",
  },
  {
    value: 85,
    suffix: "%",
    suffixClassName: "text-accent",
    label: "of Mount Zion built",
  },
];

export const ImpactComponent = () => {
  return (
    <section aria-label="Impact" className="flex-1 overflow-x-clip">
      <Container className="relative py-16 md:py-24">
        <div className="relative grid grid-cols-1 gap-y-10 md:grid-cols-[1fr_1.5fr] md:gap-x-15 md:gap-y-0">
          <div>
            <Eyebrow lineClass="bg-primary" label="Faith, made visible" />

            <h2 className="my-5 font-serif text-3xl font-extrabold tracking-[-0.06em] md:text-4xl md:leading-[1.05] lg:text-5xl">
              Good things happen
              <br />
              when we show up.
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-3">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="border-line flex flex-col gap-1.5 border-l pl-6"
              >
                <strong className="flex items-end gap-1 font-serif text-3xl leading-none font-medium tracking-[-0.06em] tabular-nums md:text-4xl">
                  <CountingNumber
                    fromNumber={0}
                    number={stat.value}
                    thousandSeparator=","
                    inViewMargin="-50px"
                    className="font-mono"
                  />
                  {stat.suffix && (
                    <span
                      className={cn(
                        "text-xl! md:text-2xl! lg:text-3xl! -mb-0.5",
                        stat.suffixClassName,
                      )}
                    >
                      {stat.suffix}
                    </span>
                  )}
                </strong>
                <p className="text-muted-foreground text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Eyebrow
          label="Every number is a real person"
          className="mt-8 ml-auto w-max"
        />
      </Container>
    </section>
  );
};

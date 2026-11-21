import { cn } from "cn";
import { Flame } from "lucide-react";
import { Container } from "~/components/shared/container";

const impactStats = [
  {
    value: "120",
    suffix: "+",
    suffixClassName: "text-primary",
    label: "people in our community",
  },
  {
    value: "40",
    suffix: null,
    suffixClassName: "",
    label: "students to sponsor",
  },
  {
    value: "62",
    suffix: "%",
    suffixClassName: "text-accent",
    label: "of Mount Zion built",
  },
];

export const ImpactComponent = () => {
  return (
    <section aria-label="Impact" className="flex-1 overflow-x-clip">
      <Container size="md" className="relative py-16 md:py-24">
        <div className="relative grid grid-cols-1 gap-y-10 md:grid-cols-[1fr_1.5fr] md:gap-x-15 md:gap-y-0">
          <div>
            <div className="flex items-center gap-3 text-[9px] tracking-[0.16em]">
              <span className="bg-primary h-px w-7" />
              <span className="font-serif font-semibold">
                FAITH, MADE VISIBLE
              </span>
            </div>
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
                <strong className="font-serif text-3xl leading-none font-extrabold tracking-[-0.06em] md:text-4xl">
                  {stat.value}
                  {stat.suffix && (
                    <span
                      className={cn(
                        "text-2xl! md:text-3xl! lg:text-4xl!",
                        stat.suffixClassName,
                      )}
                    >
                      {" "}
                      {stat.suffix}
                    </span>
                  )}
                </strong>
                <p className="text-muted-foreground text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 ml-auto flex w-max items-center gap-2 text-[9px] tracking-[0.16em]">
          <Flame className="text-red size-4 shrink-0" />
          <span className="font-serif font-semibold uppercase">
            Every number is a real person.
          </span>
        </div>
      </Container>
    </section>
  );
};

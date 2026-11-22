import { cn } from "cn";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { HiOutlineUsers } from "react-icons/hi2";
import { PiHammer } from "react-icons/pi";
import { Container } from "~/components/shared/container";
import { CountingNumber } from "~/components/shared/count-number";
import { Eyebrow } from "~/components/shared/eyebrow";

const impactStats = [
  {
    value: 5210,
    suffix: "+",
    label: "people in our community",
    icon: HiOutlineUsers,
    tile: "bg-primary text-primary-foreground",
    suffixClassName: "text-accent",
    labelClassName: "text-primary-foreground/85",
    progress: null,
  },
  {
    value: 209,
    suffix: null,
    label: "students to sponsor",
    icon: HiOutlineAcademicCap,
    tile: "bg-muted text-foreground border border-line",
    suffixClassName: "",
    labelClassName: "text-muted-foreground",
    progress: null,
  },
  {
    value: 85,
    suffix: "%",
    label: "of Mount Zion built",
    icon: PiHammer,
    tile: "bg-navy text-white",
    suffixClassName: "text-accent",
    labelClassName: "text-secondary/80",
    progress: 85,
  },
] as const;

export const ImpactComponent = () => {
  return (
    <section aria-label="Impact" className="flex-1 overflow-x-clip">
      <Container className="relative py-16 md:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow lineClass="bg-primary" label="Faith, made visible" />
            <h2 className="mt-5 font-serif text-3xl font-extrabold tracking-[-0.06em] md:text-4xl md:leading-[1.05] lg:text-5xl">
              Good things happen
              <br />
              when we show up.
            </h2>
          </div>

          <p className="text-muted-foreground max-w-xs text-sm leading-[1.75] md:text-right">
            Every number below is a real person, a real child, a real brick.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-3">
          {impactStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={cn(
                  "flex min-h-60 flex-col justify-between gap-12 p-6 md:min-h-72 md:p-8",
                  stat.tile,
                )}
              >
                <Icon className="size-6 opacity-90" aria-hidden="true" />

                <div>
                  <strong className="flex items-end gap-1 leading-none font-medium tracking-[-0.06em] tabular-nums">
                    <CountingNumber
                      fromNumber={0}
                      number={stat.value}
                      thousandSeparator=","
                      inViewMargin="-50px"
                      className="font-mono text-5xl md:text-4xl lg:text-6xl"
                    />
                    {stat.suffix && (
                      <span
                        className={cn(
                          "-mb-0.5 font-serif text-3xl md:text-4xl",
                          stat.suffixClassName,
                        )}
                      >
                        {stat.suffix}
                      </span>
                    )}
                  </strong>

                  <p className={cn("mt-3 text-sm", stat.labelClassName)}>
                    {stat.label}
                  </p>

                  {stat.progress !== null && (
                    <div
                      role="progressbar"
                      aria-label={stat.label}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={stat.progress}
                      className="mt-5 h-1.5 w-full bg-white/15"
                    >
                      <div
                        className="bg-accent h-full"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

import { cn } from "cn";
import { Suspense } from "react";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { HiOutlineHeart, HiOutlineUsers } from "react-icons/hi2";
import { Container } from "~/components/shared/container";
import { CountingNumber } from "~/components/shared/count-number";
import { Eyebrow } from "~/components/shared/eyebrow";
import { getPublicStats } from "~/lib/data/public-stats";

interface ImpactData {
  members: number;
  sponsors: number;
  partners: number;
}

function buildStats({ members, sponsors, partners }: ImpactData) {
  return [
    {
      value: members,
      suffix: members > 0 ? "+" : null,
      label: "members in our community",
      icon: HiOutlineUsers,
      tile: "bg-primary text-primary-foreground",
      suffixClassName: "text-accent",
      labelClassName: "text-primary-foreground/85",
    },
    {
      value: sponsors,
      suffix: null,
      label: sponsors === 1 ? "sponsor backing our projects" : "sponsors backing our projects",
      icon: HiOutlineAcademicCap,
      tile: "bg-muted text-foreground border border-line",
      suffixClassName: "",
      labelClassName: "text-muted-foreground",
    },
    {
      value: partners,
      suffix: null,
      label: partners === 1 ? "partner walking with us" : "partners walking with us",
      icon: HiOutlineHeart,
      tile: "bg-navy text-white",
      suffixClassName: "text-accent",
      labelClassName: "text-secondary/80",
    },
  ];
}

function ImpactView(data: ImpactData) {
  const impactStats = buildStats(data);

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
            Every number below is counted from real people and real projects.
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
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

async function ImpactData() {
  const stats = await getPublicStats();
  return <ImpactView {...stats} />;
}

export const ImpactComponent = () => (
  <Suspense fallback={<ImpactView members={0} sponsors={0} partners={0} />}>
    <ImpactData />
  </Suspense>
);

import { cn } from "cn";
import { Suspense } from "react";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { HiOutlineUsers } from "react-icons/hi2";
import { PiHammer } from "react-icons/pi";
import { Container } from "~/components/shared/container";
import { CountingNumber } from "~/components/shared/count-number";
import { Eyebrow } from "~/components/shared/eyebrow";
import { getFeaturedProject } from "~/lib/data/projects";
import { getPublicStats } from "~/lib/data/public-stats";

interface ImpactData {
  members: number;
  supporters: number;
  featured?: { title: string; percentage: number };
}

function buildStats({ members, supporters, featured }: ImpactData) {
  return [
    {
      value: members,
      suffix: members > 0 ? "+" : null,
      label: "members in our community",
      icon: HiOutlineUsers,
      tile: "bg-primary text-primary-foreground",
      suffixClassName: "text-accent",
      labelClassName: "text-primary-foreground/85",
      progress: null as number | null,
    },
    {
      value: supporters,
      suffix: null,
      label: "sponsors and partners walking with us",
      icon: HiOutlineAcademicCap,
      tile: "bg-muted text-foreground border border-line",
      suffixClassName: "",
      labelClassName: "text-muted-foreground",
      progress: null as number | null,
    },
    {
      value: featured?.percentage ?? 0,
      suffix: "%",
      label: featured
        ? `of ${featured.title} complete`
        : "of our featured project",
      icon: PiHammer,
      tile: "bg-navy text-white",
      suffixClassName: "text-accent",
      labelClassName: "text-secondary/80",
      progress: (featured?.percentage ?? 0) as number | null,
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
}

async function ImpactData() {
  const [stats, featured] = await Promise.all([
    getPublicStats(),
    getFeaturedProject(),
  ]);

  return (
    <ImpactView
      members={stats.members}
      supporters={stats.supporters}
      featured={
        featured
          ? { title: featured.title, percentage: featured.progress.percentage }
          : undefined
      }
    />
  );
}

export const ImpactComponent = () => (
  <Suspense fallback={<ImpactView members={0} supporters={0} />}>
    <ImpactData />
  </Suspense>
);

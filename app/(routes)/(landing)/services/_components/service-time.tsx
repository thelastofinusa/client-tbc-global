import { FiClock } from "react-icons/fi";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

import { getServices } from "~/lib/data/services";

export const ServiceTime = async () => {
  const services = await getServices();

  return (
    <section id="services" className="scroll-mt-20 py-14 md:py-20">
      <Container>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <Eyebrow label="Weekly Rhythm" className="text-primary" />
            <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              Service Schedule
            </h2>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            {services.map((s) => s.day.slice(0, 3)).join(" · ")}
          </p>
        </div>

        {services.length === 0 && (
          <p className="text-muted-foreground mt-8 text-sm">
            Our schedule is being updated. Check back shortly.
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {services.map((item, index) => (
            <div
              key={item.id}
              className={
                index === 0
                  ? "bg-navy rounded-xl border border-white/15 p-6 text-white shadow-md sm:p-7"
                  : "bg-card border-line rounded-xl border p-6 shadow-xs sm:p-7"
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={
                    index === 0
                      ? "text-accent text-xs font-semibold tracking-wider uppercase"
                      : "text-primary text-xs font-semibold tracking-wider uppercase"
                  }
                >
                  {item.day}
                </span>
                <span
                  className={
                    index === 0
                      ? "rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white"
                      : "bg-muted text-secondary-foreground rounded-full px-3 py-1 text-[11px] font-semibold"
                  }
                >
                  {item.kind === "weekly" ? "Weekly" : "Special event"}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-extrabold tracking-[-0.03em]">
                {item.name}
              </h3>

              <div
                className={
                  index === 0
                    ? "text-accent mt-3 flex items-center gap-2 text-sm font-semibold"
                    : "text-foreground mt-3 flex items-center gap-2 text-sm font-semibold"
                }
              >
                <FiClock size={15} />
                <span>{item.time}</span>
              </div>

              {item.description && (
              <p
                className={
                  index === 0
                    ? "text-secondary/80 mt-3 text-sm leading-relaxed"
                    : "text-muted-foreground mt-3 text-sm leading-relaxed"
                }
              >
                {item.description}
              </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

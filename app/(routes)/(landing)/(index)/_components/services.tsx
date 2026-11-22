import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { RiMapPinRangeLine } from "react-icons/ri";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

// TODO: confirm Wednesday and Saturday times (and names) with the ministry.
const gatherings = [
  {
    day: "Wed",
    title: "Midweek gathering",
    time: "Time coming soon",
    highlight: false,
  },
  {
    day: "Sat",
    title: "Saturday gathering",
    time: "Time coming soon",
    highlight: false,
  },
  {
    day: "Sun",
    title: "Sunday service",
    time: "9:00 AM",
    highlight: true,
  },
];

export const ServicesComponent = () => {
  return (
    <section aria-label="Services" className="flex-1 overflow-x-clip">
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.3fr] md:gap-x-16">
          <div className="flex flex-col items-start">
            <Eyebrow lineClass="bg-primary" label="Join us this week" />

            <h2 className="my-5 font-serif text-3xl font-extrabold tracking-[-0.06em] md:text-4xl md:leading-[1.05] lg:text-5xl">
              Three days a week,
              <br />
              one open door.
            </h2>

            <p className="text-muted-foreground max-w-sm text-sm leading-[1.75] sm:text-[15px]">
              Come as you are. Whether it’s your first time or your hundredth,
              there’s a seat and a warm welcome waiting for you.
            </p>

            <Button
              variant="dark"
              size="lg"
              className="mt-8"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              <span>Plan your visit</span>
              <ChevronRightIcon size={16} />
            </Button>
          </div>

          <ol className="flex flex-col gap-3">
            {gatherings.map(({ day, title, time, highlight }) => (
              <li
                key={day}
                className={
                  highlight
                    ? "bg-primary text-primary-foreground border-primary grid grid-cols-[64px_1fr] items-center gap-x-5 gap-y-3 border p-5 sm:grid-cols-[72px_1fr_auto] md:p-6"
                    : "bg-card border-line grid grid-cols-[64px_1fr] items-center gap-x-5 gap-y-3 border p-5 sm:grid-cols-[72px_1fr_auto] md:p-6"
                }
              >
                <span
                  className={
                    highlight
                      ? "text-accent font-serif text-3xl font-extrabold tracking-[-0.05em] uppercase md:text-4xl"
                      : "text-primary font-serif text-3xl font-extrabold tracking-[-0.05em] uppercase md:text-4xl"
                  }
                >
                  {day}
                </span>

                <div>
                  <h3 className="font-serif text-lg font-bold tracking-[-0.02em] md:text-xl">
                    {title}
                  </h3>
                  <p
                    className={
                      highlight
                        ? "text-primary-foreground/80 mt-1 flex items-center gap-1.5 text-xs"
                        : "text-muted-foreground mt-1 flex items-center gap-1.5 text-xs"
                    }
                  >
                    <RiMapPinRangeLine size={13} />
                    Kudenda, Kaduna
                  </p>
                </div>

                <span
                  className={
                    highlight
                      ? "col-start-2 text-sm font-semibold sm:col-start-auto"
                      : "text-muted-foreground col-start-2 text-sm font-semibold sm:col-start-auto"
                  }
                >
                  {time}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
};

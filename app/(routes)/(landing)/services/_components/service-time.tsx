import { ClockIcon } from "lucide-react";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

interface GatheringSchedule {
  day: string;
  title: string;
  time: string;
  cadence: string;
  description: string;
  featured?: boolean;
}

const schedule: GatheringSchedule[] = [
  {
    day: "Sunday",
    title: "Main Sunday Gathering",
    time: "9:00 AM",
    cadence: "Weekly · Main Service",
    description:
      "Our primary weekly gathering featuring worship, biblical teaching, prayer, and fellowship for the whole family.",
    featured: true,
  },
  {
    day: "Wednesday",
    title: "Midweek Word & Prayer",
    time: "5:30 PM",
    cadence: "Weekly · Midweek",
    description:
      "Focused midweek teaching, intercession, and encouragement to carry you through the rest of the week.",
  },
  {
    day: "Saturday",
    title: "Prep, Fellowship & Outreach",
    time: "10:00 AM",
    cadence: "Weekly · Community",
    description:
      "Team preparation, small-group connection, and local community outreach across Kudenda.",
  },
];

export const ServiceTime = () => {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <Eyebrow label="Weekly Rhythm" className="text-primary" />
            <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              Service Schedule
            </h2>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Wed · Sat · Sun
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {schedule.map((item) => (
            <div
              key={item.day}
              className={
                item.featured
                  ? "bg-navy rounded-xl border border-white/15 p-6 text-white shadow-md sm:p-7"
                  : "bg-card border-line rounded-xl border p-6 shadow-xs sm:p-7"
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={
                    item.featured
                      ? "text-accent text-xs font-semibold tracking-wider uppercase"
                      : "text-primary text-xs font-semibold tracking-wider uppercase"
                  }
                >
                  {item.day}
                </span>
                <span
                  className={
                    item.featured
                      ? "rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white"
                      : "bg-muted text-secondary-foreground rounded-full px-3 py-1 text-[11px] font-semibold"
                  }
                >
                  {item.cadence}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-extrabold tracking-[-0.03em]">
                {item.title}
              </h3>

              <div
                className={
                  item.featured
                    ? "text-accent mt-3 flex items-center gap-2 text-sm font-semibold"
                    : "text-foreground mt-3 flex items-center gap-2 text-sm font-semibold"
                }
              >
                <ClockIcon size={15} />
                <span>{item.time}</span>
              </div>

              <p
                className={
                  item.featured
                    ? "text-secondary/80 mt-3 text-sm leading-relaxed"
                    : "text-muted-foreground mt-3 text-sm leading-relaxed"
                }
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

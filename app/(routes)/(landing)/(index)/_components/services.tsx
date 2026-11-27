import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { RiMapPinRangeLine } from "react-icons/ri";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { getServices } from "~/lib/data/services";

export const ServicesComponent = async () => {
  const services = await getServices();
  const hasFeatured = services.some((s) => s.featured);

  const gatherings = services.map((s, index) => ({
    id: s.id,
    badge: (s.weekday ?? s.day ?? s.kind).slice(0, 3),
    title: s.name,
    time: s.time,
    location: s.location,
    highlight: s.featured || (index === 0 && !hasFeatured),
  }));

  return (
    <section aria-label="Services" className="flex-1 overflow-x-clip">
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.3fr] md:gap-x-16">
          <div className="flex flex-col items-start">
            <Eyebrow lineClass="bg-primary" label="Gather with us" />

            <h2 className="my-5 font-serif text-5xl font-extrabold tracking-[-0.06em] md:text-6xl md:leading-[1.05]">
              Many moments,
              <br />
              one open door.
            </h2>

            <p className="text-muted-foreground max-w-md text-sm leading-[1.75] sm:text-[15px]">
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
            {gatherings.length === 0 && (
              <li className="text-muted-foreground text-sm">
                Our schedule is being updated. Check back shortly.
              </li>
            )}
            {gatherings.map(
              ({ id, badge, title, time, location, highlight }) => (
                <li
                  key={id}
                  className={
                    highlight
                      ? "bg-primary text-primary-foreground border-primary grid grid-cols-[64px_1fr] items-center gap-x-5 gap-y-3 border p-5 sm:grid-cols-[72px_1fr_auto] md:p-6"
                      : "bg-card border-line grid grid-cols-[64px_1fr] items-center gap-x-5 gap-y-3 border p-5 sm:grid-cols-[72px_1fr_auto] md:p-6"
                  }
                >
                  <span
                    className={
                      highlight
                        ? "text-accent font-serif text-3xl font-extrabold tracking-tighter uppercase md:text-4xl"
                        : "text-primary font-serif text-3xl font-extrabold tracking-tighter uppercase md:text-4xl"
                    }
                  >
                    {badge}
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
                      {location}
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
              ),
            )}
          </ol>
        </div>
      </Container>
    </section>
  );
};

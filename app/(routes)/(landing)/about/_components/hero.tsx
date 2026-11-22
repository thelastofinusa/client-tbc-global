import { Image } from "keltra/image/next";
import {
  ChevronRightIcon,
  FlameIcon,
  HeartIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

const values = [
  {
    number: "01",
    icon: HeartIcon,
    title: "Love that shows up",
    description:
      "We choose kindness that moves beyond good intentions and into everyday life.",
  },
  {
    number: "02",
    icon: UsersIcon,
    title: "Everyone belongs",
    description:
      "We make space for different stories, ages, questions, and ways to serve.",
  },
  {
    number: "03",
    icon: FlameIcon,
    title: "Purpose in every person",
    description:
      "We encourage people to discover their gifts and use them with confidence.",
  },
  {
    number: "04",
    icon: MapPinIcon,
    title: "Rooted in community",
    description:
      "We are proud to call Kudende home and committed to its people and future.",
  },
];

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

export const AboutHeroComponent = () => {
  return (
    <section aria-label="Hero" className="relative w-full overflow-hidden">
      <Container className="py-16 md:py-24">
        <div className="relative">
          {/* ─── Intro + photo (unchanged) ─── */}
          <Eyebrow label="Kudenda, Kaduna · Everyone is welcome" />

          <h1 className="my-6 font-serif text-[clamp(32px,7vw,62px)] leading-[1.08] font-extrabold tracking-[-0.075em] max-md:text-[40px]">
            Our roots run deep. <br className="hidden sm:block" /> Our future is{" "}
            <em className="text-primary not-italic">on fire.</em>
          </h1>

          <p className="text-muted-foreground max-w-lg text-sm sm:text-base">
            The Burning Church began with a simple belief: the love we
            experience in church should be the love we carry into the world.
          </p>

          <div className="relative my-10 aspect-[1.7] w-full overflow-hidden sm:aspect-auto sm:h-80 md:h-97.5">
            <Image
              src="/hero.avif"
              alt="Faith that moves forward."
              className="pointer-events-none absolute inset-0 size-full object-cover object-[center_42%] max-md:object-[57%_center]"
              fill
              loading="eager"
            />
          </div>

          {/* ─── 1. Mission (big statement) + Vision (red panel) ─── */}
          <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-12 md:gap-8 md:py-20">
            <div className="flex flex-col justify-center md:col-span-7">
              <Eyebrow label="Our mission" lineClass="bg-primary" />
              <h2
                className={`${headingClass} mt-5 text-4xl md:text-5xl lg:text-[64px]`}
              >
                Love God.
                <br />
                Serve people.
                <br />
                <span className="text-primary">Transform our community.</span>
              </h2>
              <p className="text-muted-foreground mt-6 max-w-md text-sm leading-[1.8] sm:text-base">
                Our faith is more than what happens on Sunday. It shapes how we
                show up for one another throughout the week.
              </p>
            </div>

            <div className="bg-primary text-primary-foreground flex min-h-72 flex-col justify-between gap-10 p-8 md:col-span-5 md:p-10">
              <Eyebrow label="Our vision" className="text-accent" />
              <div>
                <h3
                  className={`${headingClass} text-3xl md:text-4xl lg:text-[40px]`}
                >
                  A generation burning with purpose.
                </h3>
                <p className="text-primary-foreground/85 mt-4 text-sm leading-[1.8]">
                  We see young people discovering their gifts, families finding
                  support, and neighbours becoming a stronger community
                  together.
                </p>
              </div>
            </div>
          </div>

          {/* ─── 2. Story: heading left, copy right, promise bar below ─── */}
          <div className="border-line border-t py-12 md:py-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5">
                <Eyebrow
                  label="A church with its doors open"
                  lineClass="bg-primary"
                />
                <h2 className={`${headingClass} mt-5 text-4xl md:text-5xl`}>
                  Faith is something
                  <br />
                  we <em className="text-primary not-italic">live together.</em>
                </h2>
              </div>

              <div className="text-muted-foreground flex flex-col gap-5 text-sm leading-[1.85] sm:text-base md:col-span-7">
                <p>
                  The Burning Church Global Ministries is a local church in
                  Kudende, Kaduna. We gather to worship, learn, and make room
                  for people at every stage of life. We want everyone who walks
                  through our doors to feel seen, welcomed, and encouraged to
                  take their next step.
                </p>
                <p>
                  Our community is built on real relationships: checking in on a
                  neighbour, making space for young people to lead, and turning
                  compassion into practical care. You don’t need to have it all
                  figured out to belong here.
                </p>
              </div>
            </div>

            <div className="bg-navy mt-10 flex flex-col items-start gap-5 p-6 text-white sm:flex-row sm:items-center sm:gap-6 md:mt-14 md:p-8">
              <span className="bg-accent/15 text-accent grid size-12 shrink-0 place-items-center">
                <FlameIcon size={22} />
              </span>
              <strong
                className={`${headingClass} flex-1 text-xl md:text-2xl md:tracking-[-0.04em]`}
              >
                Bring your questions. Bring your whole self.
              </strong>
              <span className="text-secondary/80 text-sm">
                There’s room to grow here.
              </span>
            </div>
          </div>

          {/* ─── 3. Values: bento grid ─── */}
          <div className="border-line border-t py-12 md:py-20">
            <Eyebrow label="What guides us" lineClass="bg-primary" />
            <h2 className={`${headingClass} mt-5 mb-8 text-4xl md:text-5xl`}>
              Four things we keep
              <br />
              coming back to.
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-2">
              {values.map(({ number, icon: Icon, title, description }, i) => {
                const isFeature = i === 0;
                const isWide = i === 3;

                return (
                  <div
                    key={number}
                    className={
                      isFeature
                        ? "bg-primary text-primary-foreground flex min-h-64 flex-col justify-between p-7 md:row-span-2 md:p-9"
                        : `border-line bg-card flex min-h-48 flex-col justify-between border p-6 ${
                            isWide ? "md:col-span-2" : ""
                          }`
                    }
                  >
                    <div className="flex items-start justify-between">
                      <Icon
                        className={
                          isFeature
                            ? "text-accent size-7"
                            : "text-primary size-6"
                        }
                      />
                      <span
                        className={
                          isFeature
                            ? "text-primary-foreground/60 text-xs font-semibold tracking-[0.12em]"
                            : "text-muted-foreground text-xs font-semibold tracking-[0.12em]"
                        }
                      >
                        {number}
                      </span>
                    </div>

                    <div className="mt-10">
                      <h3
                        className={`font-serif font-bold tracking-[-0.03em] ${
                          isFeature ? "text-3xl md:text-4xl" : "text-xl"
                        }`}
                      >
                        {title}
                      </h3>
                      <p
                        className={`mt-2 max-w-sm text-sm leading-[1.7] ${
                          isFeature
                            ? "text-primary-foreground/85"
                            : "text-muted-foreground"
                        }`}
                      >
                        {description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── 4. Gather. Grow. Give. : three steps + photo strip ─── */}
          <div className="bg-muted p-6 sm:p-8 md:p-14">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <Eyebrow label="What this looks like" lineClass="bg-primary" />
                <h2
                  className={`${headingClass} mt-5 text-4xl md:text-5xl lg:text-[64px]`}
                >
                  Gather. Grow.{" "}
                  <em className="text-primary not-italic">Give.</em>
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

          {/* ─── Invite CTA (colors moved to theme tokens) ─── */}
          <div className="bg-navy mt-16 flex flex-col justify-between gap-8 p-8 text-white md:flex-row md:items-center md:p-12">
            <div className="max-w-md">
              <Eyebrow label="Your story has a place here" />
              <h2 className={`${headingClass} mt-3 mb-3 text-3xl md:text-4xl`}>
                Come meet your
                <br />
                new community.
              </h2>
              <p className="text-secondary/80 text-sm leading-[1.8]">
                Visit a service, explore what we’re building, or take the first
                step and say hello.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="cream"
                size="lg"
                nativeButton={false}
                render={<Link href="/services" />}
              >
                <span>Plan a visit</span>
                <ChevronRightIcon size={16} />
              </Button>
              <Button
                variant="glass"
                size="lg"
                nativeButton={false}
                render={<Link href="/sign-up" />}
              >
                <span>Join the family</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

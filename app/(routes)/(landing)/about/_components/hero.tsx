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
import { Card, CardContent } from "~/components/reusable/shadcn/card";
import { Container } from "~/components/shared/container";

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

export const AboutHeroComponent = () => {
  return (
    <section aria-label="Hero" className="relative w-full overflow-hidden">
      <Container className="py-16 md:py-24">
        <div className="relative">
          <div className="flex items-center gap-3 text-[9px] tracking-[0.16em]">
            <span className="bg-accent h-px w-7" />
            <span className="font-serif font-semibold">
              KUDEDA, KADUNA · EVERYONE IS WELCOME
            </span>
          </div>

          <h1 className="my-6 font-serif text-[clamp(32px,7vw,62px)] leading-[1.08] font-extrabold tracking-[-0.075em] max-md:text-[40px]">
            Our roots run deep. <br className="hidden sm:block" /> Our future is{" "}
            <em className="text-accent not-italic">on fire.</em>
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

          {/* .about-columns */}
          <div className="grid grid-cols-1 gap-8 py-[60px] md:grid-cols-2 md:gap-[40px]">
            <div>
              <span className="block text-[9px] font-bold tracking-[0.18em] text-[#8d8278] uppercase">
                OUR VISION
              </span>
              <h2 className="mt-3.5 mb-3 font-[Manrope,sans-serif] text-[30px] leading-[1.15] font-extrabold tracking-[-0.05em]">
                A generation
                <br />
                burning with purpose.
              </h2>
              <p className="max-w-[440px] text-[12px] leading-[1.8] text-[#756d65]">
                We see young people discovering their gifts, families finding
                support, and neighbours becoming a stronger community together.
              </p>
            </div>
            <div>
              <span className="block text-[9px] font-bold tracking-[0.18em] text-[#8d8278] uppercase">
                OUR MISSION
              </span>
              <h2 className="mt-3.5 mb-3 font-[Manrope,sans-serif] text-[30px] leading-[1.15] font-extrabold tracking-[-0.05em]">
                Love God. Serve people.
                <br />
                Transform our community.
              </h2>
              <p className="max-w-[440px] text-[12px] leading-[1.8] text-[#756d65]">
                Our faith is more than what happens on Sunday. It shapes how we
                show up for one another throughout the week.
              </p>
            </div>
          </div>

          {/* .about-story */}
          <div className="border-line grid grid-cols-1 items-center gap-8 border-t pt-[48px] pb-[76px] md:grid-cols-[1.4fr_0.6fr] md:gap-[9%]">
            <div>
              <span className="block text-[9px] font-bold tracking-[0.18em] text-[#8d8278] uppercase">
                A CHURCH WITH ITS DOORS OPEN
              </span>
              <h2 className="mt-[14px] mb-[18px] font-[Manrope,sans-serif] text-[40px] leading-[1.08] font-extrabold tracking-[-0.06em] max-md:text-[32px]">
                Faith is something
                <br />
                we <em className="text-red not-italic">live together.</em>
              </h2>
              <p className="mb-4 text-[12px] leading-[1.8] text-[#756d65]">
                The Burning Church Global Ministries is a local church in
                Kudende, Kaduna. We gather to worship, learn, and make room for
                people at every stage of life. We want everyone who walks
                through our doors to feel seen, welcomed, and encouraged to take
                their next step.
              </p>
              <p className="text-[12px] leading-[1.8] text-[#756d65]">
                Our community is built on real relationships: checking in on a
                neighbour, making space for young people to lead, and turning
                compassion into practical care. You don’t need to have it all
                figured out to belong here.
              </p>
            </div>

            {/* .about-promise */}
            <div className="flex min-h-[220px] flex-col items-start justify-end gap-[13px] bg-[#29221e] p-[28px] text-white">
              <FlameIcon size={23} className="text-[#e9a33b]" />
              <strong className="font-[Manrope,sans-serif] text-[20px] leading-[1.35] font-bold">
                Bring your questions.
                <br />
                Bring your whole self.
              </strong>
              <span className="text-[10px] text-[#d8c8b8]">
                There’s room to grow here.
              </span>
            </div>
          </div>

          {/* .about-values */}
          <div className="border-line border-t pt-[50px] pb-[76px]">
            <div className="text-[9px] font-bold tracking-[0.18em] text-[#8d8278] uppercase">
              WHAT GUIDES US
            </div>
            <h2 className="mt-[12px] mb-[25px] font-[Manrope,sans-serif] text-[36px] leading-[1.08] font-extrabold tracking-[-0.06em] max-md:text-[30px]">
              Four things we keep
              <br />
              coming back to.
            </h2>
            <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ number, icon: Icon, title, description }) => (
                <Card
                  key={number}
                  className="min-h-[220px] rounded-none bg-white shadow-none max-md:min-h-[190px]"
                >
                  <CardContent className="relative p-[20px]!">
                    <span className="absolute top-[17px] right-[18px] text-[9px] text-[#9e958d]">
                      {number}
                    </span>
                    <Icon className="text-red mt-[6px] mb-[17px] size-[21px]" />
                    <h3 className="mb-[6px] font-[Manrope,sans-serif] text-[15px] font-bold">
                      {title}
                    </h3>
                    <p className="m-0 text-[10px] leading-[1.65] text-[#756d65]">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* .about-practice */}
          <div className="grid min-h-[400px] grid-cols-1 bg-[#efebe3] md:grid-cols-2">
            <div
              role="img"
              aria-label="A community gathered around a table"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=85")',
              }}
              className="min-h-[280px] bg-cover bg-center md:min-h-[400px]"
            />
            <div className="px-[8%] py-[36px] md:px-[12%] md:py-[42px]">
              <span className="block text-[9px] font-bold tracking-[0.18em] text-[#8d8278] uppercase">
                WHAT THIS LOOKS LIKE
              </span>
              <h2 className="mt-[12px] mb-[17px] font-[Manrope,sans-serif] text-[38px] leading-[1.08] font-extrabold tracking-[-0.06em] max-md:text-[32px]">
                Gather. Grow.
                <br />
                <em className="text-red not-italic">Give.</em>
              </h2>

              <div className="divide-line divide-y">
                {practices.map(({ number, title, description }) => (
                  <div
                    key={number}
                    className="flex items-start gap-4 py-3.5 first:pt-1 last:pb-0"
                  >
                    <span className="text-red pt-0.5 text-[9px] font-bold tracking-[0.12em]">
                      {number}
                    </span>
                    <div>
                      <strong className="block font-[Manrope,sans-serif] text-[13px] font-bold">
                        {title}
                      </strong>
                      <p className="mt-1 text-[12px] leading-[1.8] text-[#756d65]">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* .about-invite */}
          <div className="mt-16 flex flex-col justify-between gap-8 bg-[#29221e] p-8 text-white md:flex-row md:items-center md:p-12">
            <div className="max-w-md">
              <span className="block text-[9px] font-bold tracking-[0.18em] text-[#d8c8b8] uppercase">
                YOUR STORY HAS A PLACE HERE
              </span>
              <h2 className="mt-3 mb-3 font-[Manrope,sans-serif] text-[34px] leading-[1.08] font-extrabold tracking-[-0.06em] max-md:text-[28px]">
                Come meet your
                <br />
                new community.
              </h2>
              <p className="text-[12px] leading-[1.8] text-[#d8c8b8]">
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
                render={<Link href="/join" />}
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

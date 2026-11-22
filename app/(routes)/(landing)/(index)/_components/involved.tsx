import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { FaRegHandshake } from "react-icons/fa6";
import { GoSponsorTiers } from "react-icons/go";
import { HiOutlineUsers } from "react-icons/hi2";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

const paths = [
  {
    number: "01",
    icon: HiOutlineUsers,
    title: "Join the family",
    description:
      "Create your account to stay connected, check in at services, and find your place to serve.",
    cta: "Create an account",
    href: "/sign-up",
  },
  {
    number: "02",
    icon: GoSponsorTiers,
    title: "Sponsor a student",
    description:
      "Help a child stay in school. Pick a project and become part of their story.",
    cta: "Become a sponsor",
    href: "/partner",
  },
  {
    number: "03",
    icon: FaRegHandshake,
    title: "Partner with us",
    description:
      "Walk with us on the projects we’re building across Kudende and beyond.",
    cta: "Start a partnership",
    href: "/partner",
  },
] as const;

export const InvolvedComponent = () => {
  return (
    <section aria-label="Get involved" className="flex-1 overflow-x-clip">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow
            className="justify-center"
            lineClass="bg-primary"
            label="Find your place"
          />
          <h2 className="my-5 font-serif text-3xl font-extrabold tracking-[-0.06em] md:text-4xl md:leading-[1.05] lg:text-5xl">
            There’s a next step
            <br />
            with your name on it.
          </h2>
          <p className="text-muted-foreground text-sm leading-[1.75] sm:text-[15px]">
            Show up, give back, or build alongside us. Start wherever feels
            right.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-3">
          {paths.map(
            ({ number, icon: Icon, title, description, cta, href }) => (
              <Link
                key={number}
                href={href}
                className="bg-card border-line hover:border-primary group flex min-h-72 flex-col justify-between gap-10 border p-6 transition-colors md:p-8"
              >
                <div className="flex items-start justify-between">
                  <Icon className="text-primary size-7" />
                  <span className="text-muted-foreground text-xs font-semibold tracking-[0.12em]">
                    {number}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-extrabold tracking-[-0.04em]">
                    {title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-[1.7]">
                    {description}
                  </p>
                  <span className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                    {cta}
                    <ArrowRightIcon
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            ),
          )}
        </div>
      </Container>
    </section>
  );
};

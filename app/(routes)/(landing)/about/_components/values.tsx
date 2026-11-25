import { GoFlame } from "react-icons/go";
import { HiOutlineUsers } from "react-icons/hi2";
import { RiMapPinRangeLine } from "react-icons/ri";
import { TiHeartOutline } from "react-icons/ti";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

const values = [
  {
    number: "01",
    icon: TiHeartOutline,
    title: "Love that shows up",
    description:
      "We choose kindness that moves beyond good intentions and into everyday life.",
  },
  {
    number: "02",
    icon: HiOutlineUsers,
    title: "Everyone belongs",
    description:
      "We make space for different stories, ages, questions, and ways to serve.",
  },
  {
    number: "03",
    icon: GoFlame,
    title: "Purpose in every person",
    description:
      "We encourage people to discover their gifts and use them with confidence.",
  },
  {
    number: "04",
    icon: RiMapPinRangeLine,
    title: "Rooted in community",
    description:
      "We are proud to call Kudenda home and committed to its people and future.",
  },
];

const headingClass =
  "font-serif font-extrabold tracking-[-0.06em] leading-[1.05]";

export const Values = () => {
  return (
    <section aria-label="Our values" className="w-full">
      <Container>
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
                        isFeature ? "text-accent size-7" : "text-primary size-6"
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
                        isFeature ? "text-2xl md:text-3xl" : "text-xl"
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
      </Container>
    </section>
  );
};

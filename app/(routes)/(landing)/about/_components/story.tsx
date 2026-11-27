import { GoFlame } from "react-icons/go";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { siteConfig } from "~/config/site.config";

const headingClass =
  "font-serif font-extrabold tracking-[-0.06em] leading-[1.05]";

export const Story = () => {
  return (
    <section aria-label="Our story" className="w-full">
      <Container>
        <div className="border-line border-t py-12 md:py-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <Eyebrow
                label="A church with its doors open"
                lineClass="bg-primary"
              />
              <h2 className="mt-5 font-serif text-5xl font-bold tracking-[-0.06em] md:text-6xl md:leading-[1.05]">
                Faith is something
                <br />
                we <em className="text-primary not-italic">live together.</em>
              </h2>
            </div>

            <div className="text-muted-foreground flex flex-col gap-5 text-sm leading-[1.85] sm:text-base md:col-span-7">
              <p>
                {siteConfig.title} is a local church in Kudenda, Kaduna. We
                gather to worship, learn, and make room for people at every
                stage of life. We want everyone who walks through our doors to
                feel seen, welcomed, and encouraged to take their next step.
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
              <GoFlame size={22} />
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
      </Container>
    </section>
  );
};

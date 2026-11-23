import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

export const Callout = () => {
  return (
    <section className="pb-16 md:pb-24">
      <Container>
        <div className="bg-navy flex flex-col items-start justify-between gap-6 rounded-2xl p-8 text-white md:flex-row md:items-center md:p-10">
          <div className="max-w-lg">
            <Eyebrow label="Build with us" className="text-accent" />

            <h2 className="mt-2 font-serif text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
              Want to sponsor a drive or volunteer on the ground?
            </h2>
            <p className="text-secondary/75 mt-2 text-sm sm:text-base">
              Reach out through our partnership page to pledge recurring support
              or coordinate a visit in Kudenda, Kaduna.
            </p>
          </div>

          <Button
            variant="cream"
            size="lg"
            nativeButton={false}
            render={<Link href="/partner" />}
            className="shrink-0"
          >
            <span>Become a Partner</span>
          </Button>
        </div>
      </Container>
    </section>
  );
};

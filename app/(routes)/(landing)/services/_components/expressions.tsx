import { FlameIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { fetchExpressions } from "~/sanity/queries/expression.query";

export const Expressions = async () => {
  const expressions = await fetchExpressions().catch((err) => {
    console.error("Could not load expressions:", err);
    return [];
  });

  return (
    <section
      id="expressions"
      className="bg-muted/60 border-line scroll-mt-20 border-t py-14 md:py-20"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Intro stays in view while the list scrolls (desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Eyebrow label="Expressions" className="text-primary" />
            <h2 className="mt-5 font-serif text-5xl font-extrabold tracking-[-0.06em] md:text-6xl md:leading-[1.05]">
              Where the culture of the house is lived
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-[1.75] sm:text-base">
              An expression is a gathering or outreach where we live out our
              church culture together—rooted in Christ, the Word, prayer, and
              fellowship. Showing up isn’t about obligation; it’s about valuing
              and prioritizing your spiritual family.
            </p>
          </div>

          {expressions.length === 0 ? (
            <div className="border-line bg-card flex flex-col items-start gap-4 self-start rounded-xl border border-dashed p-8">
              <span className="bg-muted text-primary grid size-11 place-items-center rounded-full">
                <FlameIcon size={20} />
              </span>
              <h3 className="font-serif text-xl font-extrabold tracking-[-0.03em]">
                Our expressions are being announced
              </h3>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                Each one is a gathering where the house’s culture is lived out.
                Join us this week and be the first to hear when they open.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="red"
                  nativeButton={false}
                  render={<a href="#services" />}
                >
                  <span>See the weekly schedule</span>
                </Button>
                <Button
                  variant="brand-outline"
                  nativeButton={false}
                  render={<Link href="/sign-up" />}
                >
                  <span>Join the family</span>
                </Button>
              </div>
            </div>
          ) : (
            <ol className="border-line divide-line divide-y border-y">
              {expressions.map((item, index) => (
                <li key={item._id} className="group flex gap-5 py-7 sm:gap-8">
                  <span className="text-primary pt-1 font-mono text-sm font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="group-hover:text-primary font-serif text-2xl font-extrabold tracking-[-0.03em] transition-colors md:text-3xl">
                        {item.title}
                      </h3>
                      {item.schedule && (
                        <span className="bg-card border-line rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                          {item.schedule}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {item.tagline}
                    </p>
                    {item.description && (
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    {item.slug === "weekly-services" && (
                      <Link
                        href="#services"
                        className="text-primary mt-3 inline-block text-sm font-semibold underline-offset-4 hover:underline"
                      >
                        See the schedule
                      </Link>
                    )}
                  </div>

                  {item.image && (
                    // biome-ignore lint/performance/noImgElement: Sanity CDN image
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="hidden size-24 shrink-0 rounded-lg object-cover sm:block"
                    />
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </Container>
    </section>
  );
};

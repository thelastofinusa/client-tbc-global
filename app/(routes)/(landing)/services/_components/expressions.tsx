import Link from "next/link";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { fetchExpressions } from "~/sanity/queries/expression.query";

const CULTURE = [
  "Christ-centeredness",
  "The Word",
  "Prayer",
  "Fellowship",
  "Commitment",
  "Service",
  "Growth",
];

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
        {/* Header block */}
        <div className="max-w-2xl">
          <Eyebrow label="Expressions" className="text-primary" />
          <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
            Where the culture of the house is lived
          </h2>

          {/* Paragraph 1: Above culture pills */}
          <p className="text-muted-foreground mt-4 text-sm leading-[1.75] sm:text-base">
            An expression is a distinct gathering or outreach through which our
            shared convictions take shape in everyday life.
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {CULTURE.map((value) => (
              <li
                key={value}
                className="bg-card border-line rounded-full border px-3 py-1 text-xs font-semibold"
              >
                {value}
              </li>
            ))}
          </ul>

          {/* Paragraph 2: Below culture pills */}
          <p className="text-muted-foreground mt-5 text-sm leading-[1.75] sm:text-base">
            Gathering isn’t about keeping score; it’s how we stay rooted
            together and carry what we’ve received.
          </p>
        </div>

        {/* Non-card editorial rows */}
        {expressions.length === 0 ? (
          <p className="text-muted-foreground mt-10 text-sm">
            Our expressions are being added. Check back shortly.
          </p>
        ) : (
          <div className="border-line mt-12 border-t">
            {expressions.map((item, index) => (
              <div
                key={item._id}
                className="border-line grid gap-5 border-b py-7 md:grid-cols-12 md:items-center md:gap-8"
              >
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <div>
                    <h3 className="font-serif text-xl font-extrabold tracking-[-0.03em]">
                      {item.title}
                    </h3>
                    {item.schedule && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        {item.schedule}
                      </p>
                    )}
                  </div>
                </div>

                <div className="md:col-span-5">
                  {item.tagline && (
                    <p className="text-sm font-medium">{item.tagline}</p>
                  )}
                  {item.description && (
                    <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.slug === "weekly-services" && (
                    <Link
                      href="#services"
                      className="text-primary mt-3 inline-block text-xs font-semibold underline-offset-4 hover:underline"
                    >
                      See the schedule →
                    </Link>
                  )}
                </div>

                {item.image && (
                  <div className="md:col-span-3 md:justify-self-end">
                    {/* biome-ignore lint/performance/noImgElement: Sanity CDN image */}
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="aspect-16/10 w-full max-w-64 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

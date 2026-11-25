import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

export default function NotFound() {
  return (
    <main className="bg-background text-foreground flex min-h-[calc(100dvh-4.5rem)] flex-col justify-between">
      <section className="my-auto py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Eyebrow label="Error 404" className="text-primary" />

            <p className="text-navy/10 mt-3 font-serif text-7xl font-extrabold tracking-[-0.06em] select-none sm:text-8xl md:text-9xl">
              404
            </p>

            <h1 className="-mt-4 font-serif text-3xl font-extrabold tracking-[-0.04em] sm:-mt-6 sm:text-5xl">
              We couldn't find that page.
            </h1>

            <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
              The link may have moved, expired, or been mistyped. You can head
              back home or check our gathering times in Kudenda, Kaduna.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                variant="red"
                size="lg"
                nativeButton={false}
                render={<Link href="/" />}
              >
                <ArrowLeftIcon />
                <span>Back to Home</span>
              </Button>

              <Button
                variant="brand-outline"
                size="lg"
                nativeButton={false}
                render={<Link href="/services" />}
              >
                <span>Service &amp; Visit Times</span>
                <ArrowUpRightIcon />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

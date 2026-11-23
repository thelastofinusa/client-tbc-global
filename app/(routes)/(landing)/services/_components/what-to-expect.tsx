import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { siteConfig } from "~/config/site.config";

const visitorNotes = [
  {
    title: "Arrive 10–15 minutes early",
    detail:
      "Gives you time to park, find seating comfortably, and connect with our welcome team before service begins.",
  },
  {
    title: "Come just as you are",
    detail:
      "Whether you are visiting for the first time, exploring faith, or looking for a home church in Kaduna, you are welcome.",
  },
  {
    title: "Easy check-in & connection",
    detail:
      "Members and first-time guests can sign in or create an account to stay updated on upcoming gatherings and events.",
  },
];

export const WhatToExpect = () => {
  return (
    <section className="bg-muted/60 border-line border-t py-14 md:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="bg-card border-line rounded-xl border p-6 sm:p-8">
            <div className="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              <MapPinIcon size={15} />
              <span>Location &amp; Directions</span>
            </div>
            <h2 className="mt-3 font-serif text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
              Finding us in Kudenda, Kaduna
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
              Open the location pin directly in Google Maps for turn-by-turn
              directions from anywhere in Kaduna.
            </p>

            <dl className="border-line mt-6 space-y-3 border-t pt-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground flex items-center gap-2">
                  <MapPinIcon size={14} />
                  <span>Area</span>
                </dt>
                <dd className="font-semibold">Kudenda, Kaduna</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground flex items-center gap-2">
                  <CalendarDaysIcon size={14} />
                  <span>Main Service</span>
                </dt>
                <dd className="font-semibold">Sundays · 9:00 AM</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground flex items-center gap-2">
                  <UsersIcon size={14} />
                  <span>Guests</span>
                </dt>
                <dd className="font-semibold">First-time visitors welcome</dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                variant="red"
                nativeButton={false}
                render={
                  <a
                    href={siteConfig.map.direction}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <span>Open in Google Maps</span>
                <ArrowUpRightIcon size={15} />
              </Button>
              <Button
                variant="brand-outline"
                nativeButton={false}
                render={<Link href="/partner" />}
              >
                <span>Plan a visit / Partner</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="px-1">
              <Eyebrow label="First Time Visiting?" className="text-primary" />
              <h2 className="mt-2 font-serif text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
                What to expect on your visit
              </h2>
            </div>

            {visitorNotes.map((note, idx) => (
              <div
                key={note.title}
                className="bg-card border-line rounded-xl border p-6"
              >
                <span className="text-muted-foreground font-mono text-xs font-semibold">
                  0{idx + 1}
                </span>
                <h3 className="mt-1 font-serif text-xl font-extrabold tracking-[-0.02em]">
                  {note.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {note.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

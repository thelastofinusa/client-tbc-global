"use client";

import { cn } from "cn";
import { CheckIcon, HeartHandshakeIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";

interface PartnershipTrack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  perks: string[];
}

const tracks: PartnershipTrack[] = [
  {
    id: "monthly-partner",
    name: "Monthly Partner",
    tagline: "Steady, ongoing commitment",
    description:
      "Provide dependable monthly backing for weekly gatherings, ministry operations, and ongoing care in Kudenda.",
    perks: [
      "Consistent support for weekly services",
      "Quarterly partnership & impact updates",
      "Prayer covering for our leadership & team",
    ],
  },
  {
    id: "project-partner",
    name: "Project & Outreach Partner",
    tagline: "Targeted community impact",
    description:
      "Direct your support toward specific outreach drives, relief packages, or facility and media readiness projects.",
    perks: [
      "Focused backing for active initiatives",
      "Milestone progress reports from the field",
      "Option to join outreach days in person",
    ],
  },
  {
    id: "volunteer-partner",
    name: "Volunteer & Team Partner",
    tagline: "Time, skills & presence",
    description:
      "Serve alongside our team on Sundays, midweek gatherings, or Saturday outreach and community initiatives.",
    perks: [
      "Hands-on involvement in local ministry",
      "Onboarding with team leads",
      "Flexible scheduling across Wed · Sat · Sun",
    ],
  },
];

export const Tracks = () => {
  const [selectedTrack, setSelectedTrack] =
    React.useState<string>("monthly-partner");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [frequency, setFrequency] = React.useState("Monthly");
  const [notes, setNotes] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <React.Fragment>
      <section className="py-14 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow label="Ways to Partner" className="text-primary" />
            <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              Choose how you want to partner
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {tracks.map((track) => {
              const isSelected = selectedTrack === track.id;
              return (
                <div
                  key={track.id}
                  className={cn(
                    "flex flex-col justify-between rounded-xl border p-6 transition-all sm:p-7",
                    isSelected
                      ? "bg-card border-primary ring-primary/30 shadow-md ring-2"
                      : "bg-card border-line shadow-xs hover:border-foreground/30",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                        {track.tagline}
                      </span>
                      {isSelected && (
                        <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                          Selected
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-serif text-2xl font-extrabold tracking-[-0.03em]">
                      {track.name}
                    </h3>

                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {track.description}
                    </p>

                    <ul className="border-line mt-5 space-y-2.5 border-t pt-5 text-sm">
                      {track.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2.5">
                          <CheckIcon
                            size={16}
                            className="text-primary mt-0.5 shrink-0"
                          />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-2">
                    <Button
                      type="button"
                      variant={isSelected ? "red" : "brand-outline"}
                      className="w-full"
                      onClick={() => {
                        setSelectedTrack(track.id);
                        setSubmitted(false);
                      }}
                    >
                      {isSelected ? "Selected Track" : `Select ${track.name}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-muted/60 border-line border-t py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <div className="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <HeartHandshakeIcon size={15} />
                <span>Partnership Interest</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-[-0.03em]">
                Connect with our team
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                Share your details and preferred partnership track. Our team
                will follow up with next steps, project details, and gathering
                information.
              </p>

              <div className="bg-navy mt-6 rounded-xl p-6 text-white">
                <div className="text-accent flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  <SparklesIcon size={14} />
                  <span>Already have an account?</span>
                </div>
                <p className="text-secondary/80 mt-2 text-sm leading-relaxed">
                  Sign in to access your member portal or explore active
                  community projects before submitting.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="cream"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/projects" />}
                  >
                    <span>Explore Projects</span>
                  </Button>
                  <Button
                    variant="glass"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/sign-in" />}
                  >
                    <span>Member Sign In</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-card border-line rounded-xl border p-6 shadow-xs sm:p-8">
              {submitted ? (
                <div className="space-y-4 py-6">
                  <span className="bg-muted text-secondary-foreground inline-block rounded-full px-3 py-1 text-xs font-semibold">
                    Partnership Request Recorded
                  </span>
                  <h3 className="font-serif text-2xl font-extrabold tracking-[-0.03em]">
                    Thank you, {fullName || "Partner"}.
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We have noted your interest in{" "}
                    <strong className="text-foreground">
                      {tracks.find((t) => t.id === selectedTrack)?.name}
                    </strong>{" "}
                    ({frequency}). Our team will reach out via{" "}
                    <strong className="text-foreground">
                      {email || "your email"}
                    </strong>{" "}
                    with next steps.
                  </p>
                  <Button
                    type="button"
                    variant="brand-outline"
                    onClick={() => {
                      setSubmitted(false);
                      setNotes("");
                    }}
                  >
                    Submit another response
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="partner-name"
                        className="block text-xs font-semibold tracking-wider uppercase"
                      >
                        Full Name
                      </label>
                      <input
                        id="partner-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className="border-input bg-background focus:border-ring focus:ring-ring/30 mt-2 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-3"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="partner-email"
                        className="block text-xs font-semibold tracking-wider uppercase"
                      >
                        Email Address
                      </label>
                      <input
                        id="partner-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="border-input bg-background focus:border-ring focus:ring-ring/30 mt-2 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-3"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="partner-track"
                        className="block text-xs font-semibold tracking-wider uppercase"
                      >
                        Partnership Track
                      </label>
                      <select
                        id="partner-track"
                        value={selectedTrack}
                        onChange={(e) => setSelectedTrack(e.target.value)}
                        className="border-input bg-background focus:border-ring focus:ring-ring/30 mt-2 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-3"
                      >
                        {tracks.map((track) => (
                          <option key={track.id} value={track.id}>
                            {track.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="partner-cadence"
                        className="block text-xs font-semibold tracking-wider uppercase"
                      >
                        Preferred Cadence
                      </label>
                      <select
                        id="partner-cadence"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="border-input bg-background focus:border-ring focus:ring-ring/30 mt-2 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-3"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="One-time / Project">
                          One-time / Project
                        </option>
                        <option value="Weekly / Volunteer">
                          Weekly / Volunteer
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="partner-notes"
                      className="block text-xs font-semibold tracking-wider uppercase"
                    >
                      Notes or Preferred Project (Optional)
                    </label>
                    <textarea
                      id="partner-notes"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Share which project you want to support, when you'd like to visit, or any questions..."
                      className="border-input bg-background focus:border-ring focus:ring-ring/30 mt-2 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-3"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="red"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <span>Submit Partnership Request</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </React.Fragment>
  );
};

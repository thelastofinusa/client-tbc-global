"use client";

import { cn } from "cn";
import { CheckIcon, HeartHandshakeIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { Eyebrow } from "~/components/shared/eyebrow";
import { submitRequest } from "~/lib/submissions";

interface PartnershipTrack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  perks: string[];
}

const trackNames = {
  "monthly-partner": true,
  "project-partner": true,
  "volunteer-partner": true,
} as const;

const tracks: PartnershipTrack[] = [
  {
    id: "monthly-partner",
    name: "Monthly Partner",
    tagline: "Steady, ongoing commitment",
    description:
      "Provide dependable monthly backing for weekly gatherings, ministry operations, and ongoing care in Kudende.",
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
      "Serve alongside our team at our weekly gatherings, outreach days and community initiatives.",
    perks: [
      "Hands-on involvement in local ministry",
      "Onboarding with team leads",
      "Flexible scheduling across our weekly gatherings",
    ],
  },
];

const inputClass =
  "border-input bg-background focus:border-ring focus:ring-ring/30 mt-2 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-3";
const labelClass = "block text-xs font-semibold tracking-wider uppercase";

export const Tracks = ({
  projects,
}: {
  projects: { slug: string; title: string }[];
}) => {
  const [selectedTrack, setSelectedTrack] =
    React.useState<string>("monthly-partner");
  const [requestType, setRequestType] = React.useState<"partner" | "sponsor">(
    "partner",
  );
  const [projectSlug, setProjectSlug] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [frequency, setFrequency] = React.useState("Monthly");
  const [notes, setNotes] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  // Project pages link here with ?project=<slug> to sponsor that project.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("project");
    if (slug && projects.some((p) => p.slug === slug)) {
      setRequestType("sponsor");
      setProjectSlug(slug);
    } else if (params.get("type") === "sponsor") {
      setRequestType("sponsor");
    }
  }, [projects]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const result = await submitRequest(
          requestType === "sponsor"
            ? {
                type: "sponsor",
                name: fullName,
                email,
                phone,
                note: notes,
                company,
                projectSlug: projectSlug || undefined,
              }
            : {
                type: "partner",
                name: fullName,
                email,
                phone,
                note: notes,
                company,
                track: selectedTrack as keyof typeof trackNames,
                cadence: frequency,
              },
        );

        if (result.ok) setSubmitted(true);
        else setError(result.message);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
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
                <div className="space-y-4 py-6" role="status">
                  <span className="bg-muted text-secondary-foreground inline-block rounded-full px-3 py-1 text-xs font-semibold">
                    Request received
                  </span>
                  <h3 className="font-serif text-2xl font-extrabold tracking-[-0.03em]">
                    Thank you, {fullName.split(" ")[0] || "friend"}.
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our team will reach out to{" "}
                    <strong className="text-foreground">{email}</strong> with
                    next steps.
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
                  <fieldset className="flex flex-wrap gap-2">
                    <legend className={labelClass}>I want to</legend>
                    {(
                      [
                        ["partner", "Partner with the church"],
                        ["sponsor", "Sponsor a student or project"],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={cn(
                          "mt-2 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          requestType === value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-line hover:border-foreground/30",
                        )}
                      >
                        <input
                          type="radio"
                          name="request-type"
                          value={value}
                          checked={requestType === value}
                          onChange={() => setRequestType(value)}
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="partner-name" className={labelClass}>
                        Full Name
                      </label>
                      <input
                        id="partner-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="partner-email" className={labelClass}>
                        Email Address
                      </label>
                      <input
                        id="partner-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="partner-phone" className={labelClass}>
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      id="partner-phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {requestType === "sponsor" ? (
                    <div>
                      <label htmlFor="sponsor-project" className={labelClass}>
                        What would you like to sponsor?
                      </label>
                      <select
                        id="sponsor-project"
                        value={projectSlug}
                        onChange={(e) => setProjectSlug(e.target.value)}
                        className={inputClass}
                      >
                        <option value="">
                          A student (general sponsorship)
                        </option>
                        {projects.map((project) => (
                          <option key={project.slug} value={project.slug}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="partner-track" className={labelClass}>
                          Partnership Track
                        </label>
                        <select
                          id="partner-track"
                          value={selectedTrack}
                          onChange={(e) => setSelectedTrack(e.target.value)}
                          className={inputClass}
                        >
                          {tracks.map((track) => (
                            <option key={track.id} value={track.id}>
                              {track.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="partner-cadence" className={labelClass}>
                          Preferred Cadence
                        </label>
                        <select
                          id="partner-cadence"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          className={inputClass}
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
                  )}

                  <div>
                    <label htmlFor="partner-notes" className={labelClass}>
                      Notes (Optional)
                    </label>
                    <textarea
                      id="partner-notes"
                      rows={4}
                      maxLength={1000}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anything you'd like us to know, or questions you have..."
                      className={inputClass}
                    />
                  </div>

                  {/* Honeypot: hidden from people, filled in by bots. */}
                  <div aria-hidden="true" className="absolute -left-[9999px]">
                    <label htmlFor="partner-company">Company</label>
                    <input
                      id="partner-company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-destructive text-sm">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="red"
                    size="lg"
                    disabled={pending}
                    className="w-full sm:w-auto"
                  >
                    <span>
                      {pending
                        ? "Sending..."
                        : requestType === "sponsor"
                          ? "Submit Sponsorship Request"
                          : "Submit Partnership Request"}
                    </span>
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

"use server";

import { and, count, eq, gt, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import * as z from "zod";
import { db } from "~/db";
import { submissions } from "~/db/schema";
import { fetchProjects } from "~/sanity/queries/project.query";

const TRACKS = {
  "monthly-partner": "Monthly Partner",
  "project-partner": "Project & Outreach Partner",
  "volunteer-partner": "Volunteer & Team Partner",
} as const;

const base = {
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  phone: z.string().trim().max(40).optional(),
  note: z.string().trim().max(1000).optional(),
  // Honeypot: real people never see or fill this field.
  company: z.string().max(0).optional(),
};

const requestSchema = z.discriminatedUnion("type", [
  z.object({
    ...base,
    type: z.literal("partner"),
    track: z.enum(Object.keys(TRACKS) as [keyof typeof TRACKS]),
    cadence: z.string().trim().min(1).max(60),
  }),
  z.object({
    ...base,
    type: z.literal("sponsor"),
    /** Empty means a general student sponsorship, not tied to one project. */
    projectSlug: z.string().trim().max(120).optional(),
  }),
]);

export type SubmitRequestInput = z.input<typeof requestSchema>;
export type SubmitRequestResult = { ok: true } | { ok: false; message: string };

const MAX_PER_HOUR = 3;

/** Public form handler for both partnership and project sponsorship requests. */
export async function submitRequest(
  input: SubmitRequestInput,
): Promise<SubmitRequestResult> {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }
  const data = parsed.data;

  // Bots fill the hidden field. Pretend it worked and drop it.
  if (data.company) return { ok: true };

  const [recent] = await db
    .select({ n: count() })
    .from(submissions)
    .where(
      and(
        eq(submissions.email, data.email),
        gt(submissions.submittedAt, sql`now() - interval '1 hour'`),
      ),
    );
  if ((recent?.n ?? 0) >= MAX_PER_HOUR) {
    return {
      ok: false,
      message: "You’ve sent a few requests already. Please try again later.",
    };
  }

  let subject: string;
  let projectSlug: string | null = null;

  if (data.type === "sponsor") {
    if (data.projectSlug) {
      const projects = await fetchProjects();
      const project = projects.find((p) => p.slug === data.projectSlug);
      if (!project) {
        return { ok: false, message: "That project is no longer available." };
      }
      projectSlug = project.slug;
      subject = project.title;
    } else {
      subject = "Student sponsorship";
    }
  } else {
    subject = `${TRACKS[data.track]} · ${data.cadence}`;
  }

  await db.insert(submissions).values({
    id: crypto.randomUUID(),
    type: data.type,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject,
    note: data.note || "",
    projectSlug,
  });

  // Make the new count show up right away on the home and project pages.
  updateTag("public-stats");

  return { ok: true };
}

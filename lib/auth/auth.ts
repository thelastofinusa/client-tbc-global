import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "~/db";
import * as schema from "~/db/schema";

function superAdminEmails(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

/** Production URL: BETTER_AUTH_URL wins, otherwise Vercel's production domain. */
const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

/** Preview deployments get their own URL, so trust those too. */
const trustedOrigins = [
  baseURL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
].filter((value): value is string => Boolean(value));

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL,
  trustedOrigins,
  user: {
    additionalFields: {
      firstName: { type: "string", required: false },
      lastName: { type: "string", required: false },
      phone: { type: "string", required: false },
      location: { type: "string", required: false },
      address: { type: "string", required: false },
      birthday: { type: "string", required: false },
      // `input: false` means the browser can NEVER set these (sign-up or
      // update-user). Only server code, like the super admin actions, can.
      role: {
        type: "string",
        required: false,
        defaultValue: "attendee",
        input: false,
      },
      requestedRole: {
        type: "string",
        required: false,
        defaultValue: "attendee",
        input: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "pending",
        input: false,
      },
      lastAttended: { type: "date", required: false, input: false },
      joinedAt: { type: "date", required: false, input: false },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      // Signing in with Google using the same email as an existing
      // email-and-password account links to that account instead of failing.
      trustedProviders: ["google", "email-password"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  hooks: {
    // Super admin emails must use Google, so nobody can pre-register one with
    // a password before the real owner signs in.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const email = String(ctx.body?.email ?? "").toLowerCase();
      if (superAdminEmails().includes(email)) {
        throw new APIError("BAD_REQUEST", {
          message: "Use “Continue with Google” for this email address.",
        });
      }
    }),
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────
// Better Auth Core Tables + Church Member Profile Fields
// ─────────────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  // Church Member Profile Fields
  firstName: text("first_name"),
  lastName: text("last_name"),
  /** Assigned role: super_admin | admin | usher | media | attendee */
  role: text("role").notNull().default("attendee"),
  /** Role requested during sign-up */
  requestedRole: text("requested_role").notNull().default("attendee"),
  /** Member status: pending | approved | suspended */
  status: text("status").notNull().default("pending"),
  phone: text("phone"),
  location: text("location"),
  address: text("address"),
  birthday: text("birthday"),
  lastAttended: timestamp("last_attended"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─────────────────────────────────────────────────────────────
// Church Operations (app data only: content lives in Sanity)
//
// Sanity owns: services, expressions, projects, project filters.
// Neon owns:   people, roles, attendance, sponsor/partner requests.
// Rows here point at Sanity content by slug, never by copying it.
// ─────────────────────────────────────────────────────────────

export const attendanceRecords = pgTable(
  "attendance_records",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Slug of the service document in Sanity. */
    serviceId: text("service_id").notNull(),
    // Snapshot of the service at check-in time, so history survives edits.
    serviceName: text("service_name").notNull(),
    day: text("day").notNull(),
    time: text("time").notNull(),
    code: text("code").notNull(),
    /** Calendar day of the service (Africa/Lagos), e.g. 2026-11-29. */
    serviceDate: date("service_date", { mode: "string" })
      .notNull()
      .default(sql`CURRENT_DATE`),
    scannedAt: timestamp("scanned_at").notNull().defaultNow(),
  },
  (t) => [
    // One check-in per person, per service, per day.
    uniqueIndex("attendance_user_service_date_key").on(
      t.userId,
      t.serviceId,
      t.serviceDate,
    ),
    index("attendance_service_date_idx").on(t.serviceDate),
  ],
);

export const submissions = pgTable(
  "submissions",
  {
    id: text("id").primaryKey(),
    /** "sponsor" | "partner" */
    type: text("type").notNull().default("sponsor"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    organization: text("organization"),
    subject: text("subject").notNull(),
    note: text("note").notNull(),
    /** Slug of the project in Sanity this sponsorship is for (optional). */
    projectSlug: text("project_slug"),
    /** "new" | "in_review" | "active" | "declined" */
    status: text("status").notNull().default("new"),
    submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  },
  (t) => [
    index("submissions_type_idx").on(t.type),
    index("submissions_project_idx").on(t.projectSlug),
  ],
);

export const communities = pgTable("communities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  href: text("href").notNull(),
  icon: text("icon").notNull().default("message"), // "message" | "send" | "users" | "globe"
  badge: text("badge").default("Active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

export type AttendanceRecordRow = typeof attendanceRecords.$inferSelect;
export type SubmissionRow = typeof submissions.$inferSelect;
export type Community = typeof communities.$inferSelect;
export type NewCommunity = typeof communities.$inferInsert;

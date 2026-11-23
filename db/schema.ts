import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
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
  /** 0–100: percentage of gatherings attended */
  attendanceRate: integer("attendance_rate").notNull().default(0),
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
// Church Operations & Community Tables
// ─────────────────────────────────────────────────────────────

export const churchServices = pgTable("church_services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull().default("weekly"), // "weekly" | "special"
  day: text("day").notNull(), // "Sunday", "Wednesday", etc.
  time: text("time").notNull(), // "9:00 AM"
  location: text("location").notNull().default("Kudenda, Kaduna"),
  expected: integer("expected").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const attendanceRecords = pgTable("attendance_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  serviceId: text("service_id"),
  serviceName: text("service_name").notNull(),
  day: text("day").notNull(),
  time: text("time").notNull(),
  code: text("code").notNull(),
  scannedAt: timestamp("scanned_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "Building" | "Education" | "Outreach"
  description: text("description").notNull(),
  purpose: text("purpose"),
  participants: integer("participants").notNull().default(0),
  progress: integer("progress").notNull().default(0),
  sponsors: integer("sponsors").notNull().default(0),
  status: text("status").notNull().default("active"), // "active" | "planning" | "completed"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  note: text("note").notNull(),
  status: text("status").notNull().default("new"), // "new" | "in_review" | "active" | "declined"
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

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

export type ChurchServiceRow = typeof churchServices.$inferSelect;
export type AttendanceRecordRow = typeof attendanceRecords.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type SubmissionRow = typeof submissions.$inferSelect;
export type Community = typeof communities.$inferSelect;
export type NewCommunity = typeof communities.$inferInsert;

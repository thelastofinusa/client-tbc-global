import { format, parseISO } from "date-fns";
import { and, count, countDistinct, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "~/db";
import { attendanceRecords, submissions, user } from "~/db/schema";
import { getServices } from "~/lib/data/services";
import { ROLES } from "./roles";
import type {
  Member,
  MemberStatus,
  Role,
  Submission,
  SubmissionStatus,
} from "./types";

const isoDay = (value: Date | null) =>
  value ? value.toISOString().slice(0, 10) : null;

const asRole = (value: string): Role =>
  (ROLES as string[]).includes(value) ? (value as Role) : "attendee";

const asStatus = (value: string): MemberStatus =>
  value === "approved" || value === "suspended" ? value : "pending";

/** Share of the last 8 weeks' weekly services this person checked in to. */
async function attendanceRates(): Promise<Map<string, number>> {
  const since = new Date(Date.now() - 56 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [rows, services] = await Promise.all([
    db
      .select({ userId: attendanceRecords.userId, n: count() })
      .from(attendanceRecords)
      .where(gte(attendanceRecords.serviceDate, since))
      .groupBy(attendanceRecords.userId),
    getServices(),
  ]);

  const weekly = services.filter((s) => s.kind === "weekly").length || 1;
  const denominator = weekly * 8;

  return new Map(
    rows.map((row) => [
      row.userId,
      Math.min(100, Math.round((row.n / denominator) * 100)),
    ]),
  );
}

export async function getMembers(): Promise<Member[]> {
  const [rows, rates] = await Promise.all([
    db.select().from(user).orderBy(desc(user.joinedAt)),
    attendanceRates(),
  ]);

  return rows.map((row) => {
    const status = asStatus(row.status);
    const requestedRole = asRole(row.requestedRole);
    return {
      id: row.id,
      firstName: row.firstName || row.name.split(" ")[0] || "Member",
      lastName: row.lastName || row.name.split(" ").slice(1).join(" "),
      email: row.email,
      phone: row.phone ?? undefined,
      // People waiting for approval show the role they asked for, so
      // approving simply confirms it.
      role: status === "pending" ? requestedRole : asRole(row.role),
      requestedRole,
      status,
      joinedAt: isoDay(row.joinedAt) ?? isoDay(row.createdAt) ?? "",
      attendanceRate: rates.get(row.id) ?? 0,
      lastAttended: isoDay(row.lastAttended),
    };
  });
}

export async function getPendingCount(): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(user)
    .where(eq(user.status, "pending"));
  return row?.n ?? 0;
}

export interface AttendanceSnapshot {
  /** The most recent day anyone checked in. Null until the first check-in. */
  lastServiceDate: string | null;
  presentCount: number;
  previousCount: number;
  absent: Member[];
  trend: { week: string; present: number }[];
}

export async function getAttendanceSnapshot(): Promise<AttendanceSnapshot> {
  const days = await db
    .select({
      date: attendanceRecords.serviceDate,
      n: countDistinct(attendanceRecords.userId),
    })
    .from(attendanceRecords)
    .groupBy(attendanceRecords.serviceDate)
    .orderBy(desc(attendanceRecords.serviceDate))
    .limit(8);

  const last = days[0];
  const trend = [...days].reverse().map((day) => ({
    week: format(parseISO(day.date), "d MMM"),
    present: Number(day.n),
  }));

  if (!last) {
    return {
      lastServiceDate: null,
      presentCount: 0,
      previousCount: 0,
      absent: [],
      trend,
    };
  }

  const [members, presentRows] = await Promise.all([
    getMembers(),
    db
      .select({ userId: attendanceRecords.userId })
      .from(attendanceRecords)
      .where(eq(attendanceRecords.serviceDate, last.date)),
  ]);

  const presentIds = new Set(presentRows.map((row) => row.userId));
  const absent = members.filter(
    (m) => m.status === "approved" && !presentIds.has(m.id),
  );

  return {
    lastServiceDate: last.date,
    presentCount: Number(last.n),
    previousCount: Number(days[1]?.n ?? last.n),
    absent,
    trend,
  };
}

export interface MyAttendanceRecord {
  id: string;
  service: string;
  day: string;
  time: string;
  code: string;
  scannedAt: number;
}

export async function getMyAttendance(userId: string) {
  const [records, rates, [profile]] = await Promise.all([
    db
      .select()
      .from(attendanceRecords)
      .where(eq(attendanceRecords.userId, userId))
      .orderBy(desc(attendanceRecords.scannedAt))
      .limit(100),
    attendanceRates(),
    db
      .select({ lastAttended: user.lastAttended })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1),
  ]);

  return {
    records: records.map<MyAttendanceRecord>((row) => ({
      id: row.id,
      service: row.serviceName,
      day: row.day,
      time: row.time,
      code: row.code,
      scannedAt: row.scannedAt.getTime(),
    })),
    attendanceRate: rates.get(userId) ?? 0,
    lastAttended: isoDay(profile?.lastAttended ?? null),
  };
}

const asSubmissionStatus = (value: string): SubmissionStatus =>
  value === "in_review" || value === "active" || value === "declined"
    ? value
    : "new";

export async function getSubmissions(
  type: "sponsor" | "partner",
): Promise<Submission[]> {
  const rows = await db
    .select()
    .from(submissions)
    .where(eq(submissions.type, type))
    .orderBy(desc(submissions.submittedAt));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    note: row.note,
    submittedAt: row.submittedAt.toISOString(),
    status: asSubmissionStatus(row.status),
  }));
}

export async function getNewSubmissionCounts() {
  const rows = await db
    .select({ type: submissions.type, n: count() })
    .from(submissions)
    .where(and(eq(submissions.status, "new")))
    .groupBy(submissions.type);

  const lookup = new Map(rows.map((row) => [row.type, row.n]));
  return {
    sponsors: lookup.get("sponsor") ?? 0,
    partners: lookup.get("partner") ?? 0,
  };
}

export async function getTotalSubmissionCounts() {
  const rows = await db
    .select({ type: submissions.type, n: sql<number>`count(*)::int` })
    .from(submissions)
    .groupBy(submissions.type);

  const lookup = new Map(rows.map((row) => [row.type, Number(row.n)]));
  return {
    sponsors: lookup.get("sponsor") ?? 0,
    partners: lookup.get("partner") ?? 0,
  };
}

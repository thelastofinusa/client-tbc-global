"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/db";
import { attendanceRecords, user as userTable } from "~/db/schema";
import { getServiceById, getServices } from "~/lib/data/services";
import { requireAccess, requireAuth } from "./access";
import type { CheckInResult, IssueCodeResult } from "./checkin";
import { issueCode, isValidCode, lagosDate } from "./checkin-server";

/** Ushers/admins: get the current signed code for a service. */
export async function issueCheckInCode(
  serviceId: string,
): Promise<IssueCodeResult> {
  await requireAccess("attendance");

  const service = await getServiceById(serviceId);
  if (!service) {
    return { ok: false, message: "That service no longer exists in Sanity." };
  }

  const { code, expiresAt } = issueCode(service.id);
  return {
    ok: true,
    data: {
      serviceId: service.id,
      service: service.name,
      day: service.day,
      time: service.time,
      code,
      expiresAt,
    },
  };
}

/** Any signed-in member: check in with a scanned or typed code. */
export async function submitCheckIn(input: {
  serviceId?: string;
  code: string;
}): Promise<CheckInResult> {
  const viewer = await requireAuth();

  const code = input.code.trim();
  if (!code) return { status: "error", message: "Enter or scan a code." };

  const services = await getServices();
  const candidates = input.serviceId
    ? services.filter((s) => s.id === input.serviceId)
    : services;
  const service = candidates.find((s) => isValidCode(s.id, code));

  if (!service) {
    return {
      status: "error",
      message:
        "That code isn’t valid or has expired. Ask the usher to show the current one.",
    };
  }

  const inserted = await db
    .insert(attendanceRecords)
    .values({
      id: crypto.randomUUID(),
      userId: viewer.id,
      serviceId: service.id,
      serviceName: service.name,
      day: service.day,
      time: service.time,
      code: code.toUpperCase(),
      serviceDate: lagosDate(),
    })
    .onConflictDoNothing()
    .returning({ id: attendanceRecords.id });

  const added = inserted.length > 0;

  if (added) {
    await db
      .update(userTable)
      .set({ lastAttended: new Date() })
      .where(eq(userTable.id, viewer.id));
  }

  revalidatePath("/dashboard", "layout");

  return {
    status: added ? "added" : "duplicate",
    service: {
      id: service.id,
      name: service.name,
      day: service.day,
      time: service.time,
    },
    code: code.toUpperCase(),
    at: Date.now(),
  };
}

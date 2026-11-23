"use client";

import { useSyncExternalStore } from "react";
import type { CheckInData } from "./checkin";

/**
 * Stores check-ins in this browser's localStorage until there is a database.
 */

export interface CheckInRecord {
  id: string;
  serviceId: string;
  service: string;
  day: string;
  time: string;
  code: string;
  scannedAt: number;
}

const CHECKINS_KEY = "tbcgm:checkins";
const OPEN_SESSION_KEY = "tbcgm:open-session";
const CHANGE_EVENT = "tbcgm:checkins-changed";

const EMPTY: CheckInRecord[] = [];
let cachedRaw: string | null = null;
let cachedValue: CheckInRecord[] = EMPTY;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(CHECKINS_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): CheckInRecord[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    cachedValue = raw ? (JSON.parse(raw) as CheckInRecord[]) : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useCheckIns(): CheckInRecord[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

function write(records: CheckInRecord[]) {
  try {
    window.localStorage.setItem(CHECKINS_KEY, JSON.stringify(records));
  } catch {
    // storage unavailable (private mode) – ignore
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** One check-in per service per calendar day. */
export function addCheckIn(data: CheckInData): "added" | "duplicate" {
  const records = getSnapshot();
  const today = new Date().toDateString();
  const exists = records.some(
    (r) =>
      r.serviceId === data.serviceId &&
      new Date(r.scannedAt).toDateString() === today,
  );
  if (exists) return "duplicate";

  write([
    {
      id: crypto.randomUUID(),
      serviceId: data.serviceId,
      service: data.service,
      day: data.day,
      time: data.time,
      code: data.code,
      scannedAt: Date.now(),
    },
    ...records,
  ]);
  return "added";
}

export function clearCheckIns() {
  write([]);
}

/* The usher's open session, so a typed code can be checked on the same device. */
export interface OpenSession extends CheckInData {}

export function saveOpenSession(session: OpenSession) {
  try {
    window.localStorage.setItem(OPEN_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function readOpenSession(): OpenSession | null {
  try {
    const raw = window.localStorage.getItem(OPEN_SESSION_KEY);
    return raw ? (JSON.parse(raw) as OpenSession) : null;
  } catch {
    return null;
  }
}

export function clearOpenSession() {
  try {
    window.localStorage.removeItem(OPEN_SESSION_KEY);
  } catch {
    // ignore
  }
}

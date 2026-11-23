"use client";

import { format, parseISO } from "date-fns";
import {
  CalendarCheckIcon,
  HistoryIcon,
  PercentIcon,
  QrCodeIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import { clearCheckIns, useCheckIns } from "~/lib/dashboard/checkin-store";
import { StatCard } from "./stat-card";

export function MyAttendance({
  baseline,
}: {
  baseline: { attendanceRate: number | null; lastAttended: string | null };
}) {
  const checkIns = useCheckIns();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Check-ins here"
          value={checkIns.length}
          hint="Recorded on this device"
          icon={HistoryIcon}
        />
        <StatCard
          label="Attendance rate"
          value={
            baseline.attendanceRate === null
              ? "—"
              : `${baseline.attendanceRate}%`
          }
          hint="Last 8 weeks (sample data)"
          icon={PercentIcon}
        />
        <StatCard
          label="Last attended"
          value={
            baseline.lastAttended
              ? format(parseISO(baseline.lastAttended), "d MMM")
              : "—"
          }
          hint="From church records"
          icon={CalendarCheckIcon}
        />
      </div>

      <Card variant="surface" className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-bold">Check-in history</h2>
          {checkIns.length > 0 && (
            <Button size="sm" variant="ghost" onClick={clearCheckIns}>
              <Trash2Icon />
              Clear
            </Button>
          )}
        </div>

        {checkIns.length === 0 ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-muted-foreground text-sm">
              You haven’t scanned in yet. Scan the code at church to see it
              here.
            </p>
            <Button
              variant="red"
              nativeButton={false}
              render={<Link href="/dashboard/scan" />}
            >
              <QrCodeIcon />
              Scan to check in
            </Button>
          </div>
        ) : (
          <ul className="divide-line divide-y">
            {checkIns.map((record) => (
              <li
                key={record.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {record.service}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {[record.day, record.time].filter(Boolean).join(", ")} ·
                    code {record.code}
                  </p>
                </div>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  {format(new Date(record.scannedAt), "d MMM, h:mm a")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

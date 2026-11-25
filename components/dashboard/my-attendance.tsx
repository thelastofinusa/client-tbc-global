import { format, parseISO } from "date-fns";
import {
  CalendarCheckIcon,
  HistoryIcon,
  PercentIcon,
  QrCodeIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import type { MyAttendanceRecord } from "~/lib/dashboard/data";
import { StatCard } from "./stat-card";

export function MyAttendance({
  records,
  attendanceRate,
  lastAttended,
}: {
  records: MyAttendanceRecord[];
  attendanceRate: number;
  lastAttended: string | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Check-ins"
          value={records.length}
          hint="All time"
          icon={HistoryIcon}
        />
        <StatCard
          label="Attendance rate"
          value={`${attendanceRate}%`}
          hint="Last 8 weeks"
          icon={PercentIcon}
        />
        <StatCard
          label="Last attended"
          value={lastAttended ? format(parseISO(lastAttended), "d MMM") : "—"}
          hint="From church records"
          icon={CalendarCheckIcon}
        />
      </div>

      <Card variant="surface" className="gap-4">
        <h2 className="font-serif text-lg font-bold">Check-in history</h2>

        {records.length === 0 ? (
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
            {records.map((record) => (
              <li
                key={record.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {record.service}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {[record.day, record.time].filter(Boolean).join(", ")}
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

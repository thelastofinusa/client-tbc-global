import { format, parseISO } from "date-fns";
import type { Metadata } from "next";
import {
  AttendanceChart,
  RegistrationsChart,
} from "~/components/dashboard/charts";
import { PageHeader } from "~/components/dashboard/page-header";
import { Card } from "~/components/reusable/shadcn/card";
import { members } from "~/lib/dashboard/mock-data";

export const metadata: Metadata = { title: "Reports" };

export default function Page() {
  const atRisk = members
    .filter((m) => m.status === "approved" && m.attendanceRate < 50)
    .sort((a, b) => a.attendanceRate - b.attendanceRate);

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        description="Attendance and growth at a glance, plus the people who may need a check-in."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card variant="surface" className="gap-4">
          <div>
            <h2 className="font-serif text-lg font-bold">Sunday attendance</h2>
            <p className="text-muted-foreground text-xs">Last 8 weeks</p>
          </div>
          <AttendanceChart />
        </Card>

        <Card variant="surface" className="gap-4">
          <div>
            <h2 className="font-serif text-lg font-bold">New members</h2>
            <p className="text-muted-foreground text-xs">Last 6 months</p>
          </div>
          <RegistrationsChart />
        </Card>
      </div>

      <Card variant="surface" className="mt-4 gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold">Needs a check-in</h2>
          <p className="text-muted-foreground text-xs">
            Attending fewer than half of recent services.
          </p>
        </div>
        {atRisk.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Everyone is attending regularly.
          </p>
        ) : (
          <ul className="divide-line divide-y">
            {atRisk.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {m.firstName} {m.lastName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {m.lastAttended
                      ? `Last seen ${format(parseISO(m.lastAttended), "d MMM")}`
                      : "Hasn’t attended yet"}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {m.attendanceRate}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

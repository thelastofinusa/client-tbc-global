"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/reusable/shadcn/chart";
import { attendanceTrend, registrationsTrend } from "~/lib/dashboard/mock-data";

const attendanceConfig = {
  present: { label: "Present", color: "var(--primary)" },
} satisfies ChartConfig;

const registrationsConfig = {
  joined: { label: "New members", color: "var(--navy)" },
} satisfies ChartConfig;

export function AttendanceChart({ className }: { className?: string }) {
  return (
    <ChartContainer
      config={attendanceConfig}
      className={className ?? "aspect-auto h-64 w-full"}
    >
      <AreaChart data={attendanceTrend} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="present"
          type="monotone"
          stroke="var(--color-present)"
          fill="var(--color-present)"
          fillOpacity={0.14}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function RegistrationsChart({ className }: { className?: string }) {
  return (
    <ChartContainer
      config={registrationsConfig}
      className={className ?? "aspect-auto h-64 w-full"}
    >
      <BarChart
        data={registrationsTrend}
        margin={{ left: 4, right: 12, top: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="joined" fill="var(--color-joined)" radius={0} />
      </BarChart>
    </ChartContainer>
  );
}

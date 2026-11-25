"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/reusable/shadcn/chart";

const attendanceConfig = {
  present: { label: "Present", color: "var(--primary)" },
} satisfies ChartConfig;

const registrationsConfig = {
  joined: { label: "New members", color: "var(--navy)" },
} satisfies ChartConfig;

export function AttendanceChart({
  data,
  className,
}: {
  data: { week: string; present: number }[];
  className?: string;
}) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        No check-ins yet. The chart fills in as people scan in at church.
      </p>
    );
  }

  return (
    <ChartContainer
      config={attendanceConfig}
      className={className ?? "aspect-auto h-64 w-full"}
    >
      <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
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

export function RegistrationsChart({
  data,
  className,
}: {
  data: { month: string; joined: number }[];
  className?: string;
}) {
  return (
    <ChartContainer
      config={registrationsConfig}
      className={className ?? "aspect-auto h-64 w-full"}
    >
      <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
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

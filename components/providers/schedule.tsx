"use client";

import { createContext, type ReactNode, useContext } from "react";
import { emptySchedule, type ScheduleSummary } from "~/lib/schedule";

const ScheduleContext = createContext<ScheduleSummary>(emptySchedule);

/** Filled on the server from Sanity, so client components never hardcode times. */
export function ScheduleProvider({
  value,
  children,
}: {
  value: ScheduleSummary;
  children: ReactNode;
}) {
  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => useContext(ScheduleContext);

import type { ReactNode } from "react";
import { getDashboardViewer } from "~/lib/dashboard/access";
import {
  canAccess,
  type DashboardSection,
} from "~/lib/dashboard/access-control";
import { NotAllowed } from "./not-allowed";

/** Wrap a page's content so only the allowed roles can see it. */
export async function RoleGate({
  section,
  children,
}: {
  section: DashboardSection;
  children: ReactNode;
}) {
  const viewer = await getDashboardViewer();
  if (!viewer) return null; // the layout already shows the sign-in screen

  if (!canAccess(viewer.role, section)) {
    return <NotAllowed role={viewer.role} />;
  }

  return <>{children}</>;
}

"use client";

import type { ReactNode } from "react";
import { useSession } from "~/lib/auth/auth-client";

export function Show({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: ReactNode;
}) {
  const { data: session, isPending } = useSession();

  if (isPending) return null;

  if (when === "signed-in" && session?.user) {
    return <>{children}</>;
  }

  if (when === "signed-out" && !session?.user) {
    return <>{children}</>;
  }

  return null;
}

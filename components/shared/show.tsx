"use client";

import type { ReactNode } from "react";
import { useSignedIn } from "~/components/providers/auth-state";

export function Show({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: ReactNode;
}) {
  const signedIn = useSignedIn();

  if (signedIn === null) return null;

  return (when === "signed-in") === signedIn ? <>{children}</> : null;
}

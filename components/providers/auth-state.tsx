"use client";

import { createContext, type ReactNode, useContext } from "react";

/**
 * Whether someone is signed in, decided once on the server (from the signed
 * session cookie). `null` means "still working it out". This replaces a
 * browser request to /api/auth/get-session on every page load.
 */
const AuthStateContext = createContext<boolean | null>(null);

export function AuthStateProvider({
  signedIn,
  children,
}: {
  signedIn: boolean | null;
  children: ReactNode;
}) {
  return (
    <AuthStateContext.Provider value={signedIn}>
      {children}
    </AuthStateContext.Provider>
  );
}

export const useSignedIn = () => useContext(AuthStateContext);

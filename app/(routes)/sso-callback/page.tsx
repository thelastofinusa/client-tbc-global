"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "~/components/reusable/shadcn/spinner";
import { useSession } from "~/lib/auth/auth-client";

export default function SSOCallbackPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        router.replace("/dashboard");
      } else {
        router.replace("/sign-in");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="grid min-h-svh place-items-center">
      <div className="text-muted-foreground flex flex-col items-center gap-3 text-sm">
        <Spinner className="text-primary size-6" />
        <p>Signing you in…</p>
      </div>
    </div>
  );
}

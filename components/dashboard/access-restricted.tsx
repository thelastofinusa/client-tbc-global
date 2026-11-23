"use client";

import { LockKeyholeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Eyebrow } from "~/components/shared/eyebrow";
import { authClient } from "~/lib/auth/auth-client";

export function AccessRestricted({
  reason,
}: {
  reason: "signed-out" | "suspended";
}) {
  return (
    <div className="grid min-h-svh place-items-center px-5">
      <div className="bg-card border-line flex w-full max-w-md flex-col gap-6 border p-8">
        <span className="bg-muted text-primary grid size-12 place-items-center">
          <LockKeyholeIcon size={22} aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-3">
          <Eyebrow lineClass="bg-primary" label="Restricted area" />
          <h1 className="font-serif text-3xl leading-[1.05] font-extrabold tracking-[-0.06em]">
            {reason === "signed-out"
              ? "Please sign in first"
              : "Your account is paused"}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {reason === "signed-out"
              ? "Sign in with your member account to continue."
              : "Your membership is currently suspended. Please speak to the church leadership to have it reinstated."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {reason === "signed-out" ? (
            <Button
              variant="red"
              size="lg"
              nativeButton={false}
              render={<Link href="/sign-in" />}
            >
              Sign in
            </Button>
          ) : (
            <Button
              variant="dark"
              size="lg"
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/";
                    },
                  },
                });
              }}
            >
              Sign out
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Back to website
          </Button>
        </div>
      </div>
    </div>
  );
}

import { SignOutButton } from "@clerk/nextjs";
import { LockKeyholeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Eyebrow } from "~/components/shared/eyebrow";

export function AccessRestricted({
  reason,
  email,
}: {
  reason: "signed-out" | "forbidden";
  email?: string;
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
              : "This dashboard is for the super admin"}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {reason === "signed-out"
              ? "Sign in with your member account to continue."
              : "Your account doesn’t have super admin access. If you think this is a mistake, ask the ministry’s super admin to update your role."}
          </p>
          {reason === "forbidden" && process.env.NODE_ENV === "development" && (
            <p className="border-border text-muted-foreground border border-dashed p-3 text-xs leading-relaxed">
              Dev hint: add{" "}
              <code className="text-foreground">{email ?? "your email"}</code>{" "}
              to <code className="text-foreground">SUPER_ADMIN_EMAILS</code> in{" "}
              <code className="text-foreground">.env</code>, or set{" "}
              <code className="text-foreground">
                publicMetadata.role = "super_admin"
              </code>{" "}
              on your Clerk user.
            </p>
          )}
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
            <SignOutButton redirectUrl="/">
              <Button variant="dark" size="lg">
                Sign out
              </Button>
            </SignOutButton>
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

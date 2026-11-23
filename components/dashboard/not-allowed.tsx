import { LockKeyholeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { ROLE_META } from "~/lib/dashboard/roles";
import type { Role } from "~/lib/dashboard/types";

export function NotAllowed({ role }: { role: Role }) {
  return (
    <div className="bg-card border-line mx-auto mt-10 flex max-w-md flex-col items-start gap-4 border p-8">
      <span className="bg-muted text-primary grid size-12 place-items-center">
        <LockKeyholeIcon size={22} aria-hidden="true" />
      </span>
      <h1 className="font-serif text-2xl font-extrabold tracking-[-0.05em]">
        Not available for your role
      </h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        This page isn’t part of the {ROLE_META[role].label.toLowerCase()}{" "}
        dashboard. If you need access, ask the super admin to change your role.
      </p>
      <Button
        variant="dark"
        nativeButton={false}
        render={<Link href="/dashboard" />}
      >
        Back to overview
      </Button>
    </div>
  );
}

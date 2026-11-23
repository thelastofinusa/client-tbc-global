"use client";

import { EyeIcon } from "lucide-react";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/shadcn/select";
import { setMemberRole } from "~/lib/dashboard/actions";
import { ROLE_ITEMS } from "~/lib/dashboard/roles";
import type { Role } from "~/lib/dashboard/types";

/**
 * Super admin only: preview the dashboard exactly as another role sees it.
 * Stored in a cookie until there is a database.
 */
export function RoleSwitcher({
  email,
  role,
  baseRole,
}: {
  email: string;
  role: Role;
  baseRole: Role;
}) {
  const [isPending, startTransition] = React.useTransition();
  const previewing = role !== baseRole;

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground flex items-center gap-1.5 text-xs max-md:hidden">
        <EyeIcon className="size-3.5" aria-hidden="true" />
        {previewing ? "Previewing as" : "View as"}
      </span>
      <Select
        items={ROLE_ITEMS}
        value={role}
        disabled={isPending}
        onValueChange={(value) => {
          if (!value) return;
          startTransition(async () => {
            await setMemberRole(email, value);
          });
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label="Preview dashboard as another role"
          className={previewing ? "border-primary min-w-32" : "min-w-32"}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLE_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

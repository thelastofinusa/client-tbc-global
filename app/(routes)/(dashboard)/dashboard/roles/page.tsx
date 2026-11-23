import { CheckIcon, MinusIcon } from "lucide-react";
import type { Metadata } from "next";
import { RoleBadge } from "~/components/dashboard/badges";
import { PageHeader } from "~/components/dashboard/page-header";
import { Card } from "~/components/reusable/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/reusable/shadcn/table";
import { members } from "~/lib/dashboard/mock-data";
import {
  PERMISSION_MATRIX,
  PERMISSIONS,
  ROLE_META,
  ROLES,
} from "~/lib/dashboard/roles";
import type { Role } from "~/lib/dashboard/types";

export const metadata: Metadata = { title: "Roles & access" };

export default function Page() {
  const countFor = (role: Role) =>
    members.filter((m) => m.status === "approved" && m.role === role).length;

  return (
    <>
      <PageHeader
        eyebrow="Church"
        title="Roles & access"
        description="What each role can do. Change a person’s role from the Members page."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {ROLES.map((role) => (
          <Card key={role} variant="surface" className="gap-3">
            <RoleBadge role={role} />
            <p className="text-muted-foreground text-xs leading-relaxed">
              {ROLE_META[role].description}
            </p>
            <p className="mt-auto font-serif text-2xl font-extrabold tabular-nums">
              {countFor(role)}
              <span className="text-muted-foreground ml-1.5 font-sans text-xs font-normal">
                {countFor(role) === 1 ? "person" : "people"}
              </span>
            </p>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 mb-3 font-serif text-lg font-bold">
        Permission matrix
      </h2>
      <div className="border-line bg-card overflow-x-auto border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role} className="text-center">
                  {ROLE_META[role].label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSIONS.map((permission) => (
              <TableRow key={permission}>
                <TableCell className="text-sm font-medium">
                  {permission}
                </TableCell>
                {ROLES.map((role) => {
                  const allowed = PERMISSION_MATRIX[role].includes(permission);
                  return (
                    <TableCell key={role} className="text-center">
                      {allowed ? (
                        <CheckIcon
                          className="text-green mx-auto size-4"
                          aria-label="Allowed"
                        />
                      ) : (
                        <MinusIcon
                          className="text-muted-foreground/40 mx-auto size-4"
                          aria-label="Not allowed"
                        />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

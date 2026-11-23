"use client";

import { format, parseISO } from "date-fns";
import { CheckIcon, SearchIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback } from "~/components/reusable/shadcn/avatar";
import { Button } from "~/components/reusable/shadcn/button";
import { Input } from "~/components/reusable/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/shadcn/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/reusable/shadcn/table";
import { Tabs, TabsList, TabsTrigger } from "~/components/reusable/shadcn/tabs";
import { toast } from "~/components/reusable/shadcn/toast";
import { ROLE_ITEMS, ROLE_META } from "~/lib/dashboard/roles";
import type { Member, MemberStatus, Role } from "~/lib/dashboard/types";
import { MemberStatusBadge, RoleBadge } from "./badges";

type Filter = "all" | MemberStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "suspended", label: "Suspended" },
];

export function MembersTable({
  initialMembers,
  initialFilter = "all",
}: {
  initialMembers: Member[];
  initialFilter?: Filter;
}) {
  // Pending people start with the role they asked for, so approving confirms it.
  const [members, setMembers] = React.useState<Member[]>(() =>
    initialMembers.map((m) =>
      m.status === "pending" ? { ...m, role: m.requestedRole } : m,
    ),
  );
  const [filter, setFilter] = React.useState<Filter>(initialFilter);
  const [query, setQuery] = React.useState("");

  const counts = React.useMemo(
    () => ({
      all: members.length,
      pending: members.filter((m) => m.status === "pending").length,
      approved: members.filter((m) => m.status === "approved").length,
      suspended: members.filter((m) => m.status === "suspended").length,
    }),
    [members],
  );

  const visible = members.filter((m) => {
    if (filter !== "all" && m.status !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(q);
  });

  // TODO: replace these local updates with server actions that call
  // requireSuperAdmin() and write to the database.
  const update = (id: string, patch: Partial<Member>) =>
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );

  const approve = (m: Member) => {
    update(m.id, { status: "approved" });
    toast.add({
      title: `${m.firstName} approved`,
      description: `Role confirmed: ${ROLE_META[m.role].label}.`,
    });
  };

  const decline = (m: Member) => {
    setMembers((prev) => prev.filter((x) => x.id !== m.id));
    toast.add({ title: "Registration declined", description: m.email });
  };

  const changeRole = (m: Member, role: Role) => {
    update(m.id, { role });
    if (m.status !== "pending") {
      toast.add({
        title: "Role updated",
        description: `${m.firstName} is now ${ROLE_META[role].label}.`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className="h-auto flex-wrap">
            {filters.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
                <span className="text-muted-foreground ml-1 text-[11px] tabular-nums">
                  {counts[f.value]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full lg:max-w-xs">
          <SearchIcon
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email"
            aria-label="Search members"
            className="pl-9"
          />
        </div>
      </div>

      <div className="border-line bg-card overflow-x-auto border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Attendance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground py-10 text-center text-sm"
                >
                  No members match this view.
                </TableCell>
              </TableRow>
            )}

            {visible.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {m.firstName[0]}
                        {m.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {m.firstName} {m.lastName}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {m.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={m.requestedRole} />
                </TableCell>
                <TableCell>
                  <Select
                    items={ROLE_ITEMS}
                    value={m.role}
                    onValueChange={(value) => {
                      if (value) changeRole(m, value);
                    }}
                    disabled={m.status === "suspended"}
                  >
                    <SelectTrigger size="sm" className="min-w-32">
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
                </TableCell>
                <TableCell>
                  <MemberStatusBadge status={m.status} />
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {format(parseISO(m.joinedAt), "d MMM yyyy")}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {m.status === "pending" ? "—" : `${m.attendanceRate}%`}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1.5">
                    {m.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="red"
                          onClick={() => approve(m)}
                        >
                          <CheckIcon />
                          Approve
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Decline ${m.firstName}`}
                          onClick={() => decline(m)}
                        >
                          <XIcon />
                        </Button>
                      </>
                    )}
                    {m.status === "approved" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => update(m.id, { status: "suspended" })}
                      >
                        Suspend
                      </Button>
                    )}
                    {m.status === "suspended" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => update(m.id, { status: "approved" })}
                      >
                        Reinstate
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

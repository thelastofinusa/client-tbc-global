"use client";

import { format, parseISO } from "date-fns";
import * as React from "react";
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
import { toast } from "~/components/reusable/shadcn/toast";
import { updateSubmissionStatus } from "~/lib/dashboard/actions";
import type { Submission, SubmissionStatus } from "~/lib/dashboard/types";
import { SubmissionStatusBadge, submissionStatusLabel } from "./badges";

const statusItems = (
  Object.keys(submissionStatusLabel) as SubmissionStatus[]
).map((value) => ({ value, label: submissionStatusLabel[value] }));

export function SubmissionsTable({
  initialRows,
  subjectLabel,
  emptyLabel,
}: {
  initialRows: Submission[];
  subjectLabel: string;
  emptyLabel: string;
}) {
  const [rows, setRows] = React.useState(initialRows);

  const setStatus = async (row: Submission, status: SubmissionStatus) => {
    const previous = row.status;
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status } : r)),
    );
    try {
      await updateSubmissionStatus(row.id, status);
      toast.add({
        title: "Status updated",
        description: `${row.name}: ${submissionStatusLabel[status]}`,
      });
    } catch {
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: previous } : r)),
      );
      toast.add({ title: "Couldn’t update the status" });
    }
  };

  return (
    <div className="border-line bg-card overflow-x-auto border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>{subjectLabel}</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Update</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-muted-foreground py-10 text-center text-sm"
              >
                {emptyLabel}
              </TableCell>
            </TableRow>
          )}
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <p className="text-sm font-medium">{row.name}</p>
                <p className="text-muted-foreground text-xs">{row.email}</p>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="text-sm font-medium">{row.subject}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {row.note}
                </p>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                {format(parseISO(row.submittedAt), "d MMM yyyy")}
              </TableCell>
              <TableCell>
                <SubmissionStatusBadge status={row.status} />
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Select
                    items={statusItems}
                    value={row.status}
                    onValueChange={(value) => {
                      if (value) void setStatus(row, value);
                    }}
                  >
                    <SelectTrigger size="sm" className="min-w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

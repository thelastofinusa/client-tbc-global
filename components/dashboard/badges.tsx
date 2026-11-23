import { Badge } from "~/components/reusable/shadcn/badge";
import { ROLE_META } from "~/lib/dashboard/roles";
import type {
  MemberStatus,
  Role,
  SubmissionStatus,
} from "~/lib/dashboard/types";
import { cn } from "~/lib/utils";

export function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge
      variant="ghost"
      className={cn("rounded-none px-2", ROLE_META[role].tone)}
    >
      {ROLE_META[role].label}
    </Badge>
  );
}

const memberStatus: Record<
  MemberStatus,
  { label: string; variant: "present" | "missed" | "tag" }
> = {
  approved: { label: "Approved", variant: "present" },
  suspended: { label: "Suspended", variant: "missed" },
  pending: { label: "Pending", variant: "tag" },
};

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  const { label, variant } = memberStatus[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export const submissionStatusLabel: Record<SubmissionStatus, string> = {
  new: "New",
  in_review: "In review",
  active: "Active",
  declined: "Declined",
};

const submissionVariant: Record<
  SubmissionStatus,
  "present" | "missed" | "tag" | "tag-red"
> = {
  new: "tag-red",
  in_review: "tag",
  active: "present",
  declined: "missed",
};

export function SubmissionStatusBadge({
  status,
}: {
  status: SubmissionStatus;
}) {
  return (
    <Badge variant={submissionVariant[status]}>
      {submissionStatusLabel[status]}
    </Badge>
  );
}

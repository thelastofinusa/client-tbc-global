import { format, parseISO } from "date-fns";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  HeartHandshakeIcon,
  QrCodeIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { MemberStatusBadge } from "~/components/dashboard/badges";
import { AttendanceChart } from "~/components/dashboard/charts";
import { PageHeader } from "~/components/dashboard/page-header";
import { StatCard } from "~/components/dashboard/stat-card";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import { Progress } from "~/components/reusable/shadcn/progress";
import { getDashboardViewer } from "~/lib/dashboard/access";
import {
  attendanceTrend,
  members,
  partnerSubmissions,
  projects,
  services,
} from "~/lib/dashboard/mock-data";

async function OverviewHeader() {
  const viewer = await getDashboardViewer();

  return (
    <PageHeader
      eyebrow="Super admin"
      title={`Welcome back, ${viewer?.firstName ?? "there"}`}
      description="Here’s what needs your attention across the ministry today."
      actions={
        <Button
          variant="red"
          nativeButton={false}
          render={<Link href="/dashboard/attendance" />}
        >
          <QrCodeIcon />
          Open check-in
        </Button>
      }
    />
  );
}

export default function Page() {
  const approved = members.filter((m) => m.status === "approved");
  const pending = members.filter((m) => m.status === "pending");
  const last = attendanceTrend.at(-1)?.present ?? 0;
  const before = attendanceTrend.at(-2)?.present ?? last;
  const sponsors = projects.reduce((sum, p) => sum + p.sponsors, 0);
  const nextService = services.find((s) => s.id === "s_sun") ?? services[0];

  return (
    <div className="flex flex-col gap-6">
      <Suspense
        fallback={<PageHeader eyebrow="Super admin" title="Welcome back" />}
      >
        <OverviewHeader />
      </Suspense>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Members"
          value={approved.length}
          hint="Approved and active"
          icon={UsersIcon}
        />
        <StatCard
          label="Pending approval"
          value={pending.length}
          hint="Waiting for your decision"
          icon={UserCheckIcon}
          highlight={pending.length > 0}
        />
        <StatCard
          label="Last Sunday"
          value={last}
          hint={`${last >= before ? "+" : ""}${last - before} vs the week before`}
          icon={CalendarCheckIcon}
        />
        <StatCard
          label="Sponsors & partners"
          value={sponsors + partnerSubmissions.length}
          hint={`${sponsors} sponsors · ${partnerSubmissions.length} partners`}
          icon={HeartHandshakeIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card variant="surface" className="gap-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold">
                Sunday attendance
              </h2>
              <p className="text-muted-foreground text-xs">Last 8 weeks</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/reports" />}
            >
              Full reports
              <ArrowRightIcon />
            </Button>
          </div>
          <AttendanceChart />
        </Card>

        <Card variant="surface" className="gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">
              Needs your approval
            </h2>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/members?status=pending" />}
            >
              Review
              <ArrowRightIcon />
            </Button>
          </div>

          {pending.length === 0 ? (
            <p className="text-muted-foreground text-sm">All caught up.</p>
          ) : (
            <ul className="divide-line divide-y">
              {pending.slice(0, 4).map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {m.firstName} {m.lastName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Joined {format(parseISO(m.joinedAt), "d MMM")}
                    </p>
                  </div>
                  <MemberStatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card variant="dark" className="justify-between gap-8">
          <div>
            <p className="text-accent text-xs font-bold tracking-[0.14em] uppercase">
              Next service
            </p>
            <h2 className="mt-2 font-serif text-2xl font-extrabold tracking-[-0.04em]">
              {nextService.name}
            </h2>
            <p className="mt-1 text-sm text-white/75">
              {nextService.day} · {nextService.time} · {nextService.location}
            </p>
          </div>
          <Button
            variant="cream"
            size="lg"
            className="w-max"
            nativeButton={false}
            render={<Link href="/dashboard/attendance" />}
          >
            <QrCodeIcon />
            Open check-in
          </Button>
        </Card>

        <Card variant="surface" className="gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">Projects</h2>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/projects" />}
            >
              Manage
              <ArrowRightIcon />
            </Button>
          </div>
          <ul className="flex flex-col gap-4">
            {projects.map((p) => (
              <li key={p.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {p.progress}%
                  </span>
                </div>
                <Progress value={p.progress} variant="project" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

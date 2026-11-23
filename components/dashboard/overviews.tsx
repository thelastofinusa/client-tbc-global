import { format, parseISO } from "date-fns";
import {
  ArrowRightIcon,
  BellRingIcon,
  CalendarCheckIcon,
  CalendarIcon,
  HeartHandshakeIcon,
  HistoryIcon,
  PercentIcon,
  QrCodeIcon,
  ScanLineIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import { Progress } from "~/components/reusable/shadcn/progress";
import type { DashboardViewer } from "~/lib/dashboard/access";
import {
  attendanceTrend,
  members,
  partnerSubmissions,
  projects,
  services,
  sponsorSubmissions,
} from "~/lib/dashboard/mock-data";
import { MemberStatusBadge, SubmissionStatusBadge } from "./badges";
import { AttendanceChart } from "./charts";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";

const nextService = services.find((s) => s.id === "s_sun") ?? services[0];
const last = attendanceTrend.at(-1)?.present ?? 0;
const before = attendanceTrend.at(-2)?.present ?? last;

function greeting(viewer: DashboardViewer) {
  return `Welcome back, ${viewer.firstName}`;
}

function NextServiceCard({
  action,
}: {
  action: { href: string; label: string; icon: typeof QrCodeIcon };
}) {
  const Icon = action.icon;
  return (
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
        render={<Link href={action.href as "/dashboard"} />}
      >
        <Icon />
        {action.label}
      </Button>
    </Card>
  );
}

function UpcomingList({ manage }: { manage?: boolean }) {
  return (
    <Card variant="surface" className="gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold">Coming up</h2>
        {manage && (
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/dashboard/services" />}
          >
            Manage
            <ArrowRightIcon />
          </Button>
        )}
      </div>
      <ul className="divide-line divide-y">
        {services.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{s.name}</p>
              <p className="text-muted-foreground text-xs">
                {s.day} · {s.time}
              </p>
            </div>
            <span className="text-muted-foreground text-xs capitalize">
              {s.kind}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ───────────────────────── Super admin ───────────────────────── */
export function SuperAdminOverview({ viewer }: { viewer: DashboardViewer }) {
  const approved = members.filter((m) => m.status === "approved");
  const pending = members.filter((m) => m.status === "pending");
  const sponsors = projects.reduce((sum, p) => sum + p.sponsors, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Super admin"
        title={greeting(viewer)}
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
        <NextServiceCard
          action={{
            href: "/dashboard/attendance",
            label: "Open check-in",
            icon: QrCodeIcon,
          }}
        />
        <ProjectsCard manage />
      </div>
    </div>
  );
}

function ProjectsCard({ manage }: { manage?: boolean }) {
  return (
    <Card variant="surface" className="gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold">Projects</h2>
        {manage && (
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/dashboard/projects" />}
          >
            Manage
            <ArrowRightIcon />
          </Button>
        )}
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
  );
}

/* ───────────────────────── Admin ───────────────────────── */
export function AdminOverview({ viewer }: { viewer: DashboardViewer }) {
  const approved = members.filter((m) => m.status === "approved");
  const absent = approved.filter((m) => m.lastAttended !== "2026-11-22");
  const newSponsors = sponsorSubmissions.filter((s) => s.status === "new");
  const newPartners = partnerSubmissions.filter((s) => s.status === "new");
  const recent = [...sponsorSubmissions, ...partnerSubmissions]
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Admin"
        title={greeting(viewer)}
        description="Services, attendance and follow-ups for this week."
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

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Last Sunday"
          value={last}
          hint={`${last >= before ? "+" : ""}${last - before} vs the week before`}
          icon={CalendarCheckIcon}
        />
        <StatCard
          label="Absent members"
          value={absent.length}
          hint="Didn’t check in last Sunday"
          icon={BellRingIcon}
          highlight={absent.length > 0}
        />
        <StatCard
          label="New sponsors"
          value={newSponsors.length}
          hint="Waiting for a reply"
          icon={HeartHandshakeIcon}
        />
        <StatCard
          label="New partners"
          value={newPartners.length}
          hint="Waiting for a reply"
          icon={UsersIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card variant="surface" className="gap-4 xl:col-span-2">
          <h2 className="font-serif text-lg font-bold">Sunday attendance</h2>
          <AttendanceChart />
        </Card>

        <Card variant="surface" className="gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">Latest requests</h2>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/sponsors" />}
            >
              View
              <ArrowRightIcon />
            </Button>
          </div>
          <ul className="divide-line divide-y">
            {recent.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {r.subject}
                  </p>
                </div>
                <SubmissionStatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NextServiceCard
          action={{
            href: "/dashboard/attendance",
            label: "Open check-in",
            icon: QrCodeIcon,
          }}
        />
        <UpcomingList manage />
      </div>
    </div>
  );
}

/* ───────────────────────── Usher ───────────────────────── */
export function UsherOverview({ viewer }: { viewer: DashboardViewer }) {
  const approved = members.filter((m) => m.status === "approved");
  const present = approved.filter((m) => m.lastAttended === "2026-11-22");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Usher"
        title={greeting(viewer)}
        description="Open check-in at the entrance and show the code to everyone arriving."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NextServiceCard
          action={{
            href: "/dashboard/attendance",
            label: "Show check-in code",
            icon: QrCodeIcon,
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Present last Sunday"
            value={present.length}
            hint="Checked in by QR"
            icon={CalendarCheckIcon}
          />
          <StatCard
            label="Expected next"
            value={nextService.expected}
            hint={nextService.name}
            icon={UsersIcon}
          />
          <Card variant="surface" className="col-span-2 gap-3">
            <h2 className="font-serif text-lg font-bold">
              Checking yourself in?
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ushers scan in like everyone else. Ask another usher to show the
              code, then scan it from your dashboard.
            </p>
            <Button
              variant="outline"
              className="w-max"
              nativeButton={false}
              render={<Link href="/dashboard/scan" />}
            >
              <ScanLineIcon />
              Scan to check in
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Media team ───────────────────────── */
export function MediaOverview({ viewer }: { viewer: DashboardViewer }) {
  const mountZion = projects.find((p) => p.id === "p_zion");
  const sponsors = projects.reduce((sum, p) => sum + p.sponsors, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Media team"
        title={greeting(viewer)}
        description="What’s coming up and the latest numbers you can share."
        actions={
          <Button
            variant="red"
            nativeButton={false}
            render={<Link href="/dashboard/services" />}
          >
            <CalendarIcon />
            Manage events
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Last Sunday"
          value={last}
          hint="People who attended"
          icon={CalendarCheckIcon}
        />
        <StatCard
          label="Mount Zion"
          value={`${mountZion?.progress ?? 0}%`}
          hint="Of the building done"
          icon={UserCheckIcon}
        />
        <StatCard
          label="Sponsors"
          value={sponsors}
          hint="Across all projects"
          icon={HeartHandshakeIcon}
        />
        <StatCard
          label="Next gathering"
          value={nextService.time}
          hint={nextService.day}
          icon={CalendarIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UpcomingList manage />
        <Card variant="surface" className="gap-3">
          <h2 className="font-serif text-lg font-bold">Check in</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Scan the QR code at church to record your own attendance.
          </p>
          <Button
            variant="outline"
            className="w-max"
            nativeButton={false}
            render={<Link href="/dashboard/scan" />}
          >
            <ScanLineIcon />
            Scan to check in
          </Button>
        </Card>
      </div>
    </div>
  );
}

/* ───────────────────────── Attendee ───────────────────────── */
export function AttendeeOverview({ viewer }: { viewer: DashboardViewer }) {
  const mountZion = projects.find((p) => p.id === "p_zion");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Member"
        title={greeting(viewer)}
        description="The Burning Church is a house of worship rooted in Kudenda, Kaduna. We’re glad you’re here."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NextServiceCard
          action={{
            href: "/dashboard/scan",
            label: "Scan to check in",
            icon: ScanLineIcon,
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Attendance"
            value={viewer.member ? `${viewer.member.attendanceRate}%` : "—"}
            hint="Last 8 weeks"
            icon={PercentIcon}
          />
          <StatCard
            label="Last attended"
            value={
              viewer.member?.lastAttended
                ? format(parseISO(viewer.member.lastAttended), "d MMM")
                : "—"
            }
            hint="From church records"
            icon={HistoryIcon}
          />
          <Card variant="surface" className="col-span-2 gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold">
                What we’re building
              </h2>
              <span className="text-muted-foreground text-xs tabular-nums">
                {mountZion?.progress ?? 0}%
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {mountZion?.name}: {mountZion?.description}
            </p>
            <Progress value={mountZion?.progress ?? 0} variant="project" />
          </Card>
        </div>
      </div>

      <UpcomingList />
    </div>
  );
}

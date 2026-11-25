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
  getAttendanceSnapshot,
  getMembers,
  getMyAttendance,
  getNewSubmissionCounts,
  getSubmissions,
  getTotalSubmissionCounts,
} from "~/lib/dashboard/data";
import { pickNextService } from "~/lib/dashboard/next-service";
import type { ChurchService } from "~/lib/dashboard/types";
import { getFeaturedProject, getProjects } from "~/lib/data/projects";
import { getServices } from "~/lib/data/services";
import { MemberStatusBadge, SubmissionStatusBadge } from "./badges";
import { AttendanceChart } from "./charts";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";

function greeting(viewer: DashboardViewer) {
  return `Welcome back, ${viewer.firstName}`;
}

function delta(current: number, previous: number) {
  const diff = current - previous;
  return `${diff >= 0 ? "+" : ""}${diff} vs the service before`;
}

function NextServiceCard({
  service,
  action,
}: {
  service: ChurchService | null;
  action: { href: string; label: string; icon: typeof QrCodeIcon };
}) {
  const Icon = action.icon;
  return (
    <Card variant="dark" className="justify-between gap-8">
      <div>
        <p className="text-accent text-xs font-bold tracking-[0.14em] uppercase">
          Next service
        </p>
        {service ? (
          <>
            <h2 className="mt-2 font-serif text-2xl font-extrabold tracking-[-0.04em]">
              {service.name}
            </h2>
            <p className="mt-1 text-sm text-white/75">
              {service.day} · {service.time} · {service.location}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-white/75">
            No services yet. Add them in Sanity Studio.
          </p>
        )}
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

function UpcomingList({
  services,
  manage,
}: {
  services: ChurchService[];
  manage?: boolean;
}) {
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
      {services.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nothing scheduled yet.</p>
      ) : (
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
      )}
    </Card>
  );
}

async function ProjectsCard({ manage }: { manage?: boolean }) {
  const projects = await getProjects();
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
      {projects.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No projects yet. Add them in Sanity Studio.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {projects.map((p) => (
            <li key={p.slug} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{p.title}</span>
                <span className="text-muted-foreground tabular-nums">
                  {p.progress.percentage}%
                </span>
              </div>
              <Progress value={p.progress.percentage} variant="project" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ───────────────────────── Super admin ───────────────────────── */
export async function SuperAdminOverview({
  viewer,
}: {
  viewer: DashboardViewer;
}) {
  const [members, snapshot, services, totals] = await Promise.all([
    getMembers(),
    getAttendanceSnapshot(),
    getServices(),
    getTotalSubmissionCounts(),
  ]);
  const approved = members.filter((m) => m.status === "approved");
  const pending = members.filter((m) => m.status === "pending");

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
          label="Last service"
          value={snapshot.presentCount}
          hint={
            snapshot.lastServiceDate
              ? delta(snapshot.presentCount, snapshot.previousCount)
              : "No check-ins yet"
          }
          icon={CalendarCheckIcon}
        />
        <StatCard
          label="Sponsors & partners"
          value={totals.sponsors + totals.partners}
          hint={`${totals.sponsors} sponsors · ${totals.partners} partners`}
          icon={HeartHandshakeIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card variant="surface" className="gap-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold">Attendance</h2>
              <p className="text-muted-foreground text-xs">
                Check-ins at the last 8 service days
              </p>
            </div>
          </div>
          <AttendanceChart data={snapshot.trend} />
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
          service={pickNextService(services)}
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

/* ───────────────────────── Admin ───────────────────────── */
export async function AdminOverview({ viewer }: { viewer: DashboardViewer }) {
  const [snapshot, services, newCounts, sponsors, partners] = await Promise.all(
    [
      getAttendanceSnapshot(),
      getServices(),
      getNewSubmissionCounts(),
      getSubmissions("sponsor"),
      getSubmissions("partner"),
    ],
  );

  const recent = [...sponsors, ...partners]
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
          label="Last service"
          value={snapshot.presentCount}
          hint={
            snapshot.lastServiceDate
              ? delta(snapshot.presentCount, snapshot.previousCount)
              : "No check-ins yet"
          }
          icon={CalendarCheckIcon}
        />
        <StatCard
          label="Absent members"
          value={snapshot.absent.length}
          hint="Didn’t check in at the last service"
          icon={BellRingIcon}
          highlight={snapshot.absent.length > 0}
        />
        <StatCard
          label="New sponsors"
          value={newCounts.sponsors}
          hint="Waiting for a reply"
          icon={HeartHandshakeIcon}
        />
        <StatCard
          label="New partners"
          value={newCounts.partners}
          hint="Waiting for a reply"
          icon={UsersIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card variant="surface" className="gap-4 xl:col-span-2">
          <h2 className="font-serif text-lg font-bold">Attendance</h2>
          <AttendanceChart data={snapshot.trend} />
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
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No sponsor or partner requests yet.
            </p>
          ) : (
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
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NextServiceCard
          service={pickNextService(services)}
          action={{
            href: "/dashboard/attendance",
            label: "Open check-in",
            icon: QrCodeIcon,
          }}
        />
        <UpcomingList services={services} manage />
      </div>
    </div>
  );
}

/* ───────────────────────── Usher ───────────────────────── */
export async function UsherOverview({ viewer }: { viewer: DashboardViewer }) {
  const [snapshot, services] = await Promise.all([
    getAttendanceSnapshot(),
    getServices(),
  ]);
  const next = pickNextService(services);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Usher"
        title={greeting(viewer)}
        description="Open check-in at the entrance and show the code to everyone arriving."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NextServiceCard
          service={next}
          action={{
            href: "/dashboard/attendance",
            label: "Show check-in code",
            icon: QrCodeIcon,
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Present last service"
            value={snapshot.presentCount}
            hint="Checked in by QR"
            icon={CalendarCheckIcon}
          />
          <StatCard
            label="Expected next"
            value={next?.expected ?? 0}
            hint={next?.name ?? "No service scheduled"}
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
export async function MediaOverview({ viewer }: { viewer: DashboardViewer }) {
  const [snapshot, services, featured, projects, totals] = await Promise.all([
    getAttendanceSnapshot(),
    getServices(),
    getFeaturedProject(),
    getProjects(),
    getTotalSubmissionCounts(),
  ]);
  const next = pickNextService(services);
  const sponsors = projects.reduce(
    (sum, p) => sum + p.progress.supportersCount,
    0,
  );

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
          label="Last service"
          value={snapshot.presentCount}
          hint="People who attended"
          icon={CalendarCheckIcon}
        />
        <StatCard
          label={featured?.title ?? "Featured project"}
          value={featured ? `${featured.progress.percentage}%` : "—"}
          hint="Of the project done"
          icon={UserCheckIcon}
        />
        <StatCard
          label="Sponsors"
          value={Math.max(sponsors, totals.sponsors)}
          hint="Across all projects"
          icon={HeartHandshakeIcon}
        />
        <StatCard
          label="Next gathering"
          value={next?.time ?? "—"}
          hint={next?.day ?? "Nothing scheduled"}
          icon={CalendarIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UpcomingList services={services} manage />
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
export async function AttendeeOverview({
  viewer,
}: {
  viewer: DashboardViewer;
}) {
  const [mine, services, featured] = await Promise.all([
    getMyAttendance(viewer.id),
    getServices(),
    getFeaturedProject(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Member"
        title={greeting(viewer)}
        description="The Burning Church Global is a house of worship rooted in Kudenda, Kaduna. We’re glad you’re here."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NextServiceCard
          service={pickNextService(services)}
          action={{
            href: "/dashboard/scan",
            label: "Scan to check in",
            icon: ScanLineIcon,
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Attendance"
            value={`${mine.attendanceRate}%`}
            hint="Last 8 weeks"
            icon={PercentIcon}
          />
          <StatCard
            label="Last attended"
            value={
              mine.lastAttended
                ? format(parseISO(mine.lastAttended), "d MMM")
                : "—"
            }
            hint="From church records"
            icon={HistoryIcon}
          />
          {featured && (
            <Card variant="surface" className="col-span-2 gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold">
                  What we’re building
                </h2>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {featured.progress.percentage}%
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {featured.title}: {featured.summary}
              </p>
              <Progress
                value={featured.progress.percentage}
                variant="project"
              />
            </Card>
          )}
        </div>
      </div>

      <UpcomingList services={services} />
    </div>
  );
}

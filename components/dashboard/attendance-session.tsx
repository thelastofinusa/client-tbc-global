"use client";

import { format, parseISO } from "date-fns";
import {
  BellRingIcon,
  CircleDotIcon,
  CopyIcon,
  ExternalLinkIcon,
  PlayIcon,
  RefreshCwIcon,
  SquareIcon,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import * as React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/shadcn/select";
import { toast } from "~/components/reusable/shadcn/toast";
import {
  buildCheckInUrl,
  type CheckInData,
  CODE_TTL_MS,
} from "~/lib/dashboard/checkin";
import {
  clearOpenSession,
  saveOpenSession,
} from "~/lib/dashboard/checkin-store";
import type { ChurchService, Member } from "~/lib/dashboard/types";

const ROTATE_SECONDS = 30;

function newCode() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
}

export function AttendanceSession({
  services,
  members,
  lastServiceDate,
  mode = "full",
}: {
  services: ChurchService[];
  members: Member[];
  /** ISO date of the service the present/absent lists describe. */
  lastServiceDate: string;
  /** "qr-only" is the usher view: just the code and the live count. */
  mode?: "full" | "qr-only";
}) {
  const serviceItems = services.map((s) => ({
    value: s.id,
    label: `${s.name} · ${s.day}, ${s.time}`,
  }));

  const [serviceId, setServiceId] = React.useState(services[0]?.id ?? "");
  const [live, setLive] = React.useState(false);
  const [session, setSession] = React.useState<{
    data: CheckInData;
    url: string;
  } | null>(null);
  const [secondsLeft, setSecondsLeft] = React.useState(ROTATE_SECONDS);
  const [reminded, setReminded] = React.useState<Set<string>>(new Set());

  const service = services.find((s) => s.id === serviceId);

  const issue = React.useCallback(() => {
    if (!service) return;
    const data: CheckInData = {
      serviceId: service.id,
      service: service.name,
      day: service.day,
      time: service.time,
      code: newCode(),
      expiresAt: Date.now() + CODE_TTL_MS,
    };
    saveOpenSession(data);
    setSession({
      data,
      url: buildCheckInUrl(window.location.origin, data),
    });
    setSecondsLeft(ROTATE_SECONDS);
  }, [service]);

  // Rotate the code every 30s while check-in is open.
  React.useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          issue();
          return ROTATE_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [live, issue]);

  const start = () => {
    issue();
    setLive(true);
  };

  const stop = React.useCallback(() => {
    setLive(false);
    setSession(null);
    clearOpenSession();
  }, []);

  // Close the session if the page is left.
  React.useEffect(() => () => clearOpenSession(), []);

  const approved = members.filter((m) => m.status === "approved");
  const present = approved.filter((m) => m.lastAttended === lastServiceDate);
  const absent = approved.filter((m) => m.lastAttended !== lastServiceDate);

  // TODO: send through the email provider once the backend exists.
  const remind = (m: Member) => {
    setReminded((prev) => new Set(prev).add(m.id));
    toast.add({
      title: "Reminder sent",
      description: `${m.firstName} ${m.lastName} was emailed that service has started.`,
    });
  };

  const remindAll = () => {
    const pending = absent.filter((m) => !reminded.has(m.id));
    if (pending.length === 0) return;
    setReminded((prev) => new Set([...prev, ...pending.map((m) => m.id)]));
    toast.add({
      title: "Reminders sent",
      description: `${pending.length} absent members were emailed.`,
    });
  };

  const copyLink = async () => {
    if (!session) return;
    try {
      await navigator.clipboard.writeText(session.url);
      toast.add({ title: "Link copied" });
    } catch {
      toast.add({ title: "Couldn’t copy the link" });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,400px)_1fr]">
      {/* Check-in code */}
      <Card variant="surface" className="h-fit gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
            Service
          </span>
          <Select
            items={serviceItems}
            value={serviceId}
            onValueChange={(value) => {
              if (value) {
                setServiceId(value);
                stop();
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {serviceItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-line bg-background grid place-items-center border p-6">
          {live && session ? (
            <div className="flex flex-col items-center gap-3">
              <QRCodeSVG
                value={session.url}
                size={220}
                level="M"
                bgColor="transparent"
                fgColor="currentColor"
                className="text-foreground"
                title="Attendance QR code"
              />
              <p className="font-mono text-sm tracking-[0.3em]">
                {session.data.code}
              </p>
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <CircleDotIcon className="text-primary size-3 animate-pulse" />
                New code in {secondsLeft}s
              </p>
            </div>
          ) : (
            <div className="text-muted-foreground flex min-h-52 flex-col items-center justify-center gap-2 text-center text-sm">
              <p className="text-foreground font-serif font-bold">
                Check-in is closed
              </p>
              <p className="max-w-56 text-xs leading-relaxed">
                Start check-in and show this code at the venue. Members scan it
                from their own dashboard.
              </p>
            </div>
          )}
        </div>

        {/* What the QR code carries */}
        {live && session && (
          <div className="flex flex-col gap-3">
            <dl className="border-line divide-line divide-y border text-xs">
              {[
                ["Service", session.data.service],
                ["When", `${session.data.day}, ${session.data.time}`],
                ["Code", session.data.code],
                [
                  "Valid until",
                  format(new Date(session.data.expiresAt), "h:mm:ss a"),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 px-3 py-2"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={copyLink}
              >
                <CopyIcon />
                Copy link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                nativeButton={false}
                render={
                  <a href={session.url} target="_blank" rel="noreferrer" />
                }
              >
                <ExternalLinkIcon />
                Test scan
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {live ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={issue}
              >
                <RefreshCwIcon />
                New code
              </Button>
              <Button
                variant="dark"
                size="lg"
                className="flex-1"
                onClick={stop}
              >
                <SquareIcon />
                Stop
              </Button>
            </>
          ) : (
            <Button variant="red" size="lg" className="w-full" onClick={start}>
              <PlayIcon />
              Start check-in
            </Button>
          )}
        </div>
      </Card>

      {/* Present / absent */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Present", value: present.length },
            { label: "Expected", value: service?.expected ?? 0 },
            { label: "Absent", value: absent.length },
          ].map((item) => (
            <Card key={item.label} variant="metric">
              <span className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
                {item.label}
              </span>
              <strong className="mt-3 block font-serif text-3xl leading-none font-extrabold tracking-[-0.05em] tabular-nums">
                {item.value}
              </strong>
            </Card>
          ))}
        </div>

        {mode === "full" ? (
          <Card variant="surface" className="gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg font-bold">Absent members</h2>
                <p className="text-muted-foreground text-xs">
                  Didn’t check in on{" "}
                  {format(parseISO(lastServiceDate), "EEEE d MMM")}.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={remindAll}
                disabled={absent.every((m) => reminded.has(m.id))}
              >
                <BellRingIcon />
                Remind all
              </Button>
            </div>

            <ul className="divide-line divide-y">
              {absent.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {m.firstName} {m.lastName}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {m.lastAttended
                        ? `Last seen ${format(parseISO(m.lastAttended), "d MMM")}`
                        : "Hasn’t attended yet"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={reminded.has(m.id)}
                    onClick={() => remind(m)}
                  >
                    {reminded.has(m.id) ? "Sent" : "Send reminder"}
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card variant="surface" className="gap-2">
            <h2 className="font-serif text-lg font-bold">How it works</h2>
            <ol className="text-muted-foreground list-decimal space-y-1.5 pl-4 text-sm leading-relaxed">
              <li>Pick the service and press “Start check-in”.</li>
              <li>
                Show the code at the entrance. It changes every 30 seconds.
              </li>
              <li>
                Members open “Scan to check in” on their dashboard and point
                their camera at it.
              </li>
            </ol>
          </Card>
        )}
      </div>
    </div>
  );
}

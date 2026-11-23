"use client";

import {
  CalendarPlusIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/reusable/shadcn/dialog";
import { Input } from "~/components/reusable/shadcn/input";
import { Label } from "~/components/reusable/shadcn/label";
import { toast } from "~/components/reusable/shadcn/toast";
import type { ChurchService } from "~/lib/dashboard/types";

export function ServicesBoard({
  initialServices,
}: {
  initialServices: ChurchService[];
}) {
  const [services, setServices] = React.useState(initialServices);
  const [open, setOpen] = React.useState(false);

  const weekly = services.filter((s) => s.kind === "weekly");
  const special = services.filter((s) => s.kind === "special");

  // TODO: persist with a server action (requireSuperAdmin first).
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;

    setServices((prev) => [
      ...prev,
      {
        id: `e_${Date.now()}`,
        name,
        kind: "special",
        day: String(data.get("date") ?? ""),
        time: String(data.get("time") ?? ""),
        location: String(data.get("location") ?? "") || "Kudenda, Kaduna",
        expected: Number(data.get("expected") ?? 0) || 0,
      },
    ]);
    setOpen(false);
    toast.add({ title: "Event added", description: name });
  };

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Weekly services" className="flex flex-col gap-3">
        <h2 className="font-serif text-lg font-bold">Weekly services</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {weekly.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      <section aria-label="Special events" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-bold">Special events</h2>
          <Button variant="red" size="sm" onClick={() => setOpen(true)}>
            <CalendarPlusIcon />
            New event
          </Button>
        </div>

        {special.length === 0 ? (
          <p className="border-border text-muted-foreground border border-dashed p-6 text-center text-sm">
            No special events yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {special.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none sm:max-w-md">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>New event</DialogTitle>
              <DialogDescription>
                Add a one-off gathering. It appears on the attendance page and
                the public services page.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="event-name">Name</Label>
                <Input id="event-name" name="name" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="event-date">Date</Label>
                  <Input id="event-date" name="date" type="date" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="event-time">Time</Label>
                  <Input id="event-time" name="time" type="time" required />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  name="location"
                  placeholder="Kudenda, Kaduna"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="event-expected">Expected attendance</Label>
                <Input
                  id="event-expected"
                  name="expected"
                  type="number"
                  min={0}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="red">
                Add event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiceCard({ service }: { service: ChurchService }) {
  return (
    <Card variant="surface" className="gap-4">
      <div>
        <p className="text-primary text-xs font-bold tracking-[0.14em] uppercase">
          {service.day}
        </p>
        <h3 className="mt-1 font-serif text-xl font-extrabold tracking-[-0.03em]">
          {service.name}
        </h3>
      </div>
      <ul className="text-muted-foreground flex flex-col gap-1.5 text-xs">
        <li className="flex items-center gap-2">
          <ClockIcon className="size-3.5" aria-hidden="true" />
          {service.time}
        </li>
        <li className="flex items-center gap-2">
          <MapPinIcon className="size-3.5" aria-hidden="true" />
          {service.location}
        </li>
        <li className="flex items-center gap-2">
          <UsersIcon className="size-3.5" aria-hidden="true" />
          {service.expected} expected
        </li>
      </ul>
    </Card>
  );
}

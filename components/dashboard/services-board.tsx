"use client";

import {
  CalendarPlusIcon,
  ClockIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/reusable/shadcn/alert-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/shadcn/select";
import { toast } from "~/components/reusable/shadcn/toast";
import { useDashboardStore } from "~/lib/dashboard/store";
import type { ChurchService } from "~/lib/dashboard/types";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function ServicesBoard() {
  const services = useDashboardStore((s) => s.services);
  const addService = useDashboardStore((s) => s.addService);
  const updateService = useDashboardStore((s) => s.updateService);
  const removeService = useDashboardStore((s) => s.removeService);

  const weekly = services.filter((s) => s.kind === "weekly");
  const special = services.filter((s) => s.kind === "special");

  const [open, setOpen] = React.useState(false);
  const [kind, setKind] = React.useState<"weekly" | "special">("weekly");
  const [editing, setEditing] = React.useState<ChurchService | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ChurchService | null>(
    null,
  );

  function openNew(nextKind: "weekly" | "special") {
    setKind(nextKind);
    setEditing(null);
    setOpen(true);
  }

  function openEdit(service: ChurchService) {
    setKind(service.kind);
    setEditing(service);
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;

    const payload = {
      name,
      kind,
      day:
        kind === "weekly"
          ? String(data.get("weekday") ?? "Sunday")
          : String(data.get("date") ?? ""),
      time: String(data.get("time") ?? ""),
      location: String(data.get("location") ?? "").trim() || "Kudenda, Kaduna",
      expected: Number(data.get("expected") ?? 0) || 0,
    };

    if (editing) {
      updateService(editing.id, payload);
      toast.add({ title: "Service updated", description: name });
    } else {
      addService(payload);
      toast.add({
        title: kind === "weekly" ? "Weekly service added" : "Event added",
        description: name,
      });
    }

    setOpen(false);
    setEditing(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    removeService(deleteTarget.id);
    toast.add({ title: "Service removed", description: deleteTarget.name });
    setDeleteTarget(null);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Weekly services */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-bold">Weekly services</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openNew("weekly")}
          >
            <PlusIcon className="size-4" />
            <span>New weekly service</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {weekly.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => openEdit(service)}
              onDelete={() => setDeleteTarget(service)}
            />
          ))}
        </div>
        {weekly.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No weekly services yet. Add one to get started.
          </p>
        )}
      </section>

      {/* Special events */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-bold">Special events</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openNew("special")}
          >
            <CalendarPlusIcon className="size-4" />
            <span>New event</span>
          </Button>
        </div>

        {special.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No special events yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {special.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => openEdit(service)}
                onDelete={() => setDeleteTarget(service)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create / edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing
                ? "Edit service"
                : kind === "weekly"
                  ? "New weekly service"
                  : "New special event"}
            </DialogTitle>
            <DialogDescription>
              {kind === "weekly"
                ? "Recurring weekly gathering. It appears on the attendance page and the public services page."
                : "A one-off gathering. It appears on the attendance page and the public services page."}
            </DialogDescription>
          </DialogHeader>

          <form
            key={editing?.id ?? kind}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="service-name">Name</Label>
              <Input
                id="service-name"
                name="name"
                defaultValue={editing?.name ?? ""}
                placeholder={
                  kind === "weekly" ? "Sunday service" : "Youth night"
                }
                required
              />
            </div>

            {kind === "weekly" ? (
              <div className="space-y-2">
                <Label htmlFor="service-weekday">Day of week</Label>
                <Select name="weekday" defaultValue={editing?.day ?? "Sunday"}>
                  <SelectTrigger id="service-weekday">
                    <SelectValue placeholder="Pick a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEKDAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="service-date">Date</Label>
                <Input
                  id="service-date"
                  name="date"
                  defaultValue={editing?.day ?? ""}
                  placeholder="Fri, 5 Dec 2026"
                  required
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-time">Time</Label>
                <Input
                  id="service-time"
                  name="time"
                  defaultValue={editing?.time ?? ""}
                  placeholder="9:00 AM"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-expected">Expected attendance</Label>
                <Input
                  id="service-expected"
                  name="expected"
                  type="number"
                  min={0}
                  defaultValue={editing?.expected ?? 0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-location">Location</Label>
              <Input
                id="service-location"
                name="location"
                defaultValue={editing?.location ?? "Kudenda, Kaduna"}
              />
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
                {editing ? "Save changes" : "Add service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this service?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} will be removed from the dashboard and the
              public services page. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Remove service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: ChurchService;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card variant="surface" className="gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="bg-muted text-primary inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold">
          {service.day}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-8 p-0"
            aria-label={`Edit ${service.name}`}
            onClick={onEdit}
          >
            <PencilIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-8 p-0"
            aria-label={`Remove ${service.name}`}
            onClick={onDelete}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-xl font-extrabold tracking-[-0.03em]">
          {service.name}
        </h3>
        <ul className="text-muted-foreground mt-3 space-y-1.5 text-sm">
          <li className="flex items-center gap-2">
            <ClockIcon className="size-3.5" />
            {service.time}
          </li>
          <li className="flex items-center gap-2">
            <MapPinIcon className="size-3.5" />
            {service.location}
          </li>
          <li className="flex items-center gap-2">
            <UsersIcon className="size-3.5" />
            {service.expected} expected
          </li>
        </ul>
      </div>
    </Card>
  );
}

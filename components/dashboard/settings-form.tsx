"use client";

import {
  ArrowUpRightIcon,
  MessageCircleIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react";
import type * as React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import { Input } from "~/components/reusable/shadcn/input";
import { Label } from "~/components/reusable/shadcn/label";
import { Switch } from "~/components/reusable/shadcn/switch";
import { toast } from "~/components/reusable/shadcn/toast";
import { useDashboardStore } from "~/lib/dashboard/store";

const notificationOptions = [
  {
    id: "service-reminders",
    label: "Service & gathering reminders",
    description:
      "Get notified ahead of Sunday, Wednesday, and Saturday gatherings.",
    defaultChecked: true,
  },
  {
    id: "attendance-updates",
    label: "Attendance & check-in receipts",
    description: "Confirmations when your check-in is recorded.",
    defaultChecked: true,
  },
  {
    id: "project-updates",
    label: "Project & outreach updates",
    description: "Milestones and drives you follow or support.",
    defaultChecked: true,
  },
  {
    id: "weekly-digest",
    label: "Weekly community digest",
    description: "A short weekly recap of announcements and events.",
    defaultChecked: false,
  },
];

const communityChannels = [
  {
    id: "whatsapp",
    name: "WhatsApp Community",
    description: "Daily fellowship updates, reminders, and announcements.",
    href: "https://chat.whatsapp.com/",
    icon: MessageCircleIcon,
    badge: "Active",
  },
  {
    id: "telegram",
    name: "Telegram Channel",
    description: "Broadcasts, event notes, and shared resources.",
    href: "https://t.me/",
    icon: SendIcon,
    badge: "Channel",
  },
  {
    id: "fellowship-group",
    name: "Member & Volunteer Forum",
    description: "Coordinate serving, outreach, and small-group check-ins.",
    href: "https://chat.whatsapp.com/",
    icon: UsersIcon,
    badge: "Members",
  },
];

export function SettingsForm() {
  const profile = useDashboardStore((s) => s.profile);
  const updateProfile = useDashboardStore((s) => s.updateProfile);
  const resetDemoData = useDashboardStore((s) => s.resetDemoData);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    updateProfile({
      name: String(data.get("name") ?? ""),
      location: String(data.get("location") ?? ""),
      address: String(data.get("address") ?? ""),
      phone: String(data.get("phone") ?? ""),
      birthday: String(data.get("birthday") ?? ""),
    });
    toast.add({ title: "Profile & settings saved" });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Personal Details */}
      <Card variant="surface" className="gap-6 p-6">
        <div>
          <h2 className="font-serif text-xl font-bold">Personal details</h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Update your profile information and contact details. Your email is
            managed by your account sign-in and cannot be changed here.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Full name</Label>
              <Input
                id="settings-name"
                name="name"
                defaultValue={profile.name}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email address</Label>
              <Input
                id="settings-email"
                name="email"
                type="email"
                value={profile.email}
                disabled
                readOnly
                aria-describedby="settings-email-help"
              />
              <p
                id="settings-email-help"
                className="text-muted-foreground text-xs"
              >
                Email is locked to your sign-in account.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-location">Location</Label>
              <Input
                id="settings-location"
                name="location"
                defaultValue={profile.location}
                placeholder="Kudenda, Kaduna"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-phone">Phone number</Label>
              <Input
                id="settings-phone"
                name="phone"
                type="tel"
                defaultValue={profile.phone}
                placeholder="+234 ..."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-address">Address</Label>
              <Input
                id="settings-address"
                name="address"
                defaultValue={profile.address}
                placeholder="Street, area"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-birthday">Birthday</Label>
              <Input
                id="settings-birthday"
                name="birthday"
                type="date"
                defaultValue={profile.birthday}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="red">
              Save changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetDemoData();
                toast.add({ title: "Demo data reset" });
              }}
            >
              Reset demo data
            </Button>
          </div>
        </form>
      </Card>

      {/* Notifications */}
      <Card variant="surface" className="gap-4 p-6">
        <div>
          <h2 className="font-serif text-xl font-bold">Notifications</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Choose what updates and reminders you receive.
          </p>
        </div>

        <ul className="divide-line divide-y">
          {notificationOptions.map((option) => (
            <li
              key={option.id}
              className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {option.description}
                </p>
              </div>
              <Switch defaultChecked={option.defaultChecked} />
            </li>
          ))}
        </ul>
      </Card>

      {/* Community Links */}
      <Card variant="surface" className="gap-4 p-6">
        <div>
          <h2 className="font-serif text-xl font-bold">Join the community</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Connect with members and stay up to date across our group channels.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {communityChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border-line hover:border-primary group flex h-full flex-col gap-3 border p-4 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <span className="bg-muted text-primary grid size-9 place-items-center">
                      <Icon className="size-4" />
                    </span>
                    <ArrowUpRightIcon className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{channel.name}</p>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {channel.description}
                    </p>
                  </div>
                  <span className="text-muted-foreground mt-auto text-[10px] font-semibold tracking-wider uppercase">
                    {channel.badge}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

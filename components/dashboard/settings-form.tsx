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

export interface SettingsUserProfile {
  name: string;
  email: string;
  location: string;
  address: string;
  phone: string;
  birthday: string;
}

interface SettingsFormProps {
  user?: Partial<SettingsUserProfile>;
}

const defaultUserProfile: SettingsUserProfile = {
  name: "",
  email: "member@example.org",
  location: "Kudenda, Kaduna",
  address: "",
  phone: "",
  birthday: "",
};

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

export function SettingsForm({ user }: SettingsFormProps) {
  const profile: SettingsUserProfile = {
    ...defaultUserProfile,
    ...user,
  };

  // TODO: persist profile & notification preferences via a server action.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.add({ title: "Profile & settings saved" });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Personal Details */}
      <Card variant="surface" className="gap-5">
        <div>
          <h2 className="font-serif text-lg font-bold">Personal details</h2>
          <p className="text-muted-foreground text-xs">
            Update your profile information and contact details. Your email is
            managed by your account sign-in.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-name">Full name</Label>
            <Input
              id="user-name"
              name="name"
              type="text"
              defaultValue={profile.name}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-email">Email address</Label>
            <Input
              id="user-email"
              name="email"
              type="email"
              value={profile.email}
              disabled
              readOnly
              aria-readonly="true"
              className="cursor-not-allowed opacity-70"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-location">Location</Label>
            <Input
              id="user-location"
              name="location"
              type="text"
              defaultValue={profile.location}
              placeholder="City, State"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-phone">Phone number</Label>
            <Input
              id="user-phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone}
              placeholder="+234 800 000 0000"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-address">Address</Label>
            <Input
              id="user-address"
              name="address"
              type="text"
              defaultValue={profile.address}
              placeholder="Street, area, or landmark"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="user-birthday">Birthday</Label>
            <Input
              id="user-birthday"
              name="birthday"
              type="date"
              defaultValue={profile.birthday}
            />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card variant="surface" className="gap-2">
        <div className="pb-3">
          <h2 className="font-serif text-lg font-bold">Notifications</h2>
          <p className="text-muted-foreground text-xs">
            Choose what updates and reminders you receive.
          </p>
        </div>

        <ul className="divide-line divide-y">
          {notificationOptions.map((option) => (
            <li
              key={option.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <Label htmlFor={option.id}>{option.label}</Label>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {option.description}
                </p>
              </div>
              <Switch
                id={option.id}
                name={option.id}
                defaultChecked={option.defaultChecked}
              />
            </li>
          ))}
        </ul>
      </Card>

      {/* Community Links */}
      <Card variant="surface" className="gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold">Join the community</h2>
          <p className="text-muted-foreground text-xs">
            Connect with members and stay up to date across our group channels.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {communityChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.id}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-line bg-background hover:border-primary/50 flex flex-col justify-between rounded-xl border p-4 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-navy text-accent inline-flex size-8 items-center justify-center rounded-lg">
                      <Icon size={16} />
                    </span>
                    <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-[10px] font-semibold">
                      {channel.badge}
                    </span>
                  </div>
                  <h3 className="group-hover:text-primary mt-3 text-sm font-bold transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                <div className="text-primary mt-4 inline-flex items-center gap-1 text-xs font-semibold">
                  <span>Join group</span>
                  <ArrowUpRightIcon
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </a>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" variant="red" size="lg">
          Save changes
        </Button>
      </div>
    </form>
  );
}

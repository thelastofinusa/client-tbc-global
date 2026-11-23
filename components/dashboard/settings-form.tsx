"use client";

import type * as React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import { Input } from "~/components/reusable/shadcn/input";
import { Label } from "~/components/reusable/shadcn/label";
import { Switch } from "~/components/reusable/shadcn/switch";
import { toast } from "~/components/reusable/shadcn/toast";
import { siteConfig } from "~/config/site.config";

const notificationOptions = [
  {
    id: "new-registration",
    label: "New registrations",
    description: "Email me when someone joins and needs approval.",
    defaultChecked: true,
  },
  {
    id: "new-sponsor",
    label: "New sponsors",
    description: "Email me when someone registers to sponsor a project.",
    defaultChecked: true,
  },
  {
    id: "new-partner",
    label: "New partnership requests",
    description: "Email me when an organisation applies to partner.",
    defaultChecked: true,
  },
  {
    id: "weekly-report",
    label: "Weekly attendance summary",
    description: "A short summary every Monday morning.",
    defaultChecked: false,
  },
];

export function SettingsForm() {
  // TODO: persist with a server action (requireSuperAdmin first).
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.add({ title: "Settings saved" });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Card variant="surface" className="gap-5">
        <div>
          <h2 className="font-serif text-lg font-bold">Church profile</h2>
          <p className="text-muted-foreground text-xs">
            Shown on the public website and in emails.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="church-name">Name</Label>
            <Input
              id="church-name"
              defaultValue={siteConfig.title}
              name="name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="church-location">Location</Label>
            <Input
              id="church-location"
              defaultValue="Kudenda, Kaduna"
              name="location"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="church-email">Contact email</Label>
            <Input
              id="church-email"
              type="email"
              name="email"
              placeholder="hello@yourchurch.org"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="church-whatsapp">WhatsApp community link</Label>
            <Input
              id="church-whatsapp"
              type="url"
              name="whatsapp"
              placeholder="https://chat.whatsapp.com/…"
            />
          </div>
        </div>
      </Card>

      <Card variant="surface" className="gap-2">
        <div className="pb-3">
          <h2 className="font-serif text-lg font-bold">Notifications</h2>
          <p className="text-muted-foreground text-xs">
            Choose what the super admin gets emailed about.
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

      <div className="flex justify-end">
        <Button type="submit" variant="red" size="lg">
          Save changes
        </Button>
      </div>
    </form>
  );
}

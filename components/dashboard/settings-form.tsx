"use client";

import {
  ArrowUpRightIcon,
  GlobeIcon,
  MessageCircleIcon,
  PlusIcon,
  SendIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/shadcn/dialog";
import { Input } from "~/components/reusable/shadcn/input";
import { Label } from "~/components/reusable/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "~/components/reusable/shadcn/native-select";
import { Textarea } from "~/components/reusable/shadcn/textarea";
import { toast } from "~/components/reusable/shadcn/toast";
import type { Community } from "~/db/schema";
import type { DashboardViewer } from "~/lib/dashboard/access";
import {
  addCommunity,
  deleteCommunity,
  updateUserProfile,
} from "~/lib/dashboard/actions";

function getCommunityIcon(iconName: string) {
  switch (iconName?.toLowerCase()) {
    case "telegram":
    case "send":
      return SendIcon;
    case "users":
    case "forum":
    case "members":
      return UsersIcon;
    case "globe":
    case "website":
      return GlobeIcon;
    case "whatsapp":
    case "message":
    default:
      return MessageCircleIcon;
  }
}

export function SettingsForm({
  viewer,
  initialCommunities = [],
}: {
  viewer: DashboardViewer;
  initialCommunities?: Community[];
}) {
  const isSuperAdmin = viewer.baseRole === "super_admin";

  // Profile Form state
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);

  // Communities state
  const [communities, setCommunities] =
    React.useState<Community[]>(initialCommunities);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAddingCommunity, setIsAddingCommunity] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Update profile handler
  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSavingProfile(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const birthday = String(formData.get("birthday") ?? "").trim();

    try {
      await updateUserProfile({
        name,
        location,
        phone,
        address,
        birthday,
      });
      toast.add({ title: "Profile details updated in database" });
    } catch (err) {
      toast.add({
        title: "Failed to update profile",
        description: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsSavingProfile(false);
    }
  }

  // Add community handler (super admin only)
  async function handleAddCommunity(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsAddingCommunity(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const href = String(formData.get("href") ?? "").trim();
    const icon = String(formData.get("icon") ?? "message").trim();
    const badge = String(formData.get("badge") ?? "Active").trim();

    if (!name || !href) {
      toast.add({ title: "Name and channel link are required" });
      setIsAddingCommunity(false);
      return;
    }

    try {
      await addCommunity({
        name,
        description,
        href,
        icon,
        badge,
      });

      // Add to local state
      setCommunities((prev) => [
        ...prev,
        {
          id: `comm_${Date.now()}`,
          name,
          description,
          href,
          icon,
          badge,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      setIsDialogOpen(false);
      toast.add({ title: "Community channel added successfully" });
    } catch (err) {
      toast.add({
        title: "Failed to add channel",
        description: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsAddingCommunity(false);
    }
  }

  // Delete community handler (super admin only)
  async function handleDeleteCommunity(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove "${name}"?`)) return;

    setDeletingId(id);
    try {
      await deleteCommunity(id);
      setCommunities((prev) => prev.filter((c) => c.id !== id));
      toast.add({ title: `Channel "${name}" removed` });
    } catch (err) {
      toast.add({
        title: "Failed to remove channel",
        description: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Personal Details Card */}
      <Card variant="surface" className="gap-6 p-6">
        <div>
          <h2 className="font-serif text-xl font-bold">Personal details</h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Update your profile information and contact details. Your email is
            tied to your sign-in account and cannot be modified here.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Full name</Label>
              <Input
                id="settings-name"
                name="name"
                defaultValue={viewer.fullName}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email address</Label>
              <Input
                id="settings-email"
                name="email"
                type="email"
                value={viewer.email}
                disabled
                readOnly
                aria-describedby="settings-email-help"
              />
              <p
                id="settings-email-help"
                className="text-muted-foreground text-xs"
              >
                Email is tied to your authenticated account.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-location">Location</Label>
              <Input
                id="settings-location"
                name="location"
                defaultValue={viewer.location}
                placeholder="e.g. Kudenda, Kaduna"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-phone">Phone number</Label>
              <Input
                id="settings-phone"
                name="phone"
                type="tel"
                defaultValue={viewer.phone}
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
                defaultValue={viewer.address}
                placeholder="Street address, area"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-birthday">Birthday</Label>
              <Input
                id="settings-birthday"
                name="birthday"
                type="date"
                defaultValue={viewer.birthday}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="red"
              disabled={isSavingProfile}
              isLoading={isSavingProfile}
              loadingTxt="Saving..."
            >
              Save changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Community Links Card */}
      <Card variant="surface" className="gap-6 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-xl font-bold">Join the community</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Connect with fellow church members and receive announcements
              across our official channels.
            </p>
          </div>

          {/* Super Admin Add Channel Action */}
          {isSuperAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <PlusIcon className="size-4" />
                    <span>Add Channel</span>
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Community Channel</DialogTitle>
                  <DialogDescription>
                    Add a group link or broadcast channel for church members to
                    connect.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleAddCommunity}
                  className="flex flex-col gap-4 py-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="comm-name">Channel Name</Label>
                    <Input
                      id="comm-name"
                      name="name"
                      placeholder="e.g. WhatsApp Community"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comm-href">Link / URL</Label>
                    <Input
                      id="comm-href"
                      name="href"
                      type="url"
                      placeholder="https://chat.whatsapp.com/..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comm-desc">Description</Label>
                    <Textarea
                      id="comm-desc"
                      name="description"
                      placeholder="Brief note about what this channel is used for"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="comm-icon">Platform Icon</Label>
                      <NativeSelect
                        id="comm-icon"
                        name="icon"
                        defaultValue="whatsapp"
                        className="w-full"
                      >
                        <NativeSelectOption value="whatsapp">
                          WhatsApp
                        </NativeSelectOption>
                        <NativeSelectOption value="telegram">
                          Telegram
                        </NativeSelectOption>
                        <NativeSelectOption value="users">
                          Member Forum
                        </NativeSelectOption>
                        <NativeSelectOption value="globe">
                          Website / Other
                        </NativeSelectOption>
                      </NativeSelect>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comm-badge">Badge Label</Label>
                      <Input
                        id="comm-badge"
                        name="badge"
                        placeholder="e.g. Active, Channel"
                        defaultValue="Active"
                      />
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <DialogClose
                      render={
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      }
                    />
                    <Button
                      type="submit"
                      variant="red"
                      disabled={isAddingCommunity}
                      isLoading={isAddingCommunity}
                      loadingTxt="Adding..."
                    >
                      Add Channel
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {communities.length === 0 ? (
          <div className="border-line border border-dashed p-8 text-center text-sm text-muted-foreground">
            No community channels configured yet.
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {communities.map((channel) => {
              const Icon = getCommunityIcon(channel.icon);
              const isDeleting = deletingId === channel.id;

              return (
                <li key={channel.id} className="group relative">
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border-line hover:border-primary group/card flex h-full flex-col gap-3 border p-4 transition-colors bg-card"
                  >
                    <div className="flex items-start justify-between">
                      <span className="bg-muted text-primary grid size-9 place-items-center">
                        <Icon className="size-4" />
                      </span>
                      <ArrowUpRightIcon className="text-muted-foreground group-hover/card:text-primary size-4 transition-colors" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{channel.name}</p>
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {channel.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        {channel.badge || "Active"}
                      </span>
                    </div>
                  </a>

                  {/* Super admin remove button */}
                  {isSuperAdmin && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isDeleting}
                      onClick={() =>
                        handleDeleteCommunity(channel.id, channel.name)
                      }
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 absolute top-3 right-3 size-7 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label={`Remove ${channel.name}`}
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

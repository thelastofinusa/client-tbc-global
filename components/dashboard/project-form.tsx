"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Input } from "~/components/reusable/shadcn/input";
import { Label } from "~/components/reusable/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/reusable/shadcn/select";
import { Textarea } from "~/components/reusable/shadcn/textarea";
import { toast } from "~/components/reusable/shadcn/toast";
import { useDashboardStore } from "~/lib/dashboard/store";
import type { Project } from "~/lib/dashboard/types";

const CATEGORIES = ["Building", "Education", "Outreach"] as const;
const STATUSES = ["active", "planning", "completed"] as const;

export function ProjectForm({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const projects = useDashboardStore((s) => s.projects);
  const addProject = useDashboardStore((s) => s.addProject);
  const updateProject = useDashboardStore((s) => s.updateProject);

  const initialData = projectId
    ? projects.find((p) => p.id === projectId)
    : undefined;
  const mode = projectId ? "edit" : "create";

  const [category, setCategory] = React.useState<Project["category"]>(
    initialData?.category ?? "Building",
  );
  const [status, setStatus] = React.useState<Project["status"]>(
    initialData?.status ?? "planning",
  );

  // Hydration safety when store rehydrates from localStorage.
  React.useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setStatus(initialData.status);
    }
  }, [initialData]);

  if (projectId && !initialData) {
    return (
      <div className="flex max-w-2xl flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Project not found. It may have been deleted.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/projects")}
        >
          Back to projects
        </Button>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;

    const payload = {
      name,
      category,
      description: String(data.get("description") ?? "").trim(),
      purpose: String(data.get("purpose") ?? "").trim() || undefined,
      participants: Number(data.get("participants") ?? 0) || undefined,
      progress: Math.min(
        100,
        Math.max(0, Number(data.get("progress") ?? 0) || 0),
      ),
      sponsors: Number(data.get("sponsors") ?? 0) || 0,
      status,
    };

    if (mode === "edit" && initialData) {
      updateProject(initialData.id, payload);
      toast.add({ title: "Project updated", description: name });
    } else {
      addProject(payload);
      toast.add({ title: "Project created", description: name });
    }

    router.push("/dashboard/projects");
  }

  return (
    <form
      key={initialData?.id ?? "new"}
      onSubmit={handleSubmit}
      className="flex max-w-2xl flex-col gap-5"
    >
      <div className="space-y-2">
        <Label htmlFor="project-name">Project name</Label>
        <Input
          id="project-name"
          name="name"
          defaultValue={initialData?.name ?? ""}
          placeholder="Project Mount Zion"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as Project["category"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as Project["status"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          name="description"
          defaultValue={initialData?.description ?? ""}
          placeholder="What is this project about?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-purpose">Purpose</Label>
        <Textarea
          id="project-purpose"
          name="purpose"
          defaultValue={initialData?.purpose ?? ""}
          placeholder="Why does this project exist?"
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="project-participants">Participants</Label>
          <Input
            id="project-participants"
            name="participants"
            type="number"
            min={0}
            defaultValue={initialData?.participants ?? 0}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-progress">Progress (%)</Label>
          <Input
            id="project-progress"
            name="progress"
            type="number"
            min={0}
            max={100}
            defaultValue={initialData?.progress ?? 0}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-sponsors">Sponsors</Label>
          <Input
            id="project-sponsors"
            name="sponsors"
            type="number"
            min={0}
            defaultValue={initialData?.sponsors ?? 0}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="red">
          {mode === "edit" ? "Save changes" : "Create project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

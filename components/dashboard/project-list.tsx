"use client";

import {
  HeartHandshakeIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
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
import { Badge } from "~/components/reusable/shadcn/badge";
import { Button } from "~/components/reusable/shadcn/button";
import { Card } from "~/components/reusable/shadcn/card";
import { Progress } from "~/components/reusable/shadcn/progress";
import { toast } from "~/components/reusable/shadcn/toast";
import { useDashboardStore } from "~/lib/dashboard/store";
import type { Project } from "~/lib/dashboard/types";

export function ProjectsList() {
  const projects = useDashboardStore((s) => s.projects);
  const removeProject = useDashboardStore((s) => s.removeProject);
  const [deleteTarget, setDeleteTarget] = React.useState<Project | null>(null);

  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No projects yet. Add your first project.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} variant="surface" className="gap-5">
            <div className="flex items-center justify-between">
              <Badge variant="tag">{p.category}</Badge>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 p-0"
                  nativeButton={false}
                  render={<Link href={`/dashboard/projects/${p.id}/edit`} />}
                  aria-label={`Edit ${p.name}`}
                >
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 p-0"
                  onClick={() => setDeleteTarget(p)}
                  aria-label={`Delete ${p.name}`}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl font-extrabold tracking-[-0.03em]">
                {p.name}
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {p.description}
              </p>
              {p.purpose && (
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  <strong className="text-foreground">Purpose:</strong>{" "}
                  {p.purpose}
                </p>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <span className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
                  Progress
                </span>
                <strong className="font-serif text-2xl leading-none tabular-nums">
                  {p.progress}%
                </strong>
              </div>
              <Progress value={p.progress} variant="project" />
              <p className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <HeartHandshakeIcon className="size-3.5" aria-hidden="true" />
                  {p.sponsors} sponsors
                </span>
                {typeof p.participants === "number" && (
                  <span className="flex items-center gap-1.5">
                    <UsersIcon className="size-3.5" aria-hidden="true" />
                    {p.participants} participants
                  </span>
                )}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  removeProject(deleteTarget.id);
                  toast.add({
                    title: "Project deleted",
                    description: deleteTarget.name,
                  });
                  setDeleteTarget(null);
                }
              }}
            >
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { RotateCcwIcon } from "lucide-react";
import * as React from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { resetSampleData } from "~/lib/dashboard/actions";

export function ResetSampleDataButton() {
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await resetSampleData();
          window.location.reload();
        })
      }
    >
      <RotateCcwIcon />
      Reset sample data
    </Button>
  );
}

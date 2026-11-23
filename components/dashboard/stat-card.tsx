import type { LucideIcon } from "lucide-react";
import { Card } from "~/components/reusable/shadcn/card";
import { cn } from "~/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <Card variant="metric" className={cn(highlight && "border-primary")}>
      <div className="flex items-start justify-between">
        <span className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
          {label}
        </span>
        <Icon
          className={cn(
            "size-4",
            highlight ? "text-primary" : "text-muted-foreground",
          )}
          aria-hidden="true"
        />
      </div>
      <strong className="mt-4 block font-serif text-3xl leading-none font-extrabold tracking-[-0.05em] tabular-nums">
        {value}
      </strong>
      {hint && <p className="text-muted-foreground mt-2 text-xs">{hint}</p>}
    </Card>
  );
}

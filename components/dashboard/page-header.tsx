import type { ReactNode } from "react";
import { Eyebrow } from "~/components/shared/eyebrow";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 pb-6 sm:flex-row sm:items-end">
      <div>
        <Eyebrow lineClass="bg-primary" label={eyebrow} />
        <h1 className="mt-3 font-serif text-2xl font-extrabold tracking-tighter sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1.5 max-w-xl text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

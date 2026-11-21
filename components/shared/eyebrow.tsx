import { cn } from "cn";
import type React from "react";

export const Eyebrow: React.FC<{
  label: string;
  line?: boolean;
  className?: string;
  lineClass?: string;
}> = ({ label, line = true, className, lineClass }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {line && <span className={cn("bg-accent h-px w-7", lineClass)} />}
      <p className="font-serif text-[9px] font-semibold tracking-[0.16em] uppercase">
        <span>{label}</span>
      </p>
    </div>
  );
};

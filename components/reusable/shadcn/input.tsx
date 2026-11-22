import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

const inputVariants = cva(
  "file:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 w-full min-w-0 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3",
  {
    variants: {
      variant: {
        default:
          "border-input placeholder:text-muted-foreground disabled:bg-input/50 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-12 rounded-lg border bg-transparent px-3 py-1 text-sm",
        form: "border-chart-5 bg-primary-foreground h-[43px] rounded-[2px] border px-3 text-[11px] text-[#2a2522] placeholder:text-[#aaa198]",
        profile:
          "border-line h-10 rounded-none border bg-[#fbfaf7] px-2.5 text-[11px] text-[#2a2522]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Input({
  className,
  type,
  variant = "default",
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-variant={variant}
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };

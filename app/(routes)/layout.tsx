import { Analytics } from "@vercel/analytics/react";
import NextJsToploader from "nextjs-toploader";
import { LenisSmoothScroll } from "~/components/providers/lenis";
import { ThemeProvider } from "~/components/providers/theme";
import { Toaster } from "~/components/reusable/shadcn/toast";
import { TooltipProvider } from "~/components/reusable/shadcn/tooltip";

export default function RoutesLayout(props: Readonly<LayoutProps<"/">>) {
  return (
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        {props.children}

        <Toaster />
        <LenisSmoothScroll />
        <NextJsToploader color="var(--primary)" showSpinner={false} />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </TooltipProvider>
    </ThemeProvider>
  );
}

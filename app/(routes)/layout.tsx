import { Analytics } from "@vercel/analytics/react";
import NextJsToploader from "nextjs-toploader";
import React from "react";
import { LenisSmoothScroll } from "~/components/providers/lenis";
import { ThemeProvider } from "~/components/providers/theme";
import { ToggleProvider } from "~/components/providers/toggle";
import { Toaster } from "~/components/reusable/shadcn/toast";
import { TooltipProvider } from "~/components/reusable/shadcn/tooltip";

export default function RoutesLayout(props: Readonly<LayoutProps<"/">>) {
  return (
    <ThemeProvider defaultTheme="system">
      <ToggleProvider>
        <TooltipProvider>
          {props.children}

          <Toaster />
          <NextJsToploader color="var(--primary)" showSpinner={false} />
          {process.env.NODE_ENV === "production" && (
            <React.Fragment>
              <LenisSmoothScroll />
              <Analytics />
            </React.Fragment>
          )}
        </TooltipProvider>
      </ToggleProvider>
    </ThemeProvider>
  );
}

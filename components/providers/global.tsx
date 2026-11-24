"use client";

import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";
import NextJsToploader from "nextjs-toploader";
import React from "react";
import { Toaster } from "../reusable/shadcn/toast";
import { TooltipProvider } from "../reusable/shadcn/tooltip";
import { ThemeProvider } from "./theme";
import { ToggleProvider } from "./toggle";

const LenisSmoothScroll = dynamic(
  () => import("./lenis").then((mod) => mod.LenisSmoothScroll),
  { ssr: false, loading: () => null },
);

export const GlobalProvider: React.FC<React.PropsWithChildren> = (props) => {
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
};

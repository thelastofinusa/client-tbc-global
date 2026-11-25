import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { NextStudio } from "next-sanity/studio";
import { Suspense } from "react";
import config from "~/sanity.config";

export const metadata: Metadata = {
  title: "Content Studio",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

async function DynamicStudioGate() {
  await connection();
  return <NextStudio config={config} />;
}

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <DynamicStudioGate />
    </Suspense>
  );
}

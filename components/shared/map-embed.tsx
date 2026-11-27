"use client";

import * as React from "react";
import { RiMapPinRangeLine } from "react-icons/ri";
import { siteConfig } from "~/config/site.config";

/**
 * Google Maps is heavy, so it only loads when someone asks for it. Without
 * this, every page on the site downloads the map even if nobody looks at it.
 */
export function MapEmbed({ className }: { className?: string }) {
  const [loaded, setLoaded] = React.useState(false);

  if (loaded) {
    return (
      <iframe
        title={`${siteConfig.title} location on Google Maps`}
        src={siteConfig.map.embed}
        referrerPolicy="strict-origin-when-cross-origin"
        className={className ?? "size-full border-none"}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="grid size-full cursor-pointer place-items-center gap-2 bg-white/5 text-center text-sm text-white/80 transition-colors hover:bg-white/10"
    >
      <p className="flex flex-col items-center gap-2">
        <RiMapPinRangeLine size={22} />
        <span>Show the map</span>
      </p>
    </button>
  );
}

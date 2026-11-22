"use client";

import { cn } from "cn";
import { Image } from "keltra/image/next";
import type { Route } from "next";
import Link from "next/link";
import type React from "react";
import { siteConfig } from "~/config/site.config";
import { type ToggleId, useToggle } from "../providers/toggle";

export const LogoComponent: React.FC<{
  className?: string;
  path?: Route;
  toggleId?: ToggleId;
  imgSize?: number;
}> = ({ path = "/", className, toggleId = "menu", imgSize = 36 }) => {
  const { close } = useToggle(toggleId);
  const prefix = siteConfig.title.replace(/\s*Global Ministries$/i, "").trim();
  const suffix = siteConfig.title.endsWith("Global Ministries")
    ? "Global Ministries"
    : "";

  return (
    <Link
      href={path}
      onClick={close}
      className={cn(
        "flex items-center gap-2 sm:gap-3 font-serif text-[13px] sm:text-sm",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt={siteConfig.title}
        width={imgSize}
        height={imgSize}
        preload
        className="object-contain"
        style={{
          width: `${imgSize}px`,
          height: `${imgSize}px`,
        }}
      />
      <p className="flex flex-col font-serif leading-4 font-semibold">
        {suffix ? (
          <>
            <span className="origin-left scale-[80%]">{prefix}</span>
            <span>{suffix}</span>
          </>
        ) : (
          <span>{siteConfig.title}</span>
        )}
      </p>
    </Link>
  );
};

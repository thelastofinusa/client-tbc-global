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
}> = ({ path = "/", className, toggleId = "menu" }) => {
  const { close } = useToggle(toggleId);
  const prefix = siteConfig.title.replace(/\s*Global Ministries$/i, "").trim();
  const suffix = siteConfig.title.endsWith("Global Ministries")
    ? "Global Ministries"
    : "";

  return (
    <Link
      href={path}
      onClick={close}
      className={cn("flex items-center gap-3 font-serif", className)}
    >
      <Image
        src="/logo.png"
        alt={siteConfig.title}
        width={32}
        height={32}
        preload
        className="size-8"
      />
      <p className="flex flex-col font-serif text-sm leading-4 font-semibold">
        {suffix ? (
          <>
            <span className="text-[11px]">{prefix}</span>
            <span>{suffix}</span>
          </>
        ) : (
          <span>{siteConfig.title}</span>
        )}
      </p>
    </Link>
  );
};

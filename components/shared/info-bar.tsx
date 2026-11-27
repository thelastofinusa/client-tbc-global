"use client";

import { ArrowUpRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { GoFlame } from "react-icons/go";
import { RiMapPinRangeLine } from "react-icons/ri";
import { useSchedule } from "~/components/providers/schedule";
import { Container } from "~/components/shared/container";
import { siteConfig } from "~/config/site.config";

/** Slim bar above the header (desktop only). Everything comes from Sanity. */
export function InfoBar() {
  const { next, days, announcement } = useSchedule();

  if (!announcement && !next) return null;

  return (
    <div className="bg-navy hidden text-white lg:block">
      <Container>
        <div className="flex h-10 items-center justify-between text-xs">
          {announcement ? (
            <p className="flex items-center gap-3 text-white/90">
              <GoFlame size={14} className="text-accent" />
              <strong className="font-semibold text-white">
                {announcement.message}
              </strong>
              {announcement.href && (
                <Link
                  href={announcement.href as Route}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {announcement.linkLabel || "Learn more"}
                </Link>
              )}
            </p>
          ) : (
            next && (
              <Link
                href="/services"
                className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
              >
                <GoFlame size={14} className="text-accent" />
                <span>
                  Next gathering:{" "}
                  <strong className="font-semibold text-white">
                    {next.name} · {next.time}
                  </strong>
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <RiMapPinRangeLine size={13} />
                  {next.location}
                </span>
              </Link>
            )
          )}

          <div className="flex items-center gap-4 text-white/80">
            {days.length > 0 && (
              <>
                <span className="text-[9px] tracking-[0.14em] uppercase">
                  {days.join(" · ")}
                </span>
                <span className="h-3 w-px bg-white/20" />
              </>
            )}
            <a
              href={siteConfig.map.direction}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              Get directions
              <ArrowUpRightIcon size={13} />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}

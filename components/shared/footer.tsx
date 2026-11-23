"use client";

import { Show } from "@clerk/nextjs";
import { ArrowUpRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import React, { Suspense } from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { siteConfig } from "~/config/site.config";
import { type NavItemType, navItems } from "~/lib/constants";
import { Eyebrow } from "./eyebrow";
import { LogoComponent } from "./logo";

type FooterLinkItem = Omit<NavItemType, "path" | "label"> & {
  label: string;
  href: Route;
};

type FooterSection = {
  title: string;
  items: FooterLinkItem[];
  showArrow?: boolean;
};

const communityLabels: Partial<Record<NavItemType["path"], string>> = {
  "/sign-up": "Join the Family",
  "/sign-in": "Member Login",
};

const communityOrder: NavItemType["path"][] = ["/sign-up", "/sign-in"];

const footerSections: FooterSection[] = [
  {
    title: "Explore",
    items: navItems
      .filter((item) => (item.kind ?? "nav") === "nav")
      .map(({ path, label, mobileLabel, kind }) => ({
        href: path,
        label,
        mobileLabel,
        kind,
      })),
  },
  {
    title: "Community",
    items: navItems
      .filter((item) => item.kind === "login" || item.kind === "join")
      .sort(
        (a, b) =>
          communityOrder.indexOf(a.path) - communityOrder.indexOf(b.path),
      )
      .map(({ path, label, mobileLabel, kind }) => ({
        href: path,
        label: communityLabels[path] ?? label,
        mobileLabel,
        kind,
      })),
    showArrow: true,
  },
];

const gatheringDays = ["Wed", "Sat", "Sun"];

export const Footer = () => {
  const [year, setYear] = React.useState<number>(2026);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-navy relative overflow-hidden text-white">
      <Container className="pt-14 pb-8 md:pt-20 md:pb-10">
        {/* 1. Big invitation */}
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end md:pb-14">
          <div>
            <Eyebrow
              label="Your story has a place here"
              className="text-accent"
            />
            <h2 className="mt-5 font-serif text-4xl leading-[1.02] font-extrabold tracking-[-0.06em] md:text-6xl">
              Come as you are.
              <br />
              <span className="text-accent">Leave on fire.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="cream"
              size="lg"
              nativeButton={false}
              render={<Link href="/services" />}
              className="flex-1 sm:flex-none"
            >
              <span>Plan your visit</span>
              <ArrowUpRightIcon size={16} />
            </Button>
            <Button
              variant="glass"
              size="lg"
              nativeButton={false}
              render={<Link href="/sign-up" />}
            >
              <span>Join the family</span>
            </Button>
          </div>
        </div>

        {/* 2. Brand, links, map */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:py-14 lg:grid-cols-12 lg:gap-x-8">
          <div className="col-span-2 flex flex-col gap-5 lg:col-span-4">
            <LogoComponent path="/" className="inline-flex" />
            <p className="text-secondary/80 max-w-sm text-sm leading-[1.75]">
              {siteConfig.about}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {gatheringDays.map((day) => (
                <span
                  key={day}
                  className="border border-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white/80 uppercase"
                >
                  {day}
                </span>
              ))}
              <span className="text-xs text-white/50">every week</span>
            </div>
          </div>

          {footerSections.map((section) => (
            <div
              key={section.title}
              className="flex flex-col gap-4 lg:col-span-2"
            >
              <Eyebrow label={section.title} className="text-accent" />

              <ul className="flex flex-col gap-2.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 text-[13px] text-white/75 transition-colors hover:text-white sm:text-sm"
                    >
                      {item.mobileLabel ? (
                        <>
                          <span className="sm:hidden">{item.mobileLabel}</span>
                          <span className="hidden sm:inline">{item.label}</span>
                        </>
                      ) : (
                        <span>{item.label}</span>
                      )}
                      {section.showArrow && (
                        <ArrowUpRightIcon size={13} className="text-white/50" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 flex flex-col gap-4 lg:col-span-4">
            <Eyebrow label="Where to find us" className="text-accent" />

            <div className="aspect-2/1 overflow-hidden border border-white/10">
              <iframe
                title={`${siteConfig.title} location on Google Maps`}
                src={siteConfig.map.embed}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="size-full border-none grayscale transition-[filter] duration-300 hover:grayscale-0"
              />
            </div>

            <a
              href={siteConfig.map.direction}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-max items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <span>Kudenda, Kaduna · Get directions</span>
              <ArrowUpRightIcon size={14} />
            </a>
          </div>
        </div>

        {/* 4. Bottom bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="text-secondary/65 flex flex-col justify-between gap-3 text-xs sm:flex-row sm:items-center">
            <p className="flex flex-col gap-1">
              <span>
                © {year} {siteConfig.title}
              </span>
              <span className="text-white">
                All Rights Reserved - Designed and Developed by{" "}
                <a
                  target="_blank"
                  href="http://thelastofinusa.vercel.app"
                  rel="noopener"
                  className="underline"
                >
                  Osilama
                </a>
              </span>
            </p>

            <div className="flex items-center gap-5">
              <Suspense>
                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    className="transition-colors hover:text-white"
                  >
                    Member Sign In
                  </Link>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/dashboard"
                    className="transition-colors hover:text-white"
                  >
                    Member Portal
                  </Link>
                </Show>
              </Suspense>
              <span className="h-3 w-px bg-white/15" />
              <Link
                href="/services"
                className="transition-colors hover:text-white"
              >
                Plan a Visit
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

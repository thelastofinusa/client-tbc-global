"use client";

import { ArrowUpRightIcon, MapPinIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { siteConfig } from "~/config/site.config";
import { type NavItemType, navItems } from "~/lib/constants";
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
  "/join": "Join the Family",
  "/login": "Member Login",
};

const communityOrder: NavItemType["path"][] = ["/join", "/login"];

const footerSections: FooterSection[] = [
  {
    title: "EXPLORE",
    items: navItems
      .filter((item) => (item.kind ?? "nav") === "nav")
      .map(({ path, label, mobileLabel, kind, badge }) => ({
        href: path,
        label,
        mobileLabel,
        kind,
        badge,
      })),
  },
  {
    title: "COMMUNITY",
    items: navItems
      .filter((item) => item.kind === "login" || item.kind === "join")
      .sort(
        (a, b) =>
          communityOrder.indexOf(a.path) - communityOrder.indexOf(b.path),
      )
      .map(({ path, label, mobileLabel, kind, badge }) => ({
        href: path,
        label: communityLabels[path] ?? label,
        mobileLabel,
        kind,
        badge,
      })),
    showArrow: true,
  },
];

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#29221e] text-white">
      <Container className="pt-14 pb-8 md:pt-16 md:pb-10">
        {/* Top row: Brand identity + Gathering callout */}
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end">
          <div className="max-w-md">
            <LogoComponent path="/" className="inline-flex" />

            <p className="mt-4 text-xs leading-relaxed text-white/75 sm:text-sm">
              Raising a generation burning with purpose—where young people
              discover their gifts, families find hope, and faith turns into
              everyday action.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="cream"
              size="lg"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              <span>Sunday Service · 9:00 AM</span>
              <ArrowUpRightIcon size={16} />
            </Button>
            <Button
              variant="glass"
              size="lg"
              nativeButton={false}
              render={<Link href="/join" />}
            >
              <span>Join the family</span>
            </Button>
          </div>
        </div>

        {/* Middle row: Navigation & Gathering details */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="text-accent block font-serif text-[10px] font-bold tracking-[0.18em] uppercase">
              WHERE TO FIND US
            </span>
            <div className="mt-3 flex items-start gap-2.5 text-xs leading-relaxed text-white/80">
              <MapPinIcon className="text-accent mt-0.5 size-4 shrink-0" />
              <div>
                <strong className="block font-serif text-sm font-semibold text-white">
                  Kudende, Kaduna
                </strong>
                <span className="mt-1 block text-white/70">
                  Everyone is welcome. Bring your questions, bring your whole
                  self.
                </span>
              </div>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-4">
              <span className="text-accent block font-serif text-[10px] font-bold tracking-[0.18em] uppercase">
                {section.title}
              </span>
              <ul className="mt-3.5 space-y-2.5 text-xs">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                    >
                      {item.mobileLabel ? (
                        <>
                          <span className="sm:hidden">{item.mobileLabel}</span>
                          <span className="hidden sm:inline">{item.label}</span>
                        </>
                      ) : (
                        <span>{item.label}</span>
                      )}
                      {item.badge && (
                        <span className="bg-accent/15 text-accent px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase">
                          {item.badge}
                        </span>
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
        </div>

        {/* Bottom bar: Copyright & local anchor */}
        <div className="flex flex-col justify-between gap-3 pt-6 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>&copy; 2026 {siteConfig.title}. All rights reserved.</p>
          <p className="font-serif text-[11px] tracking-[0.12em] text-white/75 uppercase">
            Love God · Serve People · Transform Our Community
          </p>
        </div>
      </Container>
    </footer>
  );
};

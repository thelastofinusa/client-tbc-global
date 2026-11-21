"use client";

import { ArrowUpRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
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

            {/* <p className="mt-4 text-xs leading-relaxed text-white/75 sm:text-sm"> */}
            <p className="text-secondary mt-4 text-sm leading-[1.75]">
              {siteConfig.about}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="cream"
              size="lg"
              nativeButton={false}
              render={<Link href="/services" />}
              className="flex-1 sm:flex-none"
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
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 py-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-4 md:col-span-2">
            <Eyebrow label="Where to find us" className="text-accent" />

            <div className="flex flex-col gap-2 sm:max-w-sm">
              <div className="bg-muted/50 aspect-[1.3] sm:aspect-video">
                <iframe
                  title={`${siteConfig.title} location on Google Maps`}
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d773.2637856498449!2d7.368035125773172!3d10.478444737176677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDI4JzQyLjIiTiA3wrAyMicwNi41IkU!5e1!3m2!1sen!2sng!4v1795293027987!5m2!1sen!2sng"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="size-full border-none"
                />
              </div>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <Eyebrow label={section.title} className="text-accent" />

              <ul className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 text-[13px] text-white/80 transition-colors hover:text-white sm:text-sm"
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
        <div className="flex flex-col justify-between gap-3 pt-6 text-[13px] sm:flex-row sm:items-center">
          <p className="flex flex-col gap-1">
            <span className="text-white/60">
              &copy; 2026 {siteConfig.title}.
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
          <p className="font-serif text-[11px] tracking-[0.12em] text-white/75 uppercase">
            Love God · Serve People · Transform Our Community
          </p>
        </div>
      </Container>
    </footer>
  );
};

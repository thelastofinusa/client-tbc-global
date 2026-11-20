"use client";

import { ArrowRight, Flame } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, isActivePath } from "~/lib/utils";
import { Button } from "../reusable/shadcn/button";
import { containerVariants } from "./container";

const navItems: { label: string; path: Route }[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Project", path: "/projects" },
  { label: "Services & Visit", path: "/services" },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-background sticky top-0 left-0 z-50 flex h-20 w-full items-center justify-between border-b">
      <nav
        className={containerVariants({
          className: "flex size-full items-center justify-between",
        })}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          aria-label="Burning Church home"
          className="flex items-center gap-2"
        >
          <span className="bg-red grid size-9 place-items-center rounded-full text-white max-md:size-8">
            <Flame size={21} fill="currentColor" />
          </span>

          <div className="flex flex-col uppercase">
            <p className="text-[11px] font-semibold tracking-[0.08em]">
              <span>The Burning Church</span>
            </p>
            <p className="text-sm font-semibold tracking-[0.08em]">
              <span>GLOBAL MINISTRIES</span>
            </p>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          {navItems.map((item) => {
            const isActive = isActivePath(item.path, pathname);
            const Comp = isActive ? "div" : Link;

            return (
              <Button
                key={item.path}
                nativeButton={false}
                variant="ghost"
                className={cn(isActive && "text-red hover:text-red/80")}
                render={<Comp href={item.path} />}
              >
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="dark" size="hero">
            <span>Join the family</span>
            <ArrowRight />
          </Button>
          <Button variant="ghost" size="hero">
            <span>Log In</span>
          </Button>
        </div>
      </nav>
    </header>
  );
};

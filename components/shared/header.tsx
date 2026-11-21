"use client";

import { ArrowRightIcon, ChevronRightIcon, FlameIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoClose, IoMenuSharp } from "react-icons/io5";
import { cn, isActivePath } from "~/lib/utils";
import { useToggle } from "../providers/toggle";
import { Button } from "../reusable/shadcn/button";
import { Separator } from "../reusable/shadcn/separator";
import { Container } from "./container";

type NavItemType = {
  label: string;
  path: Route;
  kind?: "nav" | "login" | "join";
};

const navItems: NavItemType[] = [
  { label: "Home", path: "/", kind: "nav" },
  { label: "About", path: "/about", kind: "nav" },
  { label: "Project", path: "/projects", kind: "nav" },
  { label: "Services & Visit", path: "/services", kind: "nav" },
  { label: "Partner", path: "/partner", kind: "nav" },
  { label: "Login", path: "/login", kind: "login" },
  { label: "Join the family", path: "/join", kind: "join" },
];

const mainNavItems = navItems.filter((item) => item.kind === "nav");
const loginItem = navItems.find((item) => item.kind === "login");
const joinItem = navItems.find((item) => item.kind === "join");

export const Header = () => {
  const pathname = usePathname();
  const { toggle, isOpen } = useToggle("menu");

  return (
    <header className="bg-background sticky top-0 left-0 z-50 h-19 w-full border-b">
      <Container className="size-full">
        <nav className="flex size-full items-center justify-between">
          <div className="flex items-center justify-start gap-2 md:w-60">
            <Link href="/" className="flex items-center gap-2 font-serif">
              <div className="bg-red grid size-9 place-items-center rounded-full text-white">
                <FlameIcon fill="currentColor" className="size-4.5" />
              </div>
              <p className="flex flex-col font-serif text-sm leading-4 font-semibold">
                <span className="text-[11px]">The Burning Church</span>
                <span>Global Ministries</span>
              </p>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            {mainNavItems.map((item) => {
              const isActive = isActivePath(item.path, pathname);

              return (
                <Button
                  key={item.path}
                  size="sm"
                  variant="ghost"
                  className={cn(isActive && "text-red hover:text-red/80")}
                  nativeButton={false}
                  render={<Link href={item.path} />}
                >
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 sm:w-60">
            <Button
              variant="dark"
              nativeButton={false}
              render={<Link href="/join" />}
              className="hidden md:inline-flex"
            >
              <span>Join the Family</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/login" />}
              className="hidden md:inline-flex"
            >
              <span>Log In</span>
            </Button>
            <Separator
              orientation="vertical"
              className="my-auto ml-2 hidden h-4! md:block lg:hidden"
            />
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={toggle}
              aria-label="Toggle menu"
            >
              {isOpen ? <IoClose /> : <IoMenuSharp />}
              <span className="sr-only">
                {isOpen ? "Close Menu" : "Open Menu"}
              </span>
            </Button>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.nav
              key="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-background fixed top-19 right-0 left-0 z-50 flex flex-col gap-1 border-b px-5 py-3 shadow-[0_40px_40px_#17100d33] sm:px-8 md:px-10"
            >
              {mainNavItems.map((item) => {
                const isActive = isActivePath(item.path, pathname);

                return (
                  <Button
                    size="lg"
                    variant={isActive ? "secondary" : "ghost"}
                    key={item.path}
                    nativeButton={false}
                    render={<Link href={item.path} />}
                    className="text-ink justify-between text-left"
                    onClick={toggle}
                  >
                    <span>{item.label}</span>
                    <ArrowRightIcon size={16} />
                  </Button>
                );
              })}

              {/* Differentiated Login & Join actions for mobile */}
              <div className="mt-3 flex flex-col gap-2 border-t pt-4 md:hidden">
                {loginItem && (
                  <Button
                    size="lg"
                    variant={
                      isActivePath(loginItem.path, pathname)
                        ? "secondary"
                        : "outline"
                    }
                    nativeButton={false}
                    render={<Link href={loginItem.path} />}
                    className="text-ink w-full justify-between"
                    onClick={toggle}
                  >
                    <span>{loginItem.label}</span>
                    <span className="text-muted-foreground text-xs font-normal">
                      Member account
                    </span>
                  </Button>
                )}

                {joinItem && (
                  <Button
                    size="lg"
                    variant="dark"
                    nativeButton={false}
                    render={<Link href={joinItem.path} />}
                    className="w-full justify-between"
                    onClick={toggle}
                  >
                    <span>{joinItem.label}</span>
                    <ChevronRightIcon size={16} />
                  </Button>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

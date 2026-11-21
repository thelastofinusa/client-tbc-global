"use client";

import { ArrowRightIcon, ChevronRightIcon, FlameIcon } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
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

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const drawerVariants: Variants = {
  closed: {
    opacity: 0,
    y: -14,
    transition: {
      duration: 0.18,
      ease: easeOutExpo,
      when: "afterChildren",
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: easeOutExpo,
      when: "beforeChildren",
      staggerChildren: 0.035,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: -6 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: easeOutExpo },
  },
};

export const Header = () => {
  const pathname = usePathname();
  const { toggle, isOpen } = useToggle("menu");

  return (
    <header className="bg-background md:bg-background/90 sticky top-0 left-0 z-50 h-19 w-full transition-colors md:h-24 md:backdrop-blur-lg">
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
              className="relative overflow-hidden lg:hidden"
              onClick={toggle}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  transition={{ duration: 0.14, ease: easeOutExpo }}
                  className="grid place-items-center"
                >
                  {isOpen ? <IoClose /> : <IoMenuSharp />}
                </motion.span>
              </AnimatePresence>
              <span className="sr-only">
                {isOpen ? "Close Menu" : "Open Menu"}
              </span>
            </Button>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop overlay below the header */}
              <motion.div
                key="mobile-nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={toggle}
                aria-hidden="true"
                className="fixed inset-x-0 top-19 bottom-0 z-40 bg-black/35 backdrop-blur-[2px] md:top-24 lg:hidden"
              />

              {/* Sliding drawer */}
              <motion.nav
                key="mobile-nav"
                variants={drawerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="bg-background fixed inset-x-0 top-19 z-50 flex flex-col gap-1 border-b p-5 shadow-[0_24px_48px_-12px_rgba(23,16,13,0.28)] sm:px-8 md:top-24 md:px-10 lg:hidden"
              >
                {mainNavItems.map((item) => {
                  const isActive = isActivePath(item.path, pathname);

                  return (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Button
                        size="lg"
                        variant={isActive ? "secondary" : "ghost"}
                        nativeButton={false}
                        render={<Link href={item.path} />}
                        className="text-ink group w-full justify-between text-left"
                        onClick={toggle}
                      >
                        <span>{item.label}</span>
                        <ArrowRightIcon
                          size={16}
                          className="transition-transform duration-150 group-hover:translate-x-0.5"
                        />
                      </Button>
                    </motion.div>
                  );
                })}

                {/* Differentiated Login & Join actions for mobile */}
                <motion.div
                  variants={itemVariants}
                  className="mt-3 flex flex-col gap-2 border-t pt-4 md:hidden"
                >
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
                </motion.div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

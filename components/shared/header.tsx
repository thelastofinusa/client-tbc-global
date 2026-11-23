"use client";

import { Show } from "@clerk/nextjs";
import { ArrowUpRightIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { GoFlame } from "react-icons/go";
import { IoClose, IoMenuSharp } from "react-icons/io5";
import { RiMapPinRangeLine } from "react-icons/ri";
import { siteConfig } from "~/config/site.config";
import { navItems } from "~/lib/constants";
import { cn, isActivePath } from "~/lib/utils";
import { useToggle } from "../providers/toggle";
import { IconSwap, IconSwapItem } from "../reusable/chanhdai/icon-swap";
import { Button } from "../reusable/shadcn/button";
import { Container } from "./container";
import { Eyebrow } from "./eyebrow";
import { LogoComponent } from "./logo";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const sheetVariants: Variants = {
  closed: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.18, ease: easeOutExpo, when: "afterChildren" },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: easeOutExpo,
      when: "beforeChildren",
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: -8 },
  open: { opacity: 1, y: 0, transition: { duration: 0.22, ease: easeOutExpo } },
};

const links = navItems.filter((item) => (item.kind ?? "nav") === "nav");

export const Header = () => {
  const pathname = usePathname();
  const { toggle, isOpen, close } = useToggle("menu");

  return (
    <>
      {/* Desktop only: slim info bar (scrolls away; the header below sticks) */}
      <div className="bg-navy hidden text-white lg:block">
        <Container>
          <div className="flex h-10 items-center justify-between text-xs">
            <Link
              href="/services"
              className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
            >
              <GoFlame size={14} className="text-accent" />
              <span>
                Next gathering:{" "}
                <strong className="font-semibold text-white">
                  Sunday service · 9:00 AM
                </strong>
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span className="flex items-center gap-1.5">
                <RiMapPinRangeLine size={13} />
                Kudenda, Kaduna
              </span>
            </Link>

            <div className="flex items-center gap-4 text-white/80">
              <span className="font-serif text-[9px] tracking-[0.14em] uppercase">
                Wed · Sat · Sun
              </span>
              <span className="h-3 w-px bg-white/20" />
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

      <header
        className={cn(
          "bg-background md:bg-background/85 border-line sticky top-0 left-0 z-50 h-18 w-full border-b backdrop-blur-md transition-colors md:h-18",
          isOpen && "bg-background border-b-transparent",
        )}
      >
        <Container className="size-full">
          <div className="flex size-full items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex shrink-0 items-center justify-start xl:w-72">
              <LogoComponent path="/" />
            </div>

            {/* Desktop nav: full-height links with a sliding underline */}
            <nav
              aria-label="Primary"
              className="hidden h-full flex-1 items-stretch justify-center lg:flex"
            >
              {links.map((item) => {
                const isActive = isActivePath(item.path, pathname);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={close}
                    className={cn(
                      "relative flex items-center gap-2 px-3 text-xs font-semibold transition-colors xl:px-5",
                      "after:bg-foreground/20 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform hover:after:scale-x-100 xl:after:inset-x-5",
                      isActive
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground",
                    )}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                        className="bg-primary absolute inset-x-3 bottom-0 z-10 h-0.5 xl:inset-x-5"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 lg:shrink-0 xl:w-72">
              <Suspense>
                <Show when="signed-out">
                  {/* Tablet (unchanged) */}
                  <Button
                    variant="ghost"
                    nativeButton={false}
                    render={<Link href="/sign-in" />}
                    className="hidden rounded-full md:inline-flex lg:hidden"
                  >
                    <span>Log In</span>
                  </Button>
                  <Button
                    variant="red"
                    nativeButton={false}
                    render={<Link href="/sign-up" />}
                    className="hidden rounded-full md:inline-flex lg:hidden"
                  >
                    <span>Join the Family</span>
                    <ChevronRightIcon />
                  </Button>

                  {/* Desktop (new) */}
                  <div className="hidden items-center gap-2 lg:flex">
                    <Button
                      variant="ghost"
                      nativeButton={false}
                      render={<Link href="/sign-in" />}
                    >
                      <span>Log In</span>
                    </Button>
                    <Button
                      variant="red"
                      nativeButton={false}
                      render={<Link href="/sign-up" />}
                    >
                      <span>Join the Family</span>
                      <ChevronRightIcon size={16} />
                    </Button>
                  </div>
                </Show>
                <Show when="signed-in">
                  <Button
                    variant="dark"
                    nativeButton={false}
                    render={<Link href="/dashboard" />}
                    className="rounded-full lg:rounded-md"
                  >
                    Dashboard
                  </Button>
                </Show>
              </Suspense>

              <Button
                variant={isOpen ? "manual" : "outline"}
                size="icon"
                className="relative overflow-hidden rounded-full lg:hidden"
                onClick={toggle}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <IconSwap>
                  <IconSwapItem key={isOpen ? "close" : "open"}>
                    {isOpen ? (
                      <IoClose aria-hidden="true" />
                    ) : (
                      <IoMenuSharp aria-hidden="true" />
                    )}
                  </IconSwapItem>
                </IconSwap>
                <span className="sr-only">
                  {isOpen ? "Close Menu" : "Open Menu"}
                </span>
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile / tablet: full-height sheet.
            Rendered OUTSIDE <header>: backdrop-blur makes the header the
            containing block for fixed children, which collapsed the sheet. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav"
            variants={sheetVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="bg-background border-line fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto border-t md:top-20 lg:hidden"
          >
            <Container className="flex min-h-full flex-col">
              <nav aria-label="Mobile" className="flex flex-col">
                {links.map((item, i) => {
                  const isActive = isActivePath(item.path, pathname);

                  return (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Link
                        href={item.path}
                        onClick={close}
                        className="group border-line flex items-center gap-4 border-b py-4"
                      >
                        <span className="text-muted-foreground w-6 text-xs font-semibold tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-serif text-xl font-extrabold tracking-[-0.04em] sm:text-2xl",
                            isActive ? "text-primary" : "text-foreground",
                          )}
                        >
                          {item.mobileLabel ?? item.label}
                        </span>
                        <ChevronRightIcon
                          size={20}
                          className="text-muted-foreground group-hover:text-primary ml-auto transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div variants={itemVariants} className="mt-auto pt-8 pb-2">
                <div className="bg-navy flex flex-col gap-5 p-5 text-white">
                  <div>
                    <Eyebrow label="Next gathering" className="text-accent" />
                    <strong className="mt-3 block font-serif text-xl font-extrabold tracking-[-0.03em]">
                      Sunday service · 9:00 AM
                    </strong>
                    <p className="text-secondary/75 mt-1 text-sm">
                      Kudenda, Kaduna
                    </p>
                  </div>

                  <Suspense>
                    <Show when="signed-out">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="cream"
                          size="lg"
                          nativeButton={false}
                          render={<Link href="/sign-up" />}
                          onClick={close}
                          className="flex-1 sm:flex-none"
                        >
                          <span>Join the family</span>
                        </Button>
                        <Button
                          variant="glass"
                          size="lg"
                          nativeButton={false}
                          render={<Link href="/sign-in" />}
                          onClick={close}
                        >
                          <span>Log in</span>
                        </Button>
                      </div>
                    </Show>
                    <Show when="signed-in">
                      <Button
                        variant="cream"
                        size="lg"
                        nativeButton={false}
                        render={<Link href="/dashboard" />}
                        onClick={close}
                      >
                        <span>Go to dashboard</span>
                      </Button>
                    </Show>
                  </Suspense>
                </div>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

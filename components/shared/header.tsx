"use client";

import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoClose, IoMenuSharp } from "react-icons/io5";
import { navItems } from "~/lib/constants";
import { cn, isActivePath } from "~/lib/utils";
import { useToggle } from "../providers/toggle";
import { IconSwap, IconSwapItem } from "../reusable/chanhdai/icon-swap";
import { Button } from "../reusable/shadcn/button";
import { Separator } from "../reusable/shadcn/separator";
import { Container } from "./container";
import { LogoComponent } from "./logo";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const drawerVariants: Variants = {
  closed: {
    opacity: 0,
    y: -14,
    transition: { duration: 0.18, ease: easeOutExpo, when: "afterChildren" },
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
  open: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOutExpo } },
};

export const Header = () => {
  const pathname = usePathname();
  const { toggle, isOpen, close } = useToggle("menu");

  return (
    <header
      className={cn(
        "bg-background border-b sticky top-0 left-0 z-50 h-19 w-full transition-colors md:h-24",
        isOpen && "border-b-transparent",
      )}
    >
      <Container className="size-full">
        <nav className="flex size-full items-center justify-between">
          <div className="flex items-center justify-start gap-2 md:w-60">
            <LogoComponent path="/" />
          </div>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            {navItems
              .filter((item) => (item.kind ?? "nav") === "nav")
              .map((item) => {
                const isActive = isActivePath(item.path, pathname);

                return (
                  <Button
                    key={item.path}
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "text-xs",
                      isActive && "text-red hover:text-red/80",
                    )}
                    nativeButton={false}
                    render={<Link href={item.path} />}
                    onClick={close}
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
              variant={isOpen ? "manual" : "outline"}
              size="icon"
              className="relative overflow-hidden lg:hidden"
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
        </nav>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="mobile-nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={close}
                aria-hidden="true"
                className="fixed inset-x-0 top-19 bottom-0 z-40 bg-black/35 backdrop-blur-[2px] md:top-24 lg:hidden"
              />

              <motion.nav
                key="mobile-nav"
                variants={drawerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="bg-background fixed inset-x-0 top-19 z-50 flex flex-col gap-1 border-b p-5 shadow-[0_24px_48px_-12px_rgba(23,16,13,0.28)] sm:px-8 md:top-24 md:px-10 lg:hidden"
              >
                {navItems.map((item) => {
                  const kind = item.kind ?? "nav";
                  const isActive = isActivePath(item.path, pathname);
                  const isExtra = kind !== "nav";

                  return (
                    <motion.div
                      key={item.path}
                      variants={itemVariants}
                      className={cn(
                        kind === "login" && "mt-3 border-t pt-4 md:hidden",
                        kind === "join" && "mt-1 md:hidden",
                      )}
                    >
                      <Button
                        size="lg"
                        variant={
                          kind === "join"
                            ? "dark"
                            : kind === "login"
                              ? isActive
                                ? "secondary"
                                : "outline"
                              : isActive
                                ? "secondary"
                                : "ghost"
                        }
                        nativeButton={false}
                        render={<Link href={item.path} />}
                        className={cn(
                          "group w-full justify-between text-left text-xs",
                          kind !== "join" && "text-ink",
                        )}
                        onClick={close}
                      >
                        <span>{item.mobileLabel ?? item.label}</span>
                        {kind === "login" ? (
                          <span className="text-muted-foreground font-normal">
                            Member account
                          </span>
                        ) : kind === "join" ? (
                          <ChevronRightIcon size={16} />
                        ) : (
                          <ChevronRightIcon
                            size={16}
                            className="transition-transform duration-150 group-hover:translate-x-0.5"
                          />
                        )}
                        {!isExtra && null}
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

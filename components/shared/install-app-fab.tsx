"use client";

import { Image } from "keltra/image/next";
import {
  AppWindowIcon,
  CheckIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  MaximizeIcon,
  MonitorDownIcon,
  QrCodeIcon,
  ShareIcon,
  SquarePlusIcon,
  TriangleAlertIcon,
  WifiOffIcon,
  ZapIcon,
} from "lucide-react";
import * as React from "react";
import { FaAndroid, FaApple } from "react-icons/fa";
import { IoIosLaptop } from "react-icons/io";
import type { IconType } from "react-icons/lib";
import { Button } from "~/components/reusable/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/shadcn/dialog";
import { siteConfig } from "~/config/site.config";
import { cn } from "~/lib/utils";
import { useToggle } from "../providers/toggle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../reusable/shadcn/tabs";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type PlatformTab = "ios" | "android" | "desktop";

const devicesInfo: { value: PlatformTab; label: string; icon: IconType }[] = [
  { value: "ios", label: "iPhone", icon: FaApple },
  { value: "android", label: "Android", icon: FaAndroid },
  { value: "desktop", label: "Desktop", icon: IoIosLaptop },
];

type Step = { id: string; icon: typeof ShareIcon; text: React.ReactNode };

const guides: Record<
  PlatformTab,
  { title: string; browser: string; note?: string; steps: Step[] }
> = {
  ios: {
    title: "iPhone & iPad",
    browser: "Safari",
    note: "Installing only works in Safari. If you’re inside Instagram, WhatsApp or another app, open this page in Safari first.",
    steps: [
      {
        id: "share",
        icon: ShareIcon,
        text: (
          <>
            Tap the <strong>Share</strong> button in Safari’s toolbar.
          </>
        ),
      },
      {
        id: "add",
        icon: SquarePlusIcon,
        text: (
          <>
            Scroll down and tap <strong>Add to Home Screen</strong>.
          </>
        ),
      },
      {
        id: "done",
        icon: CheckIcon,
        text: (
          <>
            Tap <strong>Add</strong> in the top-right corner.
          </>
        ),
      },
    ],
  },
  android: {
    title: "Android",
    browser: "Chrome",
    steps: [
      {
        id: "menu",
        icon: EllipsisVerticalIcon,
        text: (
          <>
            Tap the <strong>⋮ menu</strong> in the top-right of Chrome.
          </>
        ),
      },
      {
        id: "install",
        icon: DownloadIcon,
        text: (
          <>
            Tap <strong>Install app</strong> or{" "}
            <strong>Add to Home screen</strong>.
          </>
        ),
      },
      {
        id: "done",
        icon: CheckIcon,
        text: (
          <>
            Confirm with <strong>Install</strong>.
          </>
        ),
      },
    ],
  },
  desktop: {
    title: "Computer",
    browser: "Chrome or Edge",
    steps: [
      {
        id: "address-bar",
        icon: MonitorDownIcon,
        text: (
          <>
            Click the <strong>Install</strong> icon at the right end of the
            address bar (or open the browser’s ⋮ menu).
          </>
        ),
      },
      {
        id: "choose",
        icon: AppWindowIcon,
        text: (
          <>
            Choose <strong>Install {siteConfig.title}…</strong>
          </>
        ),
      },
      {
        id: "done",
        icon: CheckIcon,
        text: (
          <>
            Click <strong>Install</strong>. It opens in its own window.
          </>
        ),
      },
    ],
  },
};

const benefits = [
  { icon: ZapIcon, label: "Opens instantly" },
  { icon: MaximizeIcon, label: "Full screen" },
  { icon: QrCodeIcon, label: "Quick check-in" },
];

function detectClientPlatform(): PlatformTab {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

export function InstallAppFab() {
  const { toggle, close, isOpen } = useToggle("installation");

  const [isInstalled, setIsInstalled] = React.useState(false);
  const [platform, setPlatform] = React.useState<PlatformTab>("desktop");
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [isPrompting, setIsPrompting] = React.useState(false);

  React.useEffect(() => {
    setPlatform(detectClientPlatform());

    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
      setIsInstalled(standalone);
    };

    checkStandalone();

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener("change", checkStandalone);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    setIsPrompting(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        close();
      }
    } finally {
      setIsPrompting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogTrigger
        render={
          <Button
            variant="dark"
            type="button"
            size="sm"
            aria-label="How to install the app"
            className="fixed right-4 bottom-4 z-40 shadow-lg md:right-6 md:bottom-6"
          >
            <DownloadIcon className="text-accent" />
            <span>Get App</span>
          </Button>
        }
      />

      <DialogContent
        className="bg-background gap-0 overflow-hidden rounded-none p-0 sm:max-w-md"
        showCloseButton={false}
      >
        {/* Header band */}
        <div className="bg-navy relative flex flex-col gap-4 p-6 text-white">
          <div className="flex items-center gap-4">
            <Image
              src="/icons/icon-192x192.png"
              alt=""
              width={56}
              height={56}
              className="size-14 shrink-0 object-contain"
            />
            <DialogHeader className="gap-1">
              <DialogTitle className="font-serif text-xl font-extrabold tracking-[-0.03em] text-white">
                Install the app
              </DialogTitle>
              <DialogDescription className="text-secondary/80 text-xs leading-relaxed">
                Add {siteConfig.title} to your device. It takes less than a
                minute.
              </DialogDescription>
            </DialogHeader>
          </div>

          <ul className="flex flex-wrap gap-2">
            {benefits.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-white/85"
              >
                <Icon className="text-accent size-3.5" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5 p-6">
          {/* One-tap install (when the browser allows it) */}
          {deferredPrompt && (
            <div className="bg-primary text-primary-foreground flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-serif text-sm font-bold">
                  One-tap install is ready
                </p>
                <p className="text-primary-foreground/80 text-xs">
                  Skip the steps below.
                </p>
              </div>
              <Button
                type="button"
                variant="cream"
                size="sm"
                disabled={isPrompting}
                onClick={handleNativeInstall}
              >
                <DownloadIcon />
                <span>{isPrompting ? "Installing…" : "Install now"}</span>
              </Button>
            </div>
          )}

          <Tabs
            value={platform}
            onValueChange={(val) => setPlatform(val as PlatformTab)}
            className="gap-4"
          >
            {/* Device picker */}
            <TabsList
              variant="line"
              className="grid h-auto w-full grid-cols-3 gap-2 p-0"
            >
              {devicesInfo.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "border-line text-muted-foreground flex h-auto flex-col gap-1.5 rounded-none border bg-transparent py-3",
                    "data-active:border-primary data-active:text-foreground data-active:bg-muted",
                  )}
                >
                  <item.icon className="size-5" />
                  <span className="font-serif text-[11px] font-semibold">
                    {item.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {devicesInfo.map((item) => {
              const guide = guides[item.value];
              return (
                <TabsContent key={item.value} value={item.value}>
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <p className="font-serif text-sm font-bold">
                      {guide.title}
                    </p>
                    <span className="text-muted-foreground text-[11px]">
                      Use {guide.browser}
                    </span>
                  </div>

                  {/* Step timeline */}
                  <ol className="relative flex flex-col gap-5">
                    <span
                      aria-hidden="true"
                      className="bg-border absolute top-3 bottom-3 left-[15px] w-px"
                    />
                    {guide.steps.map((step, index) => (
                      <li
                        key={step.id}
                        className="relative flex items-start gap-4"
                      >
                        <span className="bg-background border-primary text-primary relative z-10 grid size-8 shrink-0 place-items-center border">
                          <step.icon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="pt-0.5">
                          <span className="text-muted-foreground text-[10px] font-bold tracking-[0.14em] uppercase">
                            Step {index + 1}
                          </span>
                          <p className="mt-0.5 text-sm leading-snug">
                            {step.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  {guide.note && (
                    <p className="border-accent bg-accent/15 mt-5 flex items-start gap-2 border-l-2 p-3 text-xs leading-relaxed">
                      <TriangleAlertIcon
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {guide.note}
                    </p>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="border-line text-muted-foreground flex items-center justify-between gap-3 border-t pt-4 text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <WifiOffIcon className="text-green size-3.5" />
              Works offline for visited pages
            </span>
            <button
              type="button"
              onClick={close}
              className="text-foreground font-serif font-semibold underline underline-offset-2"
            >
              Close guide
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

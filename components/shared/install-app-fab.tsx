"use client";

import { CheckCircle2Icon, DownloadIcon } from "lucide-react";
import * as React from "react";
import { FaAndroid, FaApple } from "react-icons/fa";
import { IoIosLaptop } from "react-icons/io";
import type { IconType } from "react-icons/lib";
import { Button } from "~/components/reusable/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/shadcn/dialog";
import { siteConfig } from "~/config/site.config";
import { getInitials } from "~/lib/utils";
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
  { value: "ios", label: "iPhone / iPad", icon: FaApple },
  { value: "android", label: "Android", icon: FaAndroid },
  { value: "desktop", label: "Desktop", icon: IoIosLaptop },
];

const stepsByPlatform: Record<
  PlatformTab,
  { title: string; subtitle: string; steps: string[] }
> = {
  ios: {
    title: "iPhone & iPad (Safari)",
    subtitle: "Add the app to your Home Screen from Safari.",
    steps: [
      "Open this page in Safari if you are viewing it inside another app.",
      "Tap the Share button (square with an up arrow) in the toolbar.",
      "Scroll down and tap “Add to Home Screen”.",
      "Tap “Add” in the top-right corner to finish installing.",
    ],
  },
  android: {
    title: "Android (Chrome)",
    subtitle: "Install directly to your app launcher or Home Screen.",
    steps: [
      "Tap the three-dot menu (⋮) in the top-right corner of Chrome.",
      "Tap “Install app” or “Add to Home screen”.",
      "Confirm by tapping “Install” in the pop-up prompt.",
    ],
  },
  desktop: {
    title: "Desktop (Chrome / Edge)",
    subtitle: "Run as a standalone window from your computer.",
    steps: [
      "Click the Install icon in the address bar or open the browser menu (⋮).",
      "Select “Install The Burning Church Global Ministries…”.",
      "Click “Install” to launch it in its own app window.",
    ],
  },
};

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
            className="fixed right-4 bottom-4 z-40 rounded-full border border-white/15 shadow-lg"
          >
            <DownloadIcon className="text-accent" />
            <span>Get App</span>
          </Button>
        }
      />

      <DialogContent
        className="bg-background rounded-none sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="font-medium tracking-tight">
            Quickly Install {getInitials(siteConfig.title)}
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            Add the web app to your device for faster access, a full-screen
            view, and quick check-ins.
          </DialogDescription>
        </DialogHeader>

        {deferredPrompt && (
          <div className="border-line bg-card flex items-center justify-between gap-3 border p-3">
            <div className="min-w-0">
              <p className="font-serif text-xs font-bold">
                Direct install available
              </p>
              <p className="text-muted-foreground text-[11px]">
                Launch your browser’s install prompt now.
              </p>
            </div>
            <Button
              type="button"
              variant="red"
              size="sm"
              disabled={isPrompting}
              onClick={handleNativeInstall}
            >
              <DownloadIcon className="size-3.5" />
              <span>{isPrompting ? "Installing..." : "Install"}</span>
            </Button>
          </div>
        )}

        <Tabs
          value={platform}
          onValueChange={(val) => setPlatform(val as PlatformTab)}
        >
          <TabsList variant="line" className="w-full">
            {devicesInfo.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="flex-1"
              >
                {item.icon && <item.icon className="size-4" />}
                <span className="font-serif text-[11px] font-semibold">
                  {item.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {devicesInfo.map((item) => {
            const guide = stepsByPlatform[item.value];
            return (
              <TabsContent
                key={item.value}
                value={item.value}
                className="border-line bg-card border p-4"
              >
                <p className="font-serif text-xs font-bold">{guide.title}</p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {guide.subtitle}
                </p>

                <ol className="mt-3.5 flex flex-col gap-2.5">
                  {guide.steps.map((step, index) => (
                    <li
                      key={step}
                      className="flex items-start gap-2.5 text-xs leading-relaxed"
                    >
                      <span className="bg-primary text-primary-foreground mt-0.5 flex size-4.5 shrink-0 items-center justify-center font-mono text-[10px] font-bold">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </TabsContent>
            );
          })}
        </Tabs>

        <DialogFooter className="text-muted-foreground flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2Icon className="text-green size-3.5" />
            <span>Works offline for cached pages</span>
          </span>
          <button
            type="button"
            onClick={close}
            className="text-foreground font-serif font-semibold underline underline-offset-2"
          >
            Close Guide
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Image } from "keltra/image/next";
import {
  CheckIcon,
  DownloadIcon,
  LaptopIcon,
  MoreVerticalIcon,
  PlusSquareIcon,
  ShareIcon,
  SmartphoneIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { FaAndroid, FaApple } from "react-icons/fa";
import type { IconType } from "react-icons/lib";
import { Button } from "~/components/reusable/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/reusable/shadcn/dialog";
import { siteConfig } from "~/config/site.config";
import { cn, getInitials } from "~/lib/utils";
import { useToggle } from "../providers/toggle";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type Platform = "ios" | "android" | "desktop";

interface IndexRow {
  code: string;
  action: string;
  control: string;
  icon: typeof ShareIcon;
}

interface PlatformSheet {
  label: string;
  icon: IconType;
  note?: string;
  rows: IndexRow[];
}

const sheets: Record<Platform, PlatformSheet> = {
  ios: {
    label: "iPhone",
    icon: FaApple,
    note: "Safari only — open outside WhatsApp or Instagram first.",
    rows: [
      {
        code: "01",
        action: "Open share menu",
        control: "Share",
        icon: ShareIcon,
      },
      {
        code: "02",
        action: "Pin shortcut",
        control: "Add to Home Screen",
        icon: PlusSquareIcon,
      },
      { code: "03", action: "Save app", control: "Add", icon: CheckIcon },
    ],
  },
  android: {
    label: "Android",
    icon: FaAndroid,
    rows: [
      {
        code: "01",
        action: "Open Chrome options",
        control: "⋮ Menu",
        icon: MoreVerticalIcon,
      },
      {
        code: "02",
        action: "Choose install",
        control: "Install app",
        icon: SmartphoneIcon,
      },
      {
        code: "03",
        action: "Confirm dialog",
        control: "Install",
        icon: CheckIcon,
      },
    ],
  },
  desktop: {
    label: "Desktop",
    icon: LaptopIcon,
    rows: [
      {
        code: "01",
        action: "Click address-bar icon",
        control: "Install",
        icon: DownloadIcon,
      },
      {
        code: "02",
        action: "Select app entry",
        control: siteConfig.pwaName,
        icon: SmartphoneIcon,
      },
      {
        code: "03",
        action: "Launch standalone",
        control: "Install",
        icon: CheckIcon,
      },
    ],
  },
};

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

export function InstallAppFab() {
  const { toggle, close, isOpen } = useToggle("installation");

  const [isInstalled, setIsInstalled] = React.useState(false);
  const [platform, setPlatform] = React.useState<Platform>("desktop");
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [isPrompting, setIsPrompting] = React.useState(false);

  React.useEffect(() => {
    setPlatform(detectPlatform());

    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
      setIsInstalled(standalone);
    };

    checkStandalone();

    const mq = window.matchMedia("(display-mode: standalone)");
    mq.addEventListener("change", checkStandalone);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      mq.removeEventListener("change", checkStandalone);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
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

  const active = sheets[platform];

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogTrigger
        render={
          <Button
            variant="dark"
            type="button"
            size="sm"
            aria-label="Install app"
            className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 rounded-full px-4 shadow-lg md:right-6 md:bottom-6"
          >
            <SparklesIcon className="text-accent size-3.5" />
            <span>Get App</span>
          </Button>
        }
      />

      <DialogContent
        className="bg-background flex max-h-[85dvh] w-[calc(100%-1.25rem)] max-w-md flex-col gap-0 overflow-hidden rounded-xl p-0"
        showCloseButton={false}
      >
        {/* Minimal inline header */}
        <div className="border-line flex shrink-0 items-center justify-between gap-2 border-b px-3.5 py-2.5 sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/icons/icon-192x192.png"
              alt=""
              width={28}
              height={28}
              className="size-6 shrink-0 rounded-md object-contain sm:size-7"
            />
            <DialogHeader className="min-w-0 gap-0 text-left">
              <DialogTitle className="truncate font-serif text-sm font-bold">
                Add {getInitials(siteConfig.title)} to your{" "}
                {sheets[platform].label}
              </DialogTitle>

              <DialogDescription className="sr-only">
                Install instructions for iPhone, Android, and desktop.
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Close"
              />
            }
          >
            <XIcon className="size-3.5" />
          </DialogClose>
        </div>

        {/* Underlined platform index tabs */}
        <div className="border-line grid shrink-0 grid-cols-3 border-b px-1 sm:px-2">
          {(Object.keys(sheets) as Platform[]).map((key) => {
            const item = sheets[key];
            const Icon = item.icon;
            const selected = platform === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setPlatform(key)}
                className={cn(
                  "flex items-center justify-center gap-1.5 border-b-2 py-2.5 text-xs font-semibold transition-colors",
                  selected
                    ? "border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable ledger body */}
        <div className="divide-line min-h-0 flex-1 divide-y overflow-y-auto overscroll-contain px-3.5 sm:px-4">
          {active.rows.map((row) => {
            const RowIcon = row.icon;
            return (
              <div
                key={row.code}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-2.5 text-xs"
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {row.code}
                  </span>
                  <RowIcon className="text-primary size-3.5 shrink-0" />
                  <span className="font-medium">{row.action}</span>
                </div>
                <span className="bg-muted text-foreground ml-auto max-w-full rounded px-2 py-0.5 font-mono text-[11px] font-semibold">
                  {row.control}
                </span>
              </div>
            );
          })}
        </div>

        {/* Responsive footer strip */}
        <div className="border-line bg-muted/40 flex shrink-0 flex-col gap-2 border-t px-3.5 py-2.5 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <p className="text-muted-foreground leading-snug">
            {active.note ?? "Quick access from your home screen."}
          </p>

          {deferredPrompt && (
            <Button
              type="button"
              size="xs"
              disabled={isPrompting}
              onClick={handleNativeInstall}
              className="w-full shrink-0 sm:w-auto"
            >
              <DownloadIcon className="size-3" />
              <span>{isPrompting ? "Installing…" : "Install"}</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

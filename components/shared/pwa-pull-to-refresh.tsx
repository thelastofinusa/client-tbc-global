"use client";

import { LoaderIcon, RefreshCwIcon } from "lucide-react";
import * as React from "react";

const PULL_THRESHOLD = 76;
const MAX_PULL = 110;

export function PwaPullToRefresh() {
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const startYRef = React.useRef<number | null>(null);
  const pullDistanceRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
      setIsStandalone(standalone);
    };

    checkStandalone();

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkStandalone);
    return () => mediaQuery.removeEventListener("change", checkStandalone);
  }, []);

  React.useEffect(() => {
    if (!isStandalone) return;

    const getScrollTop = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const schedulePullUpdate = (nextPull: number) => {
      pullDistanceRef.current = nextPull;
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        setPullDistance(pullDistanceRef.current);
      });
    };

    const triggerReload = () => {
      setIsDragging(false);
      setIsRefreshing(true);
      setPullDistance(52);
      pullDistanceRef.current = 52;
      window.setTimeout(() => {
        window.location.reload();
      }, 120);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshing || e.touches.length !== 1) return;
      if (getScrollTop() <= 2) {
        startYRef.current = e.touches[0].clientY;
        setIsDragging(true);
      } else {
        startYRef.current = null;
        setIsDragging(false);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null || isRefreshing) return;

      if (getScrollTop() > 2) {
        startYRef.current = null;
        setIsDragging(false);
        schedulePullUpdate(0);
        return;
      }

      const deltaY = e.touches[0].clientY - startYRef.current;
      if (deltaY > 4) {
        const damped = Math.min(MAX_PULL, (deltaY - 4) * 0.45);
        schedulePullUpdate(damped);
      } else {
        schedulePullUpdate(0);
      }
    };

    const handleTouchEnd = () => {
      if (startYRef.current === null) return;
      const finalPull = pullDistanceRef.current;
      startYRef.current = null;

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (!isRefreshing && finalPull >= PULL_THRESHOLD) {
        triggerReload();
      } else {
        setIsDragging(false);
        setPullDistance(0);
        pullDistanceRef.current = 0;
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isStandalone, isRefreshing]);

  if (!isStandalone) return null;

  const progress = Math.min(1, pullDistance / PULL_THRESHOLD);
  const showSpinner = pullDistance > 2 || isRefreshing;
  const translateY = isRefreshing
    ? 44
    : Math.max(-28, pullDistance * 0.65 - 24);
  const scale = isRefreshing ? 1 : 0.65 + progress * 0.35;
  const opacity = isRefreshing ? 1 : Math.min(1, progress * 1.25);

  return (
    <>
      {/* Safari-style top spinner */}
      <div
        aria-hidden={!showSpinner}
        style={{
          transform: `translate3d(-50%, calc(${translateY}px + env(safe-area-inset-top, 0px)), 0) scale(${scale})`,
          opacity: showSpinner ? opacity : 0,
          transition: isDragging
            ? "none"
            : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease-out",
        }}
        className="bg-background/90 text-foreground pointer-events-none fixed top-0 left-1/2 z-50 flex size-9 items-center justify-center rounded-full ring-1 ring-black/10 backdrop-blur-md dark:ring-white/15"
      >
        <LoaderIcon
          style={
            isRefreshing
              ? undefined
              : { transform: `rotate(${progress * 270}deg)` }
          }
          className={`text-muted-foreground size-5 ${
            isRefreshing ? "animate-spin" : ""
          }`}
        />
      </div>

      {/* Standalone reload button */}
      <button
        type="button"
        onClick={() => {
          setIsRefreshing(true);
          window.location.reload();
        }}
        aria-label="Reload app"
        title="Reload app"
        className="bg-foreground/90 hover:bg-foreground fixed right-5 bottom-5 z-40 flex size-9 items-center justify-center rounded-full border border-white/15 text-white shadow-lg backdrop-blur-xs transition-colors"
      >
        <RefreshCwIcon
          className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
      </button>
    </>
  );
}

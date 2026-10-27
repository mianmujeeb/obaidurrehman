"use client";

import { useEffect, useId, useSyncExternalStore } from "react";
import { DeviceMobileIcon, DownloadSimpleIcon, ExportIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __installPrompt?: InstallEvent | null;
  }
}

type PwaState = { canPrompt: boolean; isIOS: boolean; installed: boolean };

const serverState: PwaState = { canPrompt: false, isIOS: false, installed: false };
let state: PwaState = serverState;
let started = false;
const listeners = new Set<() => void>();

function emit(next: PwaState) {
  state = next;
  listeners.forEach((l) => l());
}

// The inline script in layout.tsx stashes `beforeinstallprompt` in
// window.__installPrompt so the event is not lost before hydration.
function start() {
  if (started) return;
  started = true;
  const nav = navigator as Navigator & { standalone?: boolean };
  emit({
    canPrompt: Boolean(window.__installPrompt),
    isIOS: /iphone|ipad|ipod/i.test(nav.userAgent) || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1),
    installed: window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true,
  });
  window.addEventListener("installprompt-ready", () => emit({ ...state, canPrompt: true }));
  window.addEventListener("appinstalled", () => {
    window.__installPrompt = null;
    emit({ ...state, canPrompt: false, installed: true });
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  queueMicrotask(start);
  return () => listeners.delete(listener);
}

export function usePwaInstall() {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}

async function promptInstall() {
  const event = window.__installPrompt;
  if (!event) return;
  await event.prompt();
  const { outcome } = await event.userChoice;
  window.__installPrompt = null;
  emit({ ...state, canPrompt: false, installed: outcome === "accepted" });
}

/**
 * "Install app" control. Uses the native prompt where the browser offers one
 * (Android, desktop Chromium) and shows Add to Home Screen steps on iOS.
 */
export function InstallButton({ className, label = "Install app" }: { className?: string; label?: string }) {
  const { canPrompt, isIOS, installed } = usePwaInstall();
  const popoverId = useId();

  if (installed || (!canPrompt && !isIOS)) return null;

  const classes = cn(
    "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent active:scale-[0.98]",
    className,
  );

  if (canPrompt) {
    return (
      <button type="button" onClick={promptInstall} className={classes}>
        <DownloadSimpleIcon size={18} weight="bold" aria-hidden />
        {label}
      </button>
    );
  }

  return (
    <>
      <button type="button" popoverTarget={popoverId} className={classes}>
        <DeviceMobileIcon size={18} weight="bold" aria-hidden />
        {label}
      </button>
      <div
        id={popoverId}
        popover="auto"
        className="fixed inset-x-4 bottom-4 top-auto m-0 mx-auto max-w-sm rounded-3xl border border-line bg-surface p-6 text-ink shadow-soft backdrop:bg-black/30"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-lg font-semibold">Add to your home screen</p>
          <button
            type="button"
            popoverTarget={popoverId}
            popoverTargetAction="hide"
            aria-label="Close"
            className="-m-2 rounded-full p-2 text-muted hover:text-ink"
          >
            <XIcon size={18} aria-hidden />
          </button>
        </div>
        <ol className="mt-4 space-y-3 text-sm text-muted">
          <li className="flex items-center gap-3">
            <ExportIcon size={20} className="shrink-0 text-accent" aria-hidden />
            Tap the Share button in Safari.
          </li>
          <li className="flex items-center gap-3">
            <PlusIcon size={20} className="shrink-0 text-accent" aria-hidden />
            Choose Add to Home Screen, then Add.
          </li>
        </ol>
      </div>
    </>
  );
}

/** Registers /sw.js in production builds only, so dev reloads stay uncached. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
  }, []);
  return null;
}

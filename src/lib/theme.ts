"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { usePrefersDark } from "./hooks";
import { THEME_KEY } from "./theme-script";

/** "system" follows the device setting and is stored as no saved choice. */
export type ThemePref = "light" | "dark" | "system";

const listeners = new Set<() => void>();
let current: ThemePref | undefined;

function readStored(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function getPref() {
  return (current ??= readStored());
}

function subscribe(onChange: () => void) {
  // Keeps other open tabs in step with a change made here.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_KEY) return;
    current = readStored();
    applyTheme(current);
    onChange();
  };
  listeners.add(onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function applyTheme(pref: ThemePref) {
  const root = document.documentElement;
  if (pref === "system") delete root.dataset.theme;
  else root.dataset.theme = pref;
}

function setTheme(pref: ThemePref) {
  current = pref;
  try {
    if (pref === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch {
    // Storage blocked: the choice still holds until the page is closed.
  }
  applyTheme(pref);
  for (const l of listeners) l();
}

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Applies `pref`. Where view transitions exist and motion is allowed, the new
 * palette grows out of `origin` in a circle; otherwise it swaps in one step.
 */
export function switchTheme(pref: ThemePref, origin: Element) {
  const root = document.documentElement;
  root.classList.add("theme-switching");

  if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTheme(pref);
    // Settle the new colours while transitions are off so nothing fades piecemeal.
    void document.body.offsetHeight;
    requestAnimationFrame(() => root.classList.remove("theme-switching"));
    return;
  }

  const { left, top, width, height } = origin.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const vt = document.startViewTransition(() => setTheme(pref));
  vt.ready.then(
    () =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    () => {},
  );
  const done = () => root.classList.remove("theme-switching");
  vt.finished.then(done, done);
}

/** Flips to whichever palette is not showing now. */
export function toggleTheme(origin: Element) {
  const pref = getPref();
  const dark = pref === "system" ? prefersDark() : pref === "dark";
  switchTheme(dark ? "light" : "dark", origin);
}

export function useThemePref() {
  return useSyncExternalStore<ThemePref>(subscribe, getPref, () => "system");
}

/** Whether the dark palette is showing, from the saved choice or the system setting. */
export function useDarkTheme() {
  const pref = useThemePref();
  const systemDark = usePrefersDark();
  return pref === "system" ? systemDark : pref === "dark";
}

/**
 * Re-applies the saved theme on mount. The head script covers first paint; this
 * restores data-theme after React's dev remount clears attributes on <html>.
 */
export function useRestoreTheme() {
  useLayoutEffect(() => applyTheme(getPref()), []);
}

"use client";

import { useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

const darkQuery = "(prefers-color-scheme: dark)";
const subscribeDark = subscribeMedia(darkQuery);

export function usePrefersDark() {
  return useSyncExternalStore(
    subscribeDark,
    () => window.matchMedia(darkQuery).matches,
    () => false,
  );
}

function subscribeMinute(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
}

function currentMinute() {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

/** Epoch ms rounded to the minute; null during SSR and hydration. */
export function useNowMinute() {
  return useSyncExternalStore<number | null>(subscribeMinute, currentMinute, () => null);
}

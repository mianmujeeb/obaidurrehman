import { twMerge } from "tailwind-merge";
import type { Weekday } from "./doctor";
import { WEEK } from "./doctor";

/** Joins class names; later Tailwind utilities override conflicting earlier ones. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** "15:30" -> "3:30 PM" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatFee(rupees: number) {
  return `Rs. ${rupees.toLocaleString("en-US")}`;
}

/** Collapses runs of consecutive days: Mon,Tue,Wed,Thu,Sat -> "Mon to Thu, Sat" */
export function formatDays(days: Weekday[]) {
  if (days.length === 0) return "";
  const idx = days.map((d) => WEEK.indexOf(d)).sort((a, b) => a - b);
  const runs: number[][] = [];
  for (const i of idx) {
    const last = runs.at(-1);
    if (last && i === last[last.length - 1] + 1) last.push(i);
    else runs.push([i]);
  }
  return runs
    .map((r) =>
      r.length >= 3 ? `${WEEK[r[0]]} to ${WEEK[r[r.length - 1]]}` : r.map((i) => WEEK[i]).join(", "),
    )
    .join(", ");
}

const karachiParts = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Karachi",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Day of week and minutes past midnight in Lahore for a given epoch time. */
export function lahoreNow(epochMs: number) {
  const parts = karachiParts.formatToParts(new Date(epochMs));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    day: get("weekday") as Weekday,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Small deterministic PRNG (mulberry32) so 3D layouts are pure and stable. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

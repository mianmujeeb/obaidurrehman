"use client";

import { WEEK, type Clinic, type Weekday } from "@/lib/doctor";
import { useNowMinute } from "@/lib/hooks";
import { cn, formatTime, lahoreNow, toMinutes } from "@/lib/utils";

function nextClinicDay(days: Weekday[], from: Weekday) {
  const start = WEEK.indexOf(from);
  for (let i = 1; i <= 7; i++) {
    const d = WEEK[(start + i) % 7];
    if (days.includes(d)) return d;
  }
  return null;
}

/** Live status line in Lahore time: in clinic now, later today, or next day. */
export function ClinicStatus({ clinic }: { clinic: Clinic }) {
  const now = useNowMinute();
  if (now === null || !clinic.open || !clinic.close || clinic.days.length === 0) return null;

  const { day, minutes } = lahoreNow(now);
  const open = toMinutes(clinic.open);
  const close = toMinutes(clinic.close);
  const today = clinic.days.includes(day);

  let text: string;
  let live = false;
  if (today && minutes >= open && minutes < close) {
    text = `Open now until ${formatTime(clinic.close)}`;
    live = true;
  } else if (today && minutes < open) {
    text = `Today from ${formatTime(clinic.open)}`;
  } else {
    const next = nextClinicDay(clinic.days, day);
    text = next ? `Next: ${next} at ${formatTime(clinic.open)}` : "";
  }
  if (!text) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
        live ? "bg-accent text-accent-ink" : "bg-accent-soft text-ink",
      )}
    >
      {live && <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent-ink" />}
      {text}
    </span>
  );
}

/** Seven-day strip; clinic days are filled and today gets a ring. */
export function WeekStrip({ days }: { days: Weekday[] }) {
  const now = useNowMinute();
  const today = now === null ? null : lahoreNow(now).day;

  return (
    <ul className="grid grid-cols-7 gap-1.5" aria-label="Clinic days">
      {WEEK.map((d) => {
        const on = days.includes(d);
        return (
          <li
            key={d}
            className={cn(
              "grid h-11 place-items-center rounded-full text-xs font-semibold transition",
              on ? "bg-accent-soft text-ink" : "text-muted/70",
              today === d && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
            )}
          >
            {d}
            <span className="sr-only">{on ? ", clinic day" : ", no clinic"}</span>
          </li>
        );
      })}
    </ul>
  );
}

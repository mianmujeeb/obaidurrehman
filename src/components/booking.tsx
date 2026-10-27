"use client";

import { createContext, use, useCallback, useEffect, useRef, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import {
  ArrowUpRightIcon,
  CalendarCheckIcon,
  ClockIcon,
  HospitalIcon,
  PhoneIcon,
  VideoCameraIcon,
  XIcon,
} from "@phosphor-icons/react";
import { clinics } from "@/lib/doctor";
import { cn, formatDays, formatFee, formatTime } from "@/lib/utils";

const OpenBooking = createContext<() => void>(() => {});

export function Providers({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = useCallback(() => dialogRef.current?.showModal(), []);

  // PWA shortcut "/?book=1" opens the booking sheet straight away.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("book")) dialogRef.current?.showModal();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <OpenBooking value={open}>
        {children}
        <BookingDialog ref={dialogRef} />
      </OpenBooking>
    </MotionConfig>
  );
}

export function BookButton({
  className,
  variant = "primary",
  children = "Book appointment",
}: {
  className?: string;
  variant?: "primary" | "inverse";
  children?: ReactNode;
}) {
  const open = use(OpenBooking);
  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition duration-300 active:scale-[0.98]",
        variant === "primary"
          ? "bg-accent text-accent-ink hover:bg-accent-strong"
          : "bg-accent-ink text-accent hover:bg-surface",
        className,
      )}
    >
      <CalendarCheckIcon size={18} weight="bold" aria-hidden />
      {children}
    </button>
  );
}

function BookingDialog({ ref }: { ref: React.Ref<HTMLDialogElement> }) {
  return (
    <dialog
      ref={ref}
      aria-labelledby="booking-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="booking-sheet text-ink"
    >
      <div className="max-h-[88dvh] overflow-y-auto p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="booking-title" className="text-2xl font-semibold tracking-tight">
              Book an appointment
            </h2>
            <p className="mt-1 text-sm text-muted">Choose a clinic visit or a video consultation.</p>
          </div>
          <form method="dialog">
            <button
              aria-label="Close"
              className="-m-1 rounded-full p-2 text-muted transition hover:bg-surface-2 hover:text-ink"
            >
              <XIcon size={20} aria-hidden />
            </button>
          </form>
        </div>

        <ul className="mt-6 space-y-3">
          {clinics.map((c) => (
            <li key={c.id} className="rounded-3xl border border-line bg-bg p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  {c.kind === "video" ? (
                    <VideoCameraIcon size={20} weight="duotone" aria-hidden />
                  ) : (
                    <HospitalIcon size={20} weight="duotone" aria-hidden />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug">{c.name}</p>
                  {c.address && <p className="mt-0.5 text-sm text-muted">{c.address}</p>}
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <ClockIcon size={16} className="text-accent" aria-hidden />
                      {c.open && c.close
                        ? `${formatDays(c.days)}, ${formatTime(c.open)} to ${formatTime(c.close)}`
                        : c.hoursNote}
                    </span>
                    <span className="text-muted">Fee {formatFee(c.fee)}</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={c.bookVia.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:bg-accent-strong active:scale-[0.98]"
                >
                  {c.bookVia.label}
                  <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
                </a>
                <a
                  href={`tel:${c.phone.tel}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent active:scale-[0.98]"
                >
                  <PhoneIcon size={16} weight="bold" aria-hidden />
                  {c.phone.display}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-muted">
          Online bookings are handled by Oladoc and Marham. Fees are as listed on those platforms.
        </p>
      </div>
    </dialog>
  );
}

import type { Metadata } from "next";
import { PhoneIcon, WifiSlashIcon } from "@phosphor-icons/react/ssr";
import { LogoTile } from "@/components/brand-mark";
import { clinics, doctor, phones } from "@/lib/doctor";
import { formatDays, formatTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

// Served by the service worker when a page cannot load without a connection.
// Phone links still work offline, so the clinic details are repeated here.
export default function Offline() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-16">
      <LogoTile className="size-12" />
      <h1 className="mt-8 flex items-center gap-3 text-3xl font-semibold tracking-tight">
        <WifiSlashIcon size={28} className="text-accent" aria-hidden />
        You are offline
      </h1>
      <p className="mt-4 leading-relaxed text-muted">
        This page needs a connection. You can still call to book an appointment with {doctor.name}.
      </p>

      <ul className="mt-8 space-y-3">
        {clinics
          .filter((c) => c.open && c.close)
          .map((c) => (
            <li key={c.id} className="rounded-3xl border border-line bg-surface p-5">
              <p className="font-semibold">{c.name}</p>
              <p className="mt-1 text-sm text-muted">
                {formatDays(c.days)}, {formatTime(c.open!)} to {formatTime(c.close!)}
              </p>
            </li>
          ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`tel:${phones.oladoc.tel}`}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink"
        >
          <PhoneIcon size={18} weight="bold" aria-hidden />
          Call {phones.oladoc.display}
        </a>
        {/* A full document load (not a client transition) so the service worker retries the network. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-semibold"
        >
          Try again
        </a>
      </div>
    </main>
  );
}

import {
  ArrowUpRightIcon,
  ClockIcon,
  HospitalIcon,
  MapPinIcon,
  NavigationArrowIcon,
  PhoneIcon,
  VideoCameraIcon,
  WalletIcon,
} from "@phosphor-icons/react/ssr";
import { clinics, type Clinic } from "@/lib/doctor";
import { cn, formatDays, formatFee, formatTime } from "@/lib/utils";
import { ClinicStatus, WeekStrip } from "../clinic-status";
import { MoreLink } from "../more-link";
import { Reveal } from "../motion";

export const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/** Clinic cards. `more` adds a link through to the contact page. */
export function Clinics({ more = false }: { more?: boolean }) {
  const [main, ...others] = clinics;

  return (
    <section id="clinics" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <Reveal className="max-w-3xl">
        <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Where to see Dr. Obaid</h2>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">
          Clinic visits in Johar Town and Valencia, or a video consultation from home. All times are Lahore
          time.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
                <HospitalIcon size={24} weight="duotone" aria-hidden />
              </span>
              <ClinicStatus clinic={main} />
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">{main.name}</h3>
            <p className="mt-2 flex items-start gap-2 text-muted">
              <MapPinIcon size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              {main.address}
            </p>

            <div className="mt-8">
              <WeekStrip days={main.days} />
            </div>

            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              <Fact icon={<ClockIcon size={18} aria-hidden />} label="Clinic hours">
                {formatDays(main.days)}
                <br />
                {formatTime(main.open!)} to {formatTime(main.close!)}
              </Fact>
              <Fact icon={<WalletIcon size={18} aria-hidden />} label="Consultation fee">
                {formatFee(main.fee)}
              </Fact>
            </dl>

            <div className="mt-auto flex flex-wrap gap-3 pt-9">
              <ClinicActions clinic={main} />
            </div>
          </article>
        </Reveal>

        <div className="grid gap-4 lg:col-span-5">
          {others.map((c, i) => (
            <Reveal key={c.id} delay={0.08 * (i + 1)}>
              <SmallClinic clinic={c} />
            </Reveal>
          ))}
        </div>
      </div>

      {more && (
        <Reveal className="mt-10">
          <MoreLink href="/contact">All ways to get in touch</MoreLink>
        </Reveal>
      )}
    </section>
  );
}

function SmallClinic({ clinic }: { clinic: Clinic }) {
  const video = clinic.kind === "video";
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-3xl border border-line p-6 sm:p-8",
        video ? "bg-accent-soft" : "bg-surface",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={cn(
            "grid size-11 place-items-center rounded-full",
            video ? "bg-accent text-accent-ink" : "bg-accent-soft text-accent",
          )}
        >
          {video ? (
            <VideoCameraIcon size={22} weight="duotone" aria-hidden />
          ) : (
            <HospitalIcon size={22} weight="duotone" aria-hidden />
          )}
        </span>
        <ClinicStatus clinic={clinic} />
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">{clinic.name}</h3>
      {clinic.address && <p className="mt-1 text-muted">{clinic.address}</p>}
      <p className="mt-4 text-sm">
        {clinic.open && clinic.close
          ? `${formatDays(clinic.days)}, ${formatTime(clinic.open)} to ${formatTime(clinic.close)}`
          : clinic.hoursNote}
        <span className="text-muted"> Fee {formatFee(clinic.fee)}.</span>
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <ClinicActions clinic={clinic} compact />
      </div>
    </article>
  );
}

export function ClinicActions({ clinic, compact }: { clinic: Clinic; compact?: boolean }) {
  const pad = compact ? "px-4 py-2" : "px-5 py-3";
  return (
    <>
      <a
        href={clinic.bookVia.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-accent text-sm font-semibold text-accent-ink transition hover:bg-accent-strong active:scale-[0.98]",
          pad,
        )}
      >
        {clinic.bookVia.label}
        <ArrowUpRightIcon size={16} weight="bold" aria-hidden />
      </a>
      <a
        href={`tel:${clinic.phone.tel}`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-line text-sm font-medium transition hover:border-accent hover:text-accent active:scale-[0.98]",
          pad,
        )}
      >
        <PhoneIcon size={16} weight="bold" aria-hidden />
        {compact ? "Call" : clinic.phone.display}
      </a>
      {clinic.mapsQuery && (
        <a
          href={mapsUrl(clinic.mapsQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-line text-sm font-medium transition hover:border-accent hover:text-accent active:scale-[0.98]",
            pad,
          )}
        >
          <NavigationArrowIcon size={16} weight="bold" aria-hidden />
          Directions
        </a>
      )}
    </>
  );
}

function Fact({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-sm text-muted">
        <span className="text-accent">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1.5 text-lg font-semibold leading-snug">{children}</dd>
    </div>
  );
}

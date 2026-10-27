import type { Metadata } from "next";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarCheckIcon,
  CheckCircleIcon,
  FirstAidIcon,
  HospitalIcon,
  PhoneIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react/ssr";
import { BookButton } from "@/components/booking";
import { BrandMark } from "@/components/brand-mark";
import { ClinicStatus, WeekStrip } from "@/components/clinic-status";
import { MoreLink } from "@/components/more-link";
import { Reveal } from "@/components/motion";
import { PageFrame, PageHero } from "@/components/page-frame";
import { ClinicActions } from "@/components/sections/clinics";
import { clinics, doctor, links, phones } from "@/lib/doctor";
import { formatDays, formatFee, formatTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact and appointments",
  description: `Book ${doctor.name} online, call a booking line, or find clinic timings and directions in ${doctor.city}.`,
  alternates: { canonical: "/contact" },
};

const video = clinics.find((c) => c.kind === "video")!;

const bringList = [
  "Previous reports and discharge summaries",
  "Ultrasound, X-ray or CT scans",
  "Recent urine and blood tests",
  "A list of the medicines you take",
  "Arrive a few minutes early so the clinic stays on time",
];

export default function ContactPage() {
  return (
    <PageFrame current="contact">
      <PageHero
        title="Contact and appointments"
        lead={`Book online, call a booking line or visit a clinic in ${doctor.city}. All times are Lahore time.`}
        aside={<EmergencyNote />}
      >
        <div className="flex flex-wrap gap-3">
          <BookButton className="px-7 py-3.5" />
          <a
            href={`tel:${phones.oladoc.tel}`}
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold transition hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            <PhoneIcon size={16} weight="bold" aria-hidden />
            {phones.oladoc.display}
          </a>
        </div>
      </PageHero>

      <section aria-label="Ways to book" className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <article className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-accent p-7 text-accent-ink sm:p-10">
              <BrandMark className="absolute -bottom-14 -right-10 size-64 opacity-[0.08]" />
              <span className="relative grid size-12 place-items-center rounded-full bg-accent-ink/15">
                <CalendarCheckIcon size={24} weight="duotone" aria-hidden />
              </span>
              <h2 className="relative mt-6 text-3xl font-semibold tracking-tight md:text-4xl">Book online</h2>
              <p className="relative mt-3 max-w-[46ch] text-lg leading-relaxed opacity-90">
                Choose a clinic or a video visit, then confirm your slot on Oladoc or Marham. It takes about a minute.
              </p>
              <div className="relative mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-9">
                <BookButton variant="inverse" className="px-7 py-3.5" />
                {[
                  { href: links.oladoc, label: "Oladoc profile" },
                  { href: links.marham, label: "Marham profile" },
                ].map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline"
                  >
                    {l.label}
                    <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
                  </a>
                ))}
              </div>
            </article>
          </Reveal>

          <div className="grid gap-4 lg:col-span-5">
            <Reveal delay={0.08}>
              <article className="h-full rounded-3xl border border-line bg-surface p-7 sm:p-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <PhoneIcon size={20} weight="duotone" className="text-accent" aria-hidden />
                  Call to book
                </h2>
                <ul className="mt-5 divide-y divide-line">
                  {Object.values(phones).map((p) => (
                    <li key={p.tel} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <span className="text-sm text-muted">{p.label}</span>
                      <a href={`tel:${p.tel}`} className="font-semibold tabular-nums text-accent hover:underline">
                        {p.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={0.16}>
              <article className="h-full rounded-3xl border border-line bg-accent-soft p-7 sm:p-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <VideoCameraIcon size={20} weight="duotone" className="text-accent" aria-hidden />
                  Video consultation
                </h2>
                <p className="mt-3 leading-relaxed">
                  {formatDays(video.days)}, {formatTime(video.open!)} to {formatTime(video.close!)}.
                  <span className="text-muted"> Fee {formatFee(video.fee)}.</span>
                </p>
                <a
                  href={video.bookVia.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                >
                  {video.bookVia.label}
                  <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
                </a>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="timings" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Clinic timings</h2>
          <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-muted">
            Timings can change around public holidays. Call ahead if you are travelling far.
          </p>
        </Reveal>

        {/* Rows share one set of columns (subgrid) so days and actions line up. */}
        <ul className="mt-10 divide-y divide-line border-y border-line lg:grid lg:grid-cols-[minmax(0,1fr)_18rem_auto] lg:gap-x-8 xl:grid-cols-[minmax(0,1fr)_20rem_auto]">
          {clinics.map((c, i) => (
            <Reveal
              key={c.id}
              as="li"
              delay={i * 0.06}
              className="grid gap-6 py-8 lg:col-span-3 lg:grid-cols-subgrid lg:items-center"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  {c.kind === "video" ? (
                    <VideoCameraIcon size={22} weight="duotone" aria-hidden />
                  ) : (
                    <HospitalIcon size={22} weight="duotone" aria-hidden />
                  )}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{c.name}</h3>
                  {c.address && <p className="mt-1 text-sm text-muted">{c.address}</p>}
                  <div className="mt-3 empty:hidden">
                    <ClinicStatus clinic={c} />
                  </div>
                </div>
              </div>

              <div>
                {c.days.length > 0 && c.open && c.close ? (
                  <>
                    <WeekStrip days={c.days} />
                    <p className="mt-3 text-sm">
                      {formatTime(c.open)} to {formatTime(c.close)}
                      <span className="text-muted"> · Fee {formatFee(c.fee)}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-sm">
                    {c.hoursNote}
                    <span className="text-muted"> Fee {formatFee(c.fee)}.</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 lg:flex-nowrap lg:justify-end">
                <ClinicActions clinic={c} compact />
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <article className="h-full rounded-3xl border border-line bg-surface p-7 sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight">Before your visit</h2>
              <p className="mt-2 text-muted">Bringing these helps Dr. Obaid make the most of your appointment.</p>
              <ul className="mt-6 space-y-3">
                {bringList.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircleIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <article className="flex h-full flex-col rounded-3xl bg-accent-soft p-7 sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight">Have a question first?</h2>
              <p className="mt-3 leading-relaxed text-muted">
                Answers on booking, video visits, stones and surgery, plus step-by-step treatment guides.
              </p>
              <div className="mt-auto pt-8">
                <MoreLink href="/reviews#questions" className="bg-surface">
                  Common questions
                </MoreLink>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </PageFrame>
  );
}

function EmergencyNote() {
  return (
    <aside className="rounded-3xl border border-line bg-surface p-6 sm:p-7">
      <p className="flex items-center gap-2 font-semibold">
        <FirstAidIcon size={20} weight="duotone" className="text-accent" aria-hidden />
        In an emergency
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        Severe pain with fever, being unable to pass urine, or heavy bleeding needs urgent care. Go to the nearest
        emergency department rather than waiting for a clinic appointment.
      </p>
      <a
        href="tel:1122"
        className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
      >
        Call Rescue 1122
        <ArrowRightIcon size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" aria-hidden />
      </a>
    </aside>
  );
}

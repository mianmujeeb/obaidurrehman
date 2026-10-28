import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  HospitalIcon,
  MapPinIcon,
  MedalIcon,
  PhoneIcon,
  SealCheckIcon,
  StarIcon,
} from "@phosphor-icons/react/ssr";
import { clinics, doctor, phones, reviewPlatforms } from "@/lib/doctor";
import { formatDays, formatTime } from "@/lib/utils";
import { BookButton } from "../booking";
import { ClinicStatus } from "../clinic-status";
import { HeroKidney } from "../hero-kidney";

const omar = clinics[0];
const platforms = Object.values(reviewPlatforms);
const reviewCount = platforms.reduce((n, p) => n + p.count, 0);
const rating = platforms.reduce((n, p) => n + p.rating * p.count, 0) / reviewCount;

// `short` keeps the list to two compact rows on phones.
const highlights = [
  { slug: "laser-stone-surgery", label: "Laser stone surgery", short: "Laser stone surgery" },
  { slug: "pcnl", label: "PCNL for large kidney stones", short: "PCNL" },
  { slug: "turp", label: "TURP for enlarged prostate", short: "Prostate (TURP)" },
  { slug: "varicocele-microsurgery", label: "Male infertility and varicocele", short: "Male infertility" },
];

const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16 md:pt-[72px]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 sm:gap-10 md:px-8 lg:min-h-[min(calc(100dvh-72px),50rem)] lg:grid-cols-12 lg:gap-8">
        <div className="relative z-10 pt-6 sm:pt-10 lg:col-span-6 lg:py-12">
          <Link
            href="/reviews#reviews"
            className="rise group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-2.5 pr-3.5 text-sm shadow-soft transition hover:border-accent"
            style={rise(0)}
          >
            <span className="flex gap-0.5 text-accent" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} size={14} weight="fill" />
              ))}
            </span>
            <span>
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted">
                {" "}
                from {reviewCount} patient reviews<span className="hidden sm:inline"> on Google, Oladoc and Marham</span>
              </span>
            </span>
            <ArrowRightIcon size={14} weight="bold" className="text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>

          <h1 className="rise mt-6 text-[2.5rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.1rem]" style={rise(1)}>
            {doctor.name}
            <span className="mt-2 block text-lg font-medium leading-snug tracking-normal text-muted sm:mt-3 sm:text-2xl lg:text-[1.7rem]">
              Kidney stone and prostate specialist in Lahore
            </span>
          </h1>
          <p className="rise mt-6 hidden max-w-[48ch] text-lg leading-relaxed text-muted sm:block" style={rise(2)}>
            Assistant Professor of Urology at Omar Hospital, Johar Town, treating stones, prostate disease and male
            infertility with keyhole and laser surgery.
          </p>

          <ul className="rise mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:mt-6 sm:gap-x-6" style={rise(3)}>
            {highlights.map((h) => (
              <li key={h.slug}>
                <Link
                  href={`/treatments/${h.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent sm:text-[15px]"
                >
                  <CheckCircleIcon size={20} weight="fill" className="shrink-0 text-accent" aria-hidden />
                  <span className="sm:hidden">{h.short}</span>
                  <span className="hidden sm:inline">{h.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="rise mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3" style={rise(4)}>
            <BookButton className="px-6 sm:px-7 sm:py-3.5" />
            <a
              href={`tel:${phones.clinic.tel}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent active:scale-[0.98] sm:px-6 sm:py-3.5"
            >
              <PhoneIcon size={16} weight="bold" aria-hidden />
              <span className="sm:hidden">Call</span>
              <span className="hidden tabular-nums sm:inline">
                <span className="sr-only">Call </span>
                {phones.clinic.display}
              </span>
            </a>
          </div>

          <ul className="rise mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted sm:mt-7 sm:gap-x-5" style={rise(5)}>
            <li className="inline-flex items-center gap-1.5">
              <SealCheckIcon size={18} weight="fill" className="text-accent" aria-hidden />
              PMDC verified
            </li>
            <li className="inline-flex items-center gap-1.5">
              <MedalIcon size={18} weight="duotone" className="text-accent" aria-hidden />
              <span className="sm:hidden">FCPS (Urology)</span>
              <span className="hidden sm:inline">{doctor.qualifications.slice(0, 2).join(", ")}</span>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <MapPinIcon size={18} weight="duotone" className="text-accent" aria-hidden />
              Johar Town, Lahore
            </li>
          </ul>
        </div>

        <HeroPortrait />
      </div>
    </section>
  );
}

/**
 * The doctor in an arch, with his head rising above it and the sides clipping
 * his shoulders (the source photo is cropped on one side), plus floating cards:
 * experience, clinic hours, and the interactive kidney.
 */
function HeroPortrait() {
  if (!doctor.photo) return null;
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:col-span-6 lg:w-[min(100%,calc(min(100dvh-8rem,46.5rem)*0.833))] lg:max-w-none lg:self-end">
      <div className="relative aspect-[5/6]">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent,#000_16%)]">
          <div
            aria-hidden
            className="absolute inset-x-[7%] bottom-0 top-[12%] overflow-hidden rounded-t-full border border-b-0 border-line bg-[linear-gradient(to_bottom,var(--accent-soft),transparent_90%)]"
          >
            <div className="absolute left-1/2 top-[4%] aspect-square w-[78%] -translate-x-1/2 rounded-full border border-accent/15" />
            <div className="absolute left-1/2 top-[14%] aspect-square w-[52%] -translate-x-1/2 rounded-full border border-accent/15" />
          </div>
          <div className="absolute inset-x-[7%] inset-y-0 overflow-x-clip">
            <Image
              src={doctor.photo}
              alt={`${doctor.name} in surgical scrubs`}
              width={1352}
              height={1608}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 560px, 100vw"
              className="portrait absolute bottom-0 left-[-12%] h-[96%] w-auto max-w-none"
            />
          </div>
        </div>

        <div className="absolute left-0 top-[27%] hidden items-center gap-3 sm:flex rounded-2xl border border-line bg-surface/85 p-2.5 pr-4 shadow-soft backdrop-blur-md">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-ink">
            <MedalIcon size={20} weight="fill" aria-hidden />
          </span>
          <span>
            <span className="block text-lg font-semibold leading-tight">{doctor.experienceYears}+ years</span>
            <span className="block text-xs text-muted">in urology</span>
          </span>
        </div>

        <div className="absolute right-0 top-[50%] w-[46%] max-w-[220px] rounded-2xl border border-line bg-surface/85 p-3.5 shadow-soft backdrop-blur-md">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <HospitalIcon size={18} weight="duotone" className="text-accent" aria-hidden />
            Omar Hospital
          </p>
          <p className="mt-1 text-xs leading-snug text-muted">
            {formatDays(omar.days)}
            <br />
            {formatTime(omar.open!)} to {formatTime(omar.close!)}
          </p>
          <div className="mt-2.5 empty:hidden">
            <ClinicStatus clinic={omar} />
          </div>
        </div>

        <div className="absolute bottom-[3%] left-0 w-[46%] max-w-[220px] overflow-hidden rounded-3xl border border-line bg-surface/80 shadow-soft backdrop-blur-md">
          <div className="relative aspect-square sm:aspect-[1/1.05]">
            <HeroKidney />
          </div>
          <Link
            href="/treatments/laser-stone-surgery"
            className="group block border-t border-line px-3 py-2.5 transition-colors hover:bg-surface-2 sm:px-3.5"
          >
            <span className="flex items-center justify-between gap-2 text-[13px] font-semibold sm:text-sm">
              Laser stone surgery
              <ArrowRightIcon
                size={14}
                weight="bold"
                className="hidden shrink-0 text-accent transition-transform group-hover:translate-x-0.5 sm:block"
                aria-hidden
              />
            </span>
            <span className="block text-xs text-muted">Tap a stone to break it</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

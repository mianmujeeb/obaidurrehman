import Image from "next/image";
import { GraduationCapIcon, SealCheckIcon, TrophyIcon, UsersThreeIcon } from "@phosphor-icons/react/ssr";
import { alsoServed, awards, career, doctor, memberships } from "@/lib/doctor";
import { BrandMark } from "../brand-mark";
import { MoreLink } from "../more-link";
import { Reveal, TiltCard, Timeline } from "../motion";

/** Profile section. The home page shows a summary; `full` adds memberships, awards and past posts. */
export function About({ full = false }: { full?: boolean }) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <CredentialCard />
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <h2 className="max-w-[20ch] text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              Ten years of urology, from district hospital to teaching hospital.
            </h2>
            <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted">
              Dr. Obaid trained at King Edward Medical University and qualified as an FCPS urologist in 2021.
              Clinical interests include kidney stones, prostate disease, urological cancers and male
              infertility, alongside renal transplant work.
            </p>
          </Reveal>

          <div className="mt-12">
            <Timeline items={career} />
          </div>

          {full ? (
            <Credentials />
          ) : (
            <Reveal className="mt-12">
              <MoreLink href="/about">Full profile and clinics</MoreLink>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <Reveal className="mt-14 grid gap-8 sm:grid-cols-2">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <UsersThreeIcon size={18} weight="duotone" className="text-accent" aria-hidden />
          Memberships
        </h3>
        <ul className="mt-3 space-y-2 text-muted">
          {memberships.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <TrophyIcon size={18} weight="duotone" className="text-accent" aria-hidden />
          Awards
        </h3>
        <ul className="mt-3 space-y-2 text-muted">
          {awards.map((a) => (
            <li key={a.title}>
              {a.title}, {a.year}
            </li>
          ))}
        </ul>
      </div>
      <div className="sm:col-span-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <GraduationCapIcon size={18} weight="duotone" className="text-accent" aria-hidden />
          Also served at
        </h3>
        <ul className="mt-3 space-y-2 text-muted">
          {alsoServed.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function CredentialCard() {
  return (
    <TiltCard className="overflow-hidden rounded-3xl bg-accent text-accent-ink shadow-soft [--spot:rgb(255_255_255/0.18)]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,rgb(255_255_255/0.16),transparent_55%),radial-gradient(90%_70%_at_0%_100%,rgb(0_0_0/0.18),transparent_60%)]"
      />
      <BrandMark className="absolute -bottom-10 -right-8 size-56 opacity-[0.09]" />

      {doctor.photo && (
        <div className="relative aspect-[4/3]">
          <Image src={doctor.photo} alt={doctor.name} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      )}

      <div className="relative p-7 sm:p-9 [transform:translateZ(40px)]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-ink/15 px-3 py-1 text-xs font-semibold">
          <SealCheckIcon size={16} weight="fill" aria-hidden />
          PMDC verified
        </span>
        <p className="mt-6 text-3xl font-semibold tracking-tight">{doctor.name}</p>
        <p className="mt-1 opacity-85">{doctor.title}</p>

        <ul className="mt-7 flex flex-wrap gap-2">
          {doctor.qualifications.map((q) => (
            <li key={q} className="rounded-full border border-accent-ink/25 px-3 py-1 text-sm">
              {q}
            </li>
          ))}
        </ul>

        <p className="mt-8 border-t border-accent-ink/20 pt-5 text-sm leading-relaxed opacity-90">
          {doctor.role}
          <br />
          Omar Hospital &amp; Cardiac Centre, Lahore
        </p>
      </div>
    </TiltCard>
  );
}

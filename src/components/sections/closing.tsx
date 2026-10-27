import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { clinics, doctor, links } from "@/lib/doctor";
import { BrandMark, LogoTile } from "../brand-mark";
import { BookButton } from "../booking";
import { Reveal } from "../motion";
import { InstallButton } from "../pwa/install";
import { ThemeSwitch } from "../theme-toggle";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-accent px-6 py-16 text-center text-accent-ink sm:px-12 md:py-24">
          <BrandMark className="absolute -left-10 -top-12 size-64 opacity-[0.08]" />
          <BrandMark className="absolute -bottom-16 -right-6 size-72 rotate-180 opacity-[0.08]" />
          <h2 className="relative mx-auto max-w-[22ch] text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Questions about your kidneys, bladder or prostate?
          </h2>
          <p className="relative mx-auto mt-5 max-w-[50ch] text-lg leading-relaxed opacity-90">
            Book a clinic visit in Lahore or a video consultation from home.
          </p>
          <BookButton variant="inverse" className="relative mt-9 px-8 py-4 text-base" />
        </div>
      </Reveal>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-28 pt-14 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <LogoTile className="size-10" />
            <div className="leading-tight">
              <p className="font-semibold">{doctor.name}</p>
              <p className="text-sm text-muted">{doctor.qualifications.join(", ")}</p>
            </div>
          </div>
          <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-muted">
            Information on this website is general and is not a substitute for a medical consultation. In an
            emergency, go to the nearest hospital.
          </p>
          <InstallButton className="mt-6" label="Install the app" />
        </div>

        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold">Pages</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { href: "/about", label: "About" },
              { href: "/#treatments", label: "Treatments" },
              { href: "/reviews", label: "Reviews & FAQs" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-sm font-semibold">Clinics</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {clinics.map((c) => (
              <li key={c.id}>
                <span className="text-ink">{c.name}</span>
                {c.address && <span className="block">{c.address}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold">Profiles</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { href: links.oladoc, label: "Oladoc" },
              { href: links.marham, label: "Marham" },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted transition hover:text-accent"
                >
                  {l.label}
                  <ArrowUpRightIcon size={14} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 md:col-span-12">
          <p className="text-xs text-muted">&copy; {doctor.name}. All rights reserved.</p>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  );
}

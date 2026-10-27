import Link from "next/link";
import { CheckIcon } from "@phosphor-icons/react/ssr";
import { allServices, organs } from "@/lib/doctor";
import { procedureGuides } from "@/lib/treatments";
import { MoreLink } from "../more-link";
import { Reveal } from "../motion";

/** Conditions and procedures by area of the body, then the full published service list. */
export function Conditions() {
  return (
    <section id="conditions" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:col-span-7">
            What Dr. Obaid treats
          </h2>
          <p className="max-w-[48ch] text-lg leading-relaxed text-muted lg:col-span-5">
            Care for the kidneys, ureters, bladder and prostate, including men&apos;s health and fertility.
          </p>
        </Reveal>

        <ul className="mt-12 divide-y divide-line border-y border-line">
          {organs.map((o, i) => (
            <Reveal key={o.id} as="li" delay={i * 0.05} className="grid gap-6 py-9 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{o.name}</h3>
                <p className="mt-3 leading-relaxed text-muted">{o.summary}</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
                <div>
                  <h4 className="text-sm font-semibold">Conditions</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {o.conditions.map((c) => (
                      <li key={c} className="rounded-full bg-accent-soft px-3 py-1.5 text-sm">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Procedures</h4>
                  <ul className="mt-3 space-y-2.5">
                    {o.procedures.map((p) => {
                      const guide = procedureGuides[p];
                      return (
                        <li key={p} className="flex items-start gap-2 text-sm">
                          <CheckIcon size={16} weight="bold" className="mt-0.5 shrink-0 text-accent" aria-hidden />
                          {guide ? (
                            <Link
                              href={`/treatments/${guide}`}
                              transitionTypes={["nav-forward"]}
                              className="font-medium text-accent underline-offset-4 hover:underline"
                            >
                              {p}
                            </Link>
                          ) : (
                            p
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h3 className="text-xl font-semibold tracking-tight">Full list of services</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">As published on the doctor&apos;s Oladoc profile.</p>
            <MoreLink href="/#anatomy" back className="mt-6">
              Explore the 3D anatomy
            </MoreLink>
          </div>
          <ul className="flex flex-wrap content-start gap-2 lg:col-span-8">
            {allServices.map((s) => (
              <li key={s} className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

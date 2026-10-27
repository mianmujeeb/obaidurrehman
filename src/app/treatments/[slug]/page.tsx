import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowDownIcon, ArrowLeftIcon, InfoIcon, PlusIcon } from "@phosphor-icons/react/ssr";
import { BookButton } from "@/components/booking";
import { Reveal } from "@/components/motion";
import { PageFrame } from "@/components/page-frame";
import { FinalCta } from "@/components/sections/closing";
import { ProcedureFlow, RecoveryFlow } from "@/components/treatment-flow";
import { TreatmentIcon } from "@/components/treatment-icon";
import { TreatmentRail, type RailItem } from "@/components/treatment-rail";
import { doctor } from "@/lib/doctor";
import { getTreatment, treatments } from "@/lib/treatments";
import { siteUrl } from "@/lib/utils";

// Every page is prerendered and built entirely from its slug, so a Suspense
// fallback would only flash a skeleton and break the title/icon morph from the
// home page. Waiting for the (static) page keeps the transition intact.
export const instant = false;

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/treatments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return {};
  return {
    title: `${t.name} in Lahore`,
    description: t.summary,
    alternates: { canonical: `/treatments/${t.slug}` },
    openGraph: { title: `${t.name} | ${doctor.name}`, description: t.summary },
  };
}

export default async function TreatmentPage({ params }: PageProps<"/treatments/[slug]">) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) notFound();
  // Only what the rail cards show, to keep the client payload small.
  const others: RailItem[] = treatments
    .filter((o) => o.slug !== t.slug)
    .map((o) => ({
      slug: o.slug,
      scene: o.scene,
      name: o.name,
      short: o.short,
      facts: o.facts.filter((f) => f.label === "Hospital stay" || f.label === "Back to routine"),
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: t.name,
    description: t.summary,
    url: `${siteUrl}/treatments/${t.slug}`,
    procedureType: t.scene === "eswl" ? "https://schema.org/NoninvasiveProcedure" : "https://schema.org/SurgicalProcedure",
    howPerformed: t.steps.map((s) => s.body).join(" "),
    followup: t.recovery.map((r) => `${r.when}: ${r.what}`).join(" "),
  };

  return (
    <PageFrame current="treatments">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-24 md:px-8 md:pt-32">
        <Link
          href="/#treatments"
          transitionTypes={["nav-back"]}
          className="rise inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent"
        >
          <ArrowLeftIcon size={16} weight="bold" aria-hidden />
          All treatments
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <ViewTransition name={`icon-${t.slug}`} share="morph" default="none">
              <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
                <TreatmentIcon kind={t.scene} size={28} />
              </span>
            </ViewTransition>
            <ViewTransition name={`title-${t.slug}`} share="morph" default="none">
              <h1 className="mt-6 w-fit text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {t.name}
              </h1>
            </ViewTransition>
            <p
              className="rise mt-5 max-w-[56ch] text-lg leading-relaxed text-muted"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {t.summary}
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--i": 3 } as React.CSSProperties}>
              <BookButton className="px-7 py-3.5" />
              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold transition hover:border-accent hover:text-accent active:scale-[0.98]"
              >
                How it works
                <ArrowDownIcon size={16} weight="bold" className="transition-transform group-hover:translate-y-0.5" aria-hidden />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
              {t.facts.map((f, i) => (
                <div
                  key={f.label}
                  className="rise bg-surface p-5"
                  style={{ "--i": i + 2 } as React.CSSProperties}
                >
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="mt-1.5 font-semibold leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
              <InfoIcon size={16} className="mt-px shrink-0" aria-hidden />
              General guidance. Your own plan, timings and risks are discussed at consultation.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">How it works</h2>
          <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-muted">
            The 3D view follows each stage as you read.
          </p>
        </Reveal>
        <div className="mt-6 lg:mt-10">
          <ProcedureFlow treatment={t} />
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Who it helps</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {t.treats.map((c) => (
                <li key={c} className="rounded-full bg-accent-soft px-3.5 py-1.5 text-sm">
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-16">
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Recovery</h2>
          </Reveal>
          <div className="mt-12">
            <RecoveryFlow items={t.recovery} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="rounded-3xl bg-accent-soft p-7 sm:p-9">
              <h2 className="text-2xl font-semibold tracking-tight">Risks to know about</h2>
              <p className="mt-4 leading-relaxed">{t.risks}</p>
            </div>
          </Reveal>
          <Reveal className="faq lg:col-span-7" delay={0.08}>
            <h2 className="text-2xl font-semibold tracking-tight">Questions patients ask</h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {t.faqs.map((f, i) => (
                <details key={f.q} name="treatment-faq" className="group" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition duration-300 group-open:rotate-45 group-open:border-accent group-open:text-accent">
                      <PlusIcon size={16} weight="bold" aria-hidden />
                    </span>
                  </summary>
                  <p className="max-w-[65ch] pb-5 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <TreatmentRail items={others} />

      <FinalCta />
      {/* Built from constants in lib/treatments.ts; React escapes closing script tags. */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </PageFrame>
  );
}

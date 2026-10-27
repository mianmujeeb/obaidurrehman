import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/motion";
import { PageFrame, PageHero } from "@/components/page-frame";
import { FlowSection } from "@/components/scroll-flow";
import { FinalCta } from "@/components/sections/closing";
import { Faq, QuestionList } from "@/components/sections/faq";
import { Reviews } from "@/components/sections/reviews";
import { TreatmentIcon } from "@/components/treatment-icon";
import { doctor, faqs } from "@/lib/doctor";
import { treatments } from "@/lib/treatments";

export const metadata: Metadata = {
  title: "Reviews and questions",
  description: `Patient reviews of ${doctor.name} and answers to common questions about urology visits and treatments in ${doctor.city}.`,
  alternates: { canonical: "/reviews" },
};

const jumps = [
  { href: "#reviews", label: "Patient reviews" },
  { href: "#questions", label: "General questions" },
  { href: "#treatment-questions", label: "Treatment questions" },
];

// Mirrors every question shown on the page. Built from constants; React escapes closing script tags.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [...faqs, ...treatments.flatMap((t) => t.faqs)].map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function ReviewsPage() {
  return (
    <PageFrame current="reviews">
      <PageHero
        title="Reviews and questions"
        lead="What patients say after seeing Dr. Obaid, and answers to the questions asked most often before and after treatment."
      >
        <ul className="flex flex-wrap gap-2">
          {jumps.map((j) => (
            <li key={j.href}>
              <a
                href={j.href}
                className="group inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                {j.label}
                <ArrowDownIcon size={14} weight="bold" className="transition-transform group-hover:translate-y-0.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <FlowSection>
        <Reviews />
      </FlowSection>
      <FlowSection>
        <Faq id="questions" title="General questions" />
      </FlowSection>
      <FlowSection>
        <TreatmentQuestions />
      </FlowSection>
      <FlowSection>
        <FinalCta />
      </FlowSection>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </PageFrame>
  );
}

function TreatmentQuestions() {
  return (
    <section id="treatment-questions" className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">About treatments</h2>
            <p className="mt-5 max-w-[40ch] leading-relaxed text-muted">
              Each guide walks through the procedure in 3D, step by step, with recovery and risks.
            </p>
          </div>
        </Reveal>

        <div className="faq space-y-14 lg:col-span-8">
          {treatments.map((t) => (
            <Reveal key={t.slug}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="flex items-center gap-3 text-xl font-semibold tracking-tight">
                  <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
                    <TreatmentIcon kind={t.scene} size={20} />
                  </span>
                  {t.name}
                </h3>
                <Link
                  href={`/treatments/${t.slug}`}
                  transitionTypes={["nav-forward"]}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
                >
                  Full guide
                  <ArrowRightIcon size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
              <div className="mt-4">
                <QuestionList items={t.faqs} name={`faq-${t.slug}`} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

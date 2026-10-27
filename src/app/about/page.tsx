import type { Metadata } from "next";
import { SealCheckIcon } from "@phosphor-icons/react/ssr";
import { BookButton } from "@/components/booking";
import { PageFrame, PageHero } from "@/components/page-frame";
import { FlowSection } from "@/components/scroll-flow";
import { About } from "@/components/sections/about";
import { Clinics } from "@/components/sections/clinics";
import { FinalCta } from "@/components/sections/closing";
import { Conditions } from "@/components/sections/conditions";
import { doctor, ratings } from "@/lib/doctor";

export const metadata: Metadata = {
  title: "About",
  description: `${doctor.name}, ${doctor.title.toLowerCase()} in ${doctor.city}: training, experience, conditions treated and clinic timings.`,
  alternates: { canonical: "/about" },
};

const facts = [
  { label: "Experience", value: `${doctor.experienceYears} years in urology` },
  { label: "Patient rating", value: `${ratings.average} out of 5 on ${ratings.source}` },
  { label: "Current post", value: "Omar Hospital & Cardiac Centre" },
  { label: "Qualifications", value: doctor.qualifications.join(", ") },
];

export default function AboutPage() {
  return (
    <PageFrame current="about">
      <PageHero
        title={`About ${doctor.name}`}
        lead={`${doctor.title} and ${doctor.role} in ${doctor.city}, treating kidney stones, prostate disease, urological cancers and male infertility.`}
        aside={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface p-5">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="mt-1.5 font-semibold leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <div className="flex flex-wrap items-center gap-4">
          <BookButton className="px-7 py-3.5" />
          {doctor.pmdcVerified && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted">
              <SealCheckIcon size={18} weight="fill" className="text-accent" aria-hidden />
              PMDC verified
            </span>
          )}
        </div>
      </PageHero>

      <FlowSection>
        <About full />
      </FlowSection>
      <FlowSection>
        <Conditions />
      </FlowSection>
      <FlowSection>
        <Clinics />
      </FlowSection>
      <FlowSection>
        <FinalCta />
      </FlowSection>
    </PageFrame>
  );
}

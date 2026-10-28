import { ViewTransition } from "react";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { FlowRail, FlowSection } from "@/components/scroll-flow";
import { About } from "@/components/sections/about";
import { Anatomy } from "@/components/sections/anatomy";
import { Clinics } from "@/components/sections/clinics";
import { FinalCta, SiteFooter } from "@/components/sections/closing";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Reviews } from "@/components/sections/reviews";
import { Stats } from "@/components/sections/stats";
import { Treatments } from "@/components/sections/treatments";
import { SiteHeader } from "@/components/site-header";
import { clinics, doctor, links, organs } from "@/lib/doctor";
import { treatments } from "@/lib/treatments";
import { siteUrl } from "@/lib/utils";

const DAY_NAMES = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
} as const;

const main = clinics[0];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: doctor.name,
  description: `${doctor.title} in ${doctor.city}. ${doctor.role}.`,
  url: siteUrl,
  image: `${siteUrl}/icons/icon-512.png`,
  medicalSpecialty: "Urologic",
  hasCredential: doctor.qualifications,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 435, Block D, Phase 1, Johar Town",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: main.days.map((d) => DAY_NAMES[d]),
      opens: main.open,
      closes: main.close,
    },
  ],
  availableService: [
    ...treatments.map((t) => ({
      "@type": "MedicalProcedure",
      name: t.name,
      url: `${siteUrl}/treatments/${t.slug}`,
    })),
    ...organs.flatMap((o) => o.procedures.map((p) => ({ "@type": "MedicalProcedure", name: p }))),
  ],
  sameAs: [links.oladoc, links.marham, links.google],
};

const slide = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

export default function Home() {
  return (
    <>
      <SiteHeader current="home" />
      <ViewTransition enter={slide} exit={slide} default="none">
        <main id="main">
          <Hero />
          <Stats />
          <FlowSection>
            <About />
          </FlowSection>
          <FlowSection>
            <Anatomy />
          </FlowSection>
          <FlowSection>
            <Treatments />
          </FlowSection>
          <FlowSection>
            <Clinics more />
          </FlowSection>
          <FlowSection>
            <Reviews />
          </FlowSection>
          <FlowSection>
            <Faq more />
          </FlowSection>
          <FlowSection>
            <FinalCta />
          </FlowSection>
        </main>
      </ViewTransition>
      <SiteFooter />
      <FlowRail />
      <MobileActionBar />
      {/* Built from constants in lib/doctor.ts; React escapes closing script tags. */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </>
  );
}

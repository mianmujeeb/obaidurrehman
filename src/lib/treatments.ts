// Patient-facing treatment guides. General information only: timings and
// risks vary by patient and are confirmed at consultation.

export type SceneKind = "laser" | "pcnl" | "eswl" | "turp" | "lap" | "varicocele";

export type Treatment = {
  slug: string;
  scene: SceneKind;
  name: string;
  /** Short card copy for the home page bento. */
  short: string;
  /** Hero subtext on the detail page (keep under 25 words). */
  summary: string;
  facts: { label: string; value: string }[];
  treats: string[];
  /** Exactly four steps; each drives one stage of the 3D procedure scene. */
  steps: { title: string; body: string }[];
  recovery: { when: string; what: string }[];
  risks: string;
  faqs: { q: string; a: string }[];
};

export const treatments: Treatment[] = [
  {
    slug: "laser-stone-surgery",
    scene: "laser",
    name: "Laser stone surgery",
    short:
      "A thin scope reaches the stone through the natural urinary passage and a laser breaks it into dust. No cuts on the skin.",
    summary:
      "Ureteroscopy with laser lithotripsy: a fine scope reaches stones in the ureter or kidney and a laser breaks them up, with no cuts.",
    facts: [
      { label: "Anaesthesia", value: "General or spinal" },
      { label: "Hospital stay", value: "Usually same day or one night" },
      { label: "Incisions", value: "None" },
      { label: "Back to routine", value: "Often within a few days" },
    ],
    treats: ["Ureteric stones", "Small and medium kidney stones", "Stones that do not pass with medicine"],
    steps: [
      {
        title: "Through the natural passage",
        body: "Under anaesthesia, a thin scope is passed through the urethra and bladder into the ureter. No cuts are made on the skin.",
      },
      {
        title: "Finding the stone",
        body: "A camera at the tip shows the stone on a screen, so it can be reached in the ureter or inside the kidney.",
      },
      {
        title: "Breaking it with a laser",
        body: "Laser energy travels down a fine fibre and breaks the stone into dust and small pieces, which are rinsed out or removed with a tiny basket.",
      },
      {
        title: "A stent while it heals",
        body: "A soft temporary tube called a DJ stent is often placed to help the kidney drain while swelling settles. It is removed later in a short procedure.",
      },
    ],
    recovery: [
      { when: "Same day", what: "Most patients go home the same day or the next morning." },
      { when: "First few days", what: "Some burning, frequent urination or pink urine is common, especially with a stent." },
      { when: "Following weeks", what: "The stent is removed when your doctor advises, often within a few weeks." },
      { when: "Long term", what: "Drink plenty of water and follow up to discuss preventing new stones." },
    ],
    risks:
      "Possible issues include urine infection, bleeding, stent discomfort and, rarely, injury to the ureter. Your individual risks are explained before surgery.",
    faqs: [
      {
        q: "Will I need a stent?",
        a: "Often, yes. It depends on the stone's size, how long it was stuck and how the ureter looks during surgery.",
      },
      {
        q: "Can large kidney stones be treated this way?",
        a: "Small and medium stones often can. Very large stones are usually better treated with PCNL.",
      },
    ],
  },
  {
    slug: "pcnl",
    scene: "pcnl",
    name: "PCNL",
    short: "Large kidney stones removed through a small keyhole in the back.",
    summary:
      "Percutaneous nephrolithotomy removes large kidney stones through a keyhole of about one centimetre in the back.",
    facts: [
      { label: "Anaesthesia", value: "General" },
      { label: "Hospital stay", value: "Usually 1 to 3 days" },
      { label: "Incisions", value: "One keyhole, about 1 cm" },
      { label: "Back to routine", value: "Usually 1 to 2 weeks" },
    ],
    treats: ["Large kidney stones", "Staghorn stones", "Stones not cleared by other methods"],
    steps: [
      {
        title: "Precise access",
        body: "Guided by X-ray or ultrasound, a fine needle is passed through the back into the kidney, right where the stone sits.",
      },
      {
        title: "Creating a keyhole",
        body: "The track is gently widened to about a centimetre so a scope can enter the kidney.",
      },
      {
        title: "Breaking and removing the stone",
        body: "The stone is broken with laser or ultrasonic energy and the fragments are lifted out through the keyhole.",
      },
      {
        title: "Drainage and healing",
        body: "A small drainage tube or stent may stay for a short time. The keyhole heals with a small scar.",
      },
    ],
    recovery: [
      { when: "Days 1 to 3", what: "Hospital stay while drainage and pain are monitored." },
      { when: "First week", what: "Mild soreness around the keyhole is managed with tablets." },
      { when: "1 to 2 weeks", what: "Most people return to desk work and light activity." },
      { when: "Follow-up", what: "Imaging confirms the kidney is clear of stones." },
    ],
    risks:
      "Bleeding, infection and, uncommonly, injury to nearby organs. These are discussed in detail before surgery.",
    faqs: [
      {
        q: "Why PCNL rather than laser through the urethra?",
        a: "For large stones, PCNL usually clears the kidney in fewer sessions.",
      },
      { q: "Is the scar large?", a: "No. The keyhole is about a centimetre across." },
    ],
  },
  {
    slug: "shockwave-lithotripsy",
    scene: "eswl",
    name: "Shockwave lithotripsy",
    short: "Shock waves from outside the body break smaller stones so they can pass on their own.",
    summary:
      "ESWL focuses shock waves on a kidney stone from outside the body, breaking it into pieces small enough to pass.",
    facts: [
      { label: "Anaesthesia", value: "Pain relief, sometimes light sedation" },
      { label: "Hospital stay", value: "Day procedure" },
      { label: "Incisions", value: "None" },
      { label: "Back to routine", value: "Usually the next day" },
    ],
    treats: ["Smaller kidney stones", "Some upper ureteric stones"],
    steps: [
      {
        title: "Targeting the stone",
        body: "You lie on the treatment table while X-ray or ultrasound locks onto the stone's exact position.",
      },
      {
        title: "Focused shock waves",
        body: "The machine sends shock waves through the skin, focused on the stone. Most people feel a tapping sensation.",
      },
      {
        title: "The stone breaks up",
        body: "Over the session, repeated waves crack the stone into small fragments.",
      },
      {
        title: "Passing the fragments",
        body: "The fragments pass out in the urine over the following days and weeks, helped by plenty of fluids.",
      },
    ],
    recovery: [
      { when: "Same day", what: "Go home after the session." },
      { when: "Next few days", what: "Pink urine and a mild ache are common. Passing fragments can cause brief pain." },
      { when: "2 to 4 weeks", what: "An X-ray or ultrasound checks whether the stone has cleared." },
      { when: "If needed", what: "Some stones need a second session or a different treatment." },
    ],
    risks:
      "Bruising, blood in the urine, pain as fragments pass, and sometimes the need for repeat sessions or another treatment.",
    faqs: [
      {
        q: "Does ESWL work for every stone?",
        a: "No. Very hard, large or lower-kidney stones often respond better to laser surgery or PCNL.",
      },
      {
        q: "Is it painful?",
        a: "Most people feel tapping or mild discomfort, which is managed with pain relief.",
      },
    ],
  },
  {
    slug: "turp",
    scene: "turp",
    name: "TURP for enlarged prostate",
    short: "Prostate tissue blocking the flow is trimmed from the inside, through the urethra.",
    summary:
      "Transurethral resection of the prostate removes the tissue that blocks urine flow, working from inside with no cuts on the skin.",
    facts: [
      { label: "Anaesthesia", value: "Spinal or general" },
      { label: "Hospital stay", value: "Usually 1 to 3 days" },
      { label: "Incisions", value: "None" },
      { label: "Back to routine", value: "Light activity in 1 to 2 weeks" },
    ],
    treats: ["Enlarged prostate (BPH)", "Weak or interrupted stream", "Urine retention"],
    steps: [
      {
        title: "The blockage",
        body: "An enlarged prostate squeezes the urethra, slowing the stream and making it hard to empty the bladder.",
      },
      {
        title: "Reaching the prostate",
        body: "Under anaesthesia, a thin instrument called a resectoscope is passed through the urethra to the prostate.",
      },
      {
        title: "Trimming the tissue",
        body: "An electric loop trims away the obstructing inner tissue in small pieces and seals blood vessels as it goes.",
      },
      {
        title: "Flow restored",
        body: "A catheter drains the bladder for a day or two. Urine then flows through a wider channel.",
      },
    ],
    recovery: [
      { when: "Days 1 to 3", what: "Hospital stay with a catheter until the urine clears." },
      { when: "First 2 weeks", what: "Some urgency and blood in the urine can come and go." },
      { when: "4 to 6 weeks", what: "Avoid heavy lifting and straining while the area heals." },
      { when: "After healing", what: "The urine stream is usually noticeably stronger." },
    ],
    risks:
      "Bleeding, infection, temporary urgency, and retrograde ejaculation (semen passing back into the bladder) are known effects. These are discussed with you beforehand.",
    faqs: [
      {
        q: "Is surgery the only option?",
        a: "No. Many men start with medicines. Surgery is considered when symptoms are bothersome or medicines are not enough.",
      },
      {
        q: "Does TURP treat prostate cancer?",
        a: "No. TURP relieves blockage from enlargement. Prostate cancer is assessed and treated separately.",
      },
    ],
  },
  {
    slug: "laparoscopic-kidney-surgery",
    scene: "lap",
    name: "Laparoscopic kidney surgery",
    short: "Keyhole removal of a damaged kidney or kidney tumour, for a shorter recovery.",
    summary:
      "Laparoscopic nephrectomy removes a diseased kidney or tumour through small keyholes, usually with less pain than open surgery.",
    facts: [
      { label: "Anaesthesia", value: "General" },
      { label: "Hospital stay", value: "Usually 2 to 4 days" },
      { label: "Incisions", value: "3 to 4 keyholes, one slightly larger" },
      { label: "Back to routine", value: "Usually 3 to 6 weeks" },
    ],
    treats: ["Kidney tumours", "Non-functioning kidneys", "Kidneys damaged by long-standing blockage"],
    steps: [
      {
        title: "Small ports",
        body: "A few small keyholes are made in the abdomen and the space is gently filled with gas to make room to work.",
      },
      {
        title: "Camera and instruments",
        body: "A camera gives a magnified view while fine instruments work through the other ports.",
      },
      {
        title: "Freeing the kidney",
        body: "The kidney's blood vessels and ureter are sealed and divided, and the kidney is freed from surrounding tissue.",
      },
      {
        title: "Removal and closure",
        body: "The kidney is placed in a bag and removed through one slightly larger cut, then the keyholes are closed.",
      },
    ],
    recovery: [
      { when: "Days 1 to 4", what: "Walking starts early. Most people go home within a few days." },
      { when: "2 weeks", what: "Wound soreness eases and light activity resumes." },
      { when: "4 to 6 weeks", what: "Return to most normal activities, including work." },
      { when: "Follow-up", what: "Tissue results and kidney function are reviewed with you." },
    ],
    risks:
      "Bleeding, infection, injury to nearby organs and, occasionally, the need to switch to open surgery.",
    faqs: [
      {
        q: "Can I live normally with one kidney?",
        a: "Most people with one healthy kidney lead a normal life. Kidney function is checked over time.",
      },
      {
        q: "Can only part of the kidney be removed?",
        a: "For some small tumours, yes. It depends on the tumour's size and position.",
      },
    ],
  },
  {
    slug: "varicocele-microsurgery",
    scene: "varicocele",
    name: "Varicocele microsurgery",
    short: "Microsurgical repair of enlarged scrotal veins, a common treatable cause of male infertility.",
    summary:
      "Microsurgical varicocelectomy ties off enlarged veins above the testicle through a small groin incision, using an operating microscope.",
    facts: [
      { label: "Anaesthesia", value: "General or spinal" },
      { label: "Hospital stay", value: "Usually same day" },
      { label: "Incisions", value: "One small groin cut, 2 to 3 cm" },
      { label: "Back to routine", value: "Desk work in a few days" },
    ],
    treats: ["Varicocele", "Male infertility linked to varicocele", "Scrotal ache from enlarged veins"],
    steps: [
      {
        title: "Enlarged veins",
        body: "A varicocele is a cluster of swollen veins above the testicle. Pooled blood warms the area, which can affect sperm.",
      },
      {
        title: "Under the microscope",
        body: "Through a small groin cut, the spermatic cord is lifted and examined under an operating microscope.",
      },
      {
        title: "Tying the faulty veins",
        body: "The enlarged veins are tied off while the artery, lymph vessels and sperm duct are preserved.",
      },
      {
        title: "Healthy drainage",
        body: "Blood drains through normal veins instead. Semen quality is usually rechecked after about three months.",
      },
    ],
    recovery: [
      { when: "Same day", what: "Most patients go home a few hours after surgery." },
      { when: "First week", what: "Mild swelling and discomfort. Supportive underwear helps." },
      { when: "2 weeks", what: "Return to exercise when your doctor advises." },
      { when: "3 to 6 months", what: "Semen analysis to assess improvement." },
    ],
    risks:
      "Fluid collection around the testicle (hydrocele), recurrence and infection are uncommon. Microsurgery helps keep these low.",
    faqs: [
      {
        q: "Does every varicocele need surgery?",
        a: "No. Surgery is usually advised for infertility with abnormal semen results, pain, or a shrinking testicle.",
      },
      {
        q: "When might fertility improve?",
        a: "Sperm take about three months to develop, so changes are assessed from around three months onwards.",
      },
    ],
  },
];

export function getTreatment(slug: string) {
  return treatments.find((t) => t.slug === slug);
}

/** Procedure names in the anatomy explorer that have their own guide. */
export const procedureGuides: Record<string, string> = {
  "PCNL (keyhole stone removal)": "pcnl",
  "Shockwave lithotripsy (ESWL)": "shockwave-lithotripsy",
  "Laparoscopic nephrectomy": "laparoscopic-kidney-surgery",
  Ureteroscopy: "laser-stone-surgery",
  "Laser lithotripsy": "laser-stone-surgery",
  TURP: "turp",
  "Varicocele microsurgery": "varicocele-microsurgery",
};

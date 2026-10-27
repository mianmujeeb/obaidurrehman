// Single source of truth for every fact shown on the site.
// Compiled from the doctor's Oladoc and Marham profiles (October 2026).
// Fields marked VERIFY differ between the two platforms; confirm with the clinic.

export const doctor = {
  name: "Dr. Obaid Ur Rehman",
  shortName: "Dr. Obaid",
  title: "Consultant Urologist",
  role: "Assistant Professor of Urology and Renal Transplantation",
  qualifications: ["MBBS (KEMU)", "FCPS (Urology)", "CHPE (LUMS)"],
  experienceYears: 10,
  city: "Lahore",
  pmdcVerified: true,
  // Set to a path in /public (e.g. "/images/dr-obaid.jpg") to show a portrait.
  photo: null as string | null,
  interests: ["Kidney stones", "Prostate disease", "Uro-oncology", "Male infertility"],
};

export const ratings = {
  source: "Oladoc",
  average: 4.9,
  reviews: 212,
  satisfied: 98,
  waitMinutes: 15,
};

export const links = {
  oladoc: "https://oladoc.com/pakistan/lahore/dr/urologist/obaid-ur-rehman-urologist/2532400",
  marham: "https://www.marham.pk/doctors/lahore/urologist/dr-obaid-ur-rehman",
};

export const phones = {
  // Booking helplines published on the doctor's profiles. Replace with the
  // clinic's direct number or WhatsApp once available.
  oladoc: { label: "Oladoc booking line", display: "042 3890 0939", tel: "+924238900939" },
  marham: { label: "Marham booking line", display: "042 3450 0888", tel: "+924234500888" },
};

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export const WEEK: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type Clinic = {
  id: string;
  name: string;
  kind: "in-person" | "video";
  address?: string;
  mapsQuery?: string;
  days: Weekday[];
  // 24h "HH:MM", Asia/Karachi. Omitted when the platforms do not list hours.
  open?: string;
  close?: string;
  hoursNote?: string;
  fee: number;
  bookVia: { label: string; href: string };
  phone: (typeof phones)[keyof typeof phones];
};

export const clinics: Clinic[] = [
  {
    id: "omar",
    name: "Omar Hospital & Cardiac Centre",
    kind: "in-person",
    address: "Plot 435, Block D, Phase 1, Johar Town, Lahore",
    mapsQuery: "Omar Hospital and Cardiac Centre, Johar Town, Lahore",
    days: ["Mon", "Tue", "Wed", "Thu", "Sat"],
    // VERIFY: Oladoc lists 3:30 to 5:00 PM, Marham lists 3:00 to 5:00 PM.
    open: "15:30",
    close: "17:00",
    // VERIFY: Rs. 4,000 on Oladoc, Rs. 3,500 on Marham.
    fee: 4000,
    bookVia: { label: "Book on Oladoc", href: links.oladoc },
    phone: phones.oladoc,
  },
  {
    id: "video",
    name: "Online video consultation",
    kind: "video",
    days: ["Mon", "Tue", "Wed", "Thu"],
    open: "21:00",
    close: "23:00",
    fee: 2500,
    bookVia: { label: "Book on Marham", href: links.marham },
    phone: phones.marham,
  },
  {
    id: "hameedah",
    name: "Hameedah Memorial Hospital",
    kind: "in-person",
    address: "Valencia Housing Society, Lahore",
    mapsQuery: "Hameedah Memorial Hospital, Valencia Town, Lahore",
    days: [],
    hoursNote: "Call to confirm the clinic days and time.",
    fee: 2500,
    bookVia: { label: "Book on Marham", href: links.marham },
    phone: phones.marham,
  },
];

export const career = [
  {
    period: "2014",
    title: "MBBS",
    place: "King Edward Medical University, Lahore",
  },
  {
    period: "2021",
    title: "FCPS in Urology",
    place: "College of Physicians and Surgeons Pakistan, trained at KEMU",
  },
  {
    period: "2021 to 2023",
    title: "District Urologist",
    place: "DHQ Hospital, Toba Tek Singh",
  },
  {
    period: "2023 to now",
    title: "Senior Registrar, Urology and Renal Transplant",
    place: "Sir Ganga Ram Hospital, Lahore",
  },
  {
    period: "2025 to now",
    title: "Assistant Professor of Urology and Renal Transplantation",
    place: "Omar Hospital & Cardiac Centre, Lahore",
  },
];

export const alsoServed = [
  "Registrar, National Institute of Kidney Diseases, Shaikh Zayed Hospital",
  "Consultant Urologist, Akhtar Saeed Trust Hospital",
];

export const awards = [
  { year: "2019", title: "Best Presenter" },
  { year: "2015", title: "Distinction" },
];

export const memberships = ["Pakistan Association of Urological Surgeons", "Pakistan Medical Commission"];

export type OrganId = "kidney" | "ureter" | "bladder" | "prostate";

export const organs: {
  id: OrganId;
  name: string;
  summary: string;
  conditions: string[];
  procedures: string[];
}[] = [
  {
    id: "kidney",
    name: "Kidneys",
    summary:
      "The kidneys filter blood and make urine. Stones, blockages and tumours here often show up as flank pain or blood in the urine.",
    conditions: ["Kidney stones", "Kidney pain", "Kidney tumours and cancer", "Kidney failure", "PUJ obstruction"],
    procedures: [
      "PCNL (keyhole stone removal)",
      "Shockwave lithotripsy (ESWL)",
      "Laparoscopic nephrectomy",
      "Pyeloplasty",
      "Pyelolithotomy",
    ],
  },
  {
    id: "ureter",
    name: "Ureters",
    summary:
      "Two narrow tubes carry urine from each kidney to the bladder. A stone stuck here causes the sharp, wave-like pain known as renal colic.",
    conditions: ["Ureteric stones", "Urine blockage", "Renal colic"],
    procedures: ["Ureteroscopy", "Laser lithotripsy", "Ureteric (DJ) stent"],
  },
  {
    id: "bladder",
    name: "Bladder and urethra",
    summary:
      "The bladder stores urine and the urethra drains it. Burning, frequent urination, blood in the urine or a weak stream can start here.",
    conditions: [
      "Urinary tract infection",
      "Blood in urine",
      "Bladder stones",
      "Urethral stricture",
      "Bedwetting",
      "Bladder tumours",
    ],
    procedures: [
      "Cystoscopy",
      "Endoscopic laser stricture surgery",
      "Urethral dilatation",
      "Suprapubic cystostomy",
      "Cystectomy",
    ],
  },
  {
    id: "prostate",
    name: "Prostate and men's health",
    summary:
      "An enlarged prostate is common with age and can slow the urine stream. This area also covers fertility, hormones and sexual health.",
    conditions: [
      "Enlarged prostate (BPH)",
      "Prostate cancer",
      "Male infertility",
      "Varicocele",
      "Erectile dysfunction",
      "Undescended testicle",
      "Low testosterone",
    ],
    procedures: [
      "TURP",
      "Radical prostatectomy",
      "Varicocele microsurgery",
      "Orchiopexy",
      "Testicular biopsy",
      "Penile implants",
      "Vasectomy",
    ],
  },
];

// Full service list as published on Oladoc.
export const allServices = [
  "Blood in urine",
  "Cystectomy",
  "Cystoscopy",
  "Endourology and laser surgery",
  "Erectile dysfunction",
  "Shockwave lithotripsy (ESWL)",
  "Fistulae and slings",
  "Foley catheterisation",
  "Infertility treatment",
  "Kidney cancer",
  "Kidney failure",
  "Kidney pain",
  "Laparoscopic nephrectomy",
  "Laser lithotripsy",
  "Nephrectomy",
  "Orchitis treatment",
  "Penile implants",
  "PCNL",
  "Prostate procedures",
  "Prostatectomy",
  "Pyelolithotomy",
  "Pyeloplasty",
  "Radical prostatectomy",
  "Sexual medicine",
  "Suprapubic cystostomy",
  "Testicular biopsy",
  "TURP",
  "Orchiopexy",
  "Ureteroscopy and stenting",
  "Urethral dilatation",
  "Urethral stricture laser surgery",
  "Varicocele microsurgery",
  "Vasectomy",
];

export const reviews = [
  {
    quote: "It was a lovely experience to see Dr sab. He was such an experienced person.",
    name: "Muhammad",
    via: "Verified patient, Oladoc",
  },
  {
    quote: "He is a good experienced doctor.",
    name: "Ahsan",
    via: "Verified patient, Oladoc",
  },
  {
    quote: "I am satisfied with the doctor.",
    name: "O. T.",
    via: "Verified patient, Marham",
  },
];

export const faqs = [
  {
    q: "When should I see a urologist?",
    a: "Book a visit for blood in the urine, pain or burning when passing urine, pain in the side or back, a weak or interrupted stream, repeated urine infections, or concerns about fertility or sexual health. If you have severe pain with fever, or cannot pass urine at all, go to an emergency department straight away.",
  },
  {
    q: "Does every kidney stone need surgery?",
    a: "No. Many small stones pass with fluids and medicine. Larger stones, or stones causing a blockage or infection, may need ESWL, laser surgery or PCNL. The right option depends on the stone's size and position, which is assessed at your consultation.",
  },
  {
    q: "Can I consult online?",
    a: "Yes. Video consultations run Monday to Thursday, 9:00 PM to 11:00 PM, and can be booked through Marham.",
  },
  {
    q: "What should I bring to my appointment?",
    a: "Bring previous reports, ultrasound or CT scans, recent urine and blood tests, and a list of the medicines you take. Arriving a few minutes early helps the clinic stay on time.",
  },
  {
    q: "How do I book?",
    a: "Use the Book appointment button to choose a clinic or video visit. You can book online through Oladoc or Marham, or call their booking line.",
  },
];

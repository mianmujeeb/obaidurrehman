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
  // Cut-out portrait (transparent background) in /public, shown in the hero and
  // the profile card. Set to null to hide it.
  photo: "/images/dr-obaid-ur-rehman.webp" as string | null,
  interests: ["Kidney stones", "Prostate disease", "Uro-oncology", "Male infertility"],
};

export const ratings = {
  source: "Oladoc",
  average: 4.9,
  reviews: 213,
  satisfied: 98,
  waitMinutes: 15,
};

export const links = {
  oladoc: "https://oladoc.com/pakistan/lahore/dr/urologist/obaid-ur-rehman-urologist/2532400",
  marham: "https://www.marham.pk/doctors/lahore/urologist/dr-obaid-ur-rehman",
  // Google Business Profile (Place ID ChIJd7mKOV2QrEMRDIeg1nVqN3c).
  google: "https://maps.google.com/?cid=8590451868577072908",
};

export const phones = {
  // Appointment line on Omar Hospital's poster for the doctor and on his Google
  // listing (October 2026). Used by the hero's call button.
  clinic: { label: "Appointments, Omar Hospital", display: "0340 9531000", tel: "+923409531000" },
  // Booking helplines published on the doctor's profiles.
  oladoc:{ label: "Oladoc booking line", display: "042 3890 0939", tel: "+924238900939" },
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

export type ReviewSource = "oladoc" | "marham" | "google";
export const reviewSourceName: Record<ReviewSource, string> = { oladoc: "Oladoc", marham: "Marham", google: "Google" };

/**
 * Rating summary per platform (October 2026). Google's figures are replaced by
 * live ones when the Places API is configured (lib/google-reviews.ts).
 */
export const reviewPlatforms = {
  oladoc: { name: "Oladoc", rating: ratings.average, count: ratings.reviews, url: links.oladoc },
  marham: { name: "Marham", rating: 5, count: 1, url: `${links.marham}/reviews` },
  google: { name: "Google", rating: 5, count: 33, url: links.google },
};

export type Review = {
  name: string;
  text: string;
  source: ReviewSource;
  /** Star rating where the platform gives one per review. */
  rating?: number;
  /** Oladoc asks "Do you recommend the doctor?" instead of stars. */
  recommends?: boolean;
  date?: string;
  link?: string;
  /** Google's own translation of a review written in another language. */
  translated?: boolean;
  /** Shown on the home page; the reviews page shows all. */
  featured?: boolean;
};

// Every written review on the public profiles, verbatim (October 2026), with
// markdown symbols removed. Most of the 213 Oladoc ratings were left without a
// comment. Google and Oladoc only show relative dates ("a year ago"), so none
// are stored for those.
export const reviews: Review[] = [
  // Google Business Profile, all 33 (5.0 average).
  { name: "Tahawur Ali", text: "Best surgeon out there. I'd a stone above 15mm and needed an urgent surgery when we contacted Dr Obaid. He was really good and professional. Really recommend him.", source: "google", rating: 5 },
  { name: "Momina Hameed", text: "The best surgeon in Lahore , very good behavior, humble doctor, and the best experience. The way they treat their patients, half the illness goes away instantly. They are very cooperative.", source: "google", rating: 5 },
  { name: "Hafiz Shahid", text: "Thanks for the surgery of my baby girl 4 yr she had stones n kidney were blocked , Dr obaid sb did camera surgery n now she is alright. Very kind dr", source: "google", rating: 5 },
  { name: "Firdous Khan", text: "Assalam alekum, I was suffering from the problem of urinary frequency for the last 3 years which had become very excessive and I was in trouble. I got checked by many doctors i.e. three or four doctors but I was not satisfied. When I got checked by Dr. Obaidur Rahman, after that I felt much more loyal and without any medicine, now I am fine Alhamdulillah. I am very thankful to Doctor Saheb for playing, he is a very good and capable person, may Allah give him life.", source: "google", rating: 5 },
  { name: "AyeshaUmar 420", text: "Dr. Obaid treated my maternal grandfather for prostate gland problems. He explained the condition clearly, guided us step by step, and dealt with us very politely. He treated my Nana Abu like his own family. I am very satisfied with his treatment and highly recommend him for urology care in Lahore.", source: "google", rating: 5 },
  { name: "amina muattar", text: "My husband had a ureteric stone. Dr. Obaid ur Rehman treated him with a scopic kidney stone surgery (URS) without any cut or incision. Alhamdulillah everything went well. Doctor explained everything clearly and treated us with great care.\nHighly recommend", source: "google", rating: 5 },
  { name: "M Arshad", text: "I cannot express enough gratitude to the entire medical team for the exceptional care they provided to my son. From the moment we arrived, every staff member treated us with kindness, patience, and professionalism. The doctors explained the procedure clearly, answered all our questions, and reassured us every step of the way.", source: "google", rating: 5 },
  { name: "Dr Hafiz Wasif", text: "My uncle needed surgery for prostate problems and Dr. Obaid did an expert job, performed TURP prostate surgery.\nDischarged on next day. Alhamdulillah he is much better now.", source: "google", rating: 5 },
  { name: "Hina Patras", text: "My Aunt is under treatment by Dr abaid ur Rehman. very difficult to find a cooperative and understanding surgeon thank you so much Dr abaid ur Rehman for advising Kidney stone surgery in Lahore Successful pcnl\nHighly recommended\nGood behavior", source: "google", rating: 5 },
  {
    name: "Najaf Siyal",
    text: "For four years, I suffered from a massive 5cm kidney stone. Every hospital I went to only offered temporary fixes that never worked. I was in constant pain and had a broken, old stent inside me that nobody would remove.\n\nThen I found Dr. Obaid Ur Rehman, a urologist in Lahore. He was different. He didn't suggest another round of breaking the stone. Instead, he recommended PCNL surgery—a single procedure to get it all out.\n\nHe explained PCNL in simple terms: it’s a minimally invasive surgery where they make a small keyhole in the back to remove the entire stone directly from the kidney. It’s a one-time solution for large stones.\n\nThe result was amazing. In one operation, Dr. Obaid:\n• Removed my entire 5cm stone.\n• Took out the old, broken stent.\n• Placed a new, clean stent.\n\nThe constant pain I lived with for years vanished immediately. If you have a large kidney stone that other treatments can't fix, don't lose hope. PCNL surgery with Dr. Obaid Ur Rehman was the complete and permanent solution I needed.\n\nHighly recommended for complex kidney stone problems!",
    source: "google",
    rating: 5,
  },
  { name: "Dr. Behram Subazwari", text: "Highly Recommended and Very competent and Best Urologist in lahore. No doubt Dr Obaid Ur Rehman is Top one Prostate Surgeon in Pakistan. Great. Highly appreciate to you.", source: "google", rating: 5 },
  { name: "razaq Nazar", text: "My brother had problem in his urine pipe urethral stricture and it had some blockage and the doctor advised to get his camera surgery thank God now he is fine my brother recovered well I'm very grateful to talk some for treating his disease", source: "google", rating: 5 },
  { name: "NASIR MUNIR", text: "My father in law is under treatment by Dr obaid ur Rehman, for prostate issue for last 2 years,many doctors advised surgery but Dr obaid advised treatment and he is doing very well. He is great doctor very kind and highly recommended.", source: "google", rating: 5 },
  { name: "Muhammad Akram", text: "Very Difficult to find of a cooperative and understanding surgeon . much thanks to Dr obaid for advising best care to me. I had a prostate surgery and then bladder stone surgery.", source: "google", rating: 5 },
  { name: "Jakhar Zada", text: "Nice doctr, my mamo he travelled for his kidney stone surgery in lahore, highly recommended", source: "google", rating: 5 },
  { name: "Muhammad Tayyab", text: "Thanks doc, my semen report normal after medcn", source: "google", rating: 5 },
  { name: "M. Ateeq", text: "I'm very impressed of Dr obaid ur Rehman urologist behavior and good counseling", source: "google", rating: 5 },
  { name: "Hamza Hr", text: "Very nice doctor with positive energy, guided in detail about surgery, thankyou", source: "google", rating: 5 },
  { name: "Waheed Murad", text: "Thank you very nice behaviour and doctor explained in detail", source: "google", rating: 5 },
  { name: "Sufyan Jutt", text: "Assalamu Alikum, this is my experience, mother took her father to the doctor, he treated him very well and gave me good advice and Mashallah, he is a very capable doctor, you should also visit him once.", source: "google", rating: 5, translated: true },
  { name: "z production", text: "Mash Allah boat is a good and qualified surgeon, he operated on my friend's urinary tract, Alhadolillah, now he is there, he was given the jaw by the doctors of Bahrain.", source: "google", rating: 5, translated: true },
  { name: "Muhammad Shakeel", text: "Dr Obaid ur Rehman shb\nGreat experience with Dr Shb", source: "google", rating: 5 },
  { name: "Noorulain Liaqat Ali", text: "Very cooperative and skilled doctor. Recommended", source: "google", rating: 5 },
  { name: "Marryam Amjad", text: "Very professional Doctor\nHighly recommended .", source: "google", rating: 5 },
  { name: "Shahid Saleem", text: "Mashallah very kind and compident surgeon of urology", source: "google", rating: 5 },
  { name: "Safyan Bhatti", text: "Mashallah nice person and good good urological surgeon", source: "google", rating: 5 },
  { name: "Anas Malik", text: "Mashallah very competent surgeon", source: "google", rating: 5 },
  { name: "Nasirjamil Nasir", text: "Nice person", source: "google", rating: 5 },
  { name: "Rafaqat Masih", text: "God bless, good experience", source: "google", rating: 5 },
  { name: "waseem ahmad18", text: "Very good experience 💯", source: "google", rating: 5 },
  { name: "Anum saleem", text: "Recommended!!!", source: "google", rating: 5 },
  { name: "Mumtaz Kanju", text: "Thankyou", source: "google", rating: 5 },
  { name: "SHAHID Saab", text: "thank you", source: "google", rating: 5 },

  // Oladoc and Marham.
  {
    name: "Muhammad",
    text: "It was a lovely experience to see Dr sab. He was such an experienced person, with a very easy approach to let you understand the matter. I am really satisfied to see him.",
    source: "oladoc",
    recommends: true,
    featured: true,
  },
  { name: "Ahsan", text: "He is a good experienced doctor.", source: "oladoc", recommends: true, featured: true },
  { name: "O. T.", text: "I am satisfied with the doctor.", source: "marham", rating: 5, date: "Feb 2026", featured: true },
  { name: "Azeem", text: "Thank you.", source: "oladoc", recommends: true },
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

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  Check,
  Clock,
  Globe2,
  Lock,
  Plus,
  ShieldCheck,
  Undo2,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Section, { AnswerBox, InfoTable } from "@/components/Section";
import IcaoPhotoTool from "@/components/IcaoPhotoTool";
import { PRICING } from "@/lib/config/pricing";
import { HERO_IMAGE, SITE_URL } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Metadata                                                             */
/* ------------------------------------------------------------------ */

/** Update whenever the content is re-checked against official sources. */
const LAST_REVIEWED = { iso: "2026-11-25", label: "25 November 2026" };

/**
 * Main keyword: "ICAO standard photograph". The generic "passport photo checker"
 * query belongs to /passport-photo-checker, so this page does not target it.
 */
const PAGE_TITLE = "ICAO Standard Photograph Online — Fix “Photo Not Valid”";
const PAGE_DESCRIPTION =
  "Check and convert any photo to ICAO Doc 9303 standards online. Fix “photo is not valid as per ICAO standards” for 50+ countries with a free instant preview.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "ID Photo Maker",
    locale: "en_GB",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */

const ERROR_MESSAGES = [
  {
    message: "Photo is not valid as per ICAO standards",
    meaning:
      "The portal’s automatic checker found at least one problem: face too small or too large, background not plain white, shadows, tilt or the wrong size.",
    fix: "Re-make the photo at the exact size with a white background and the face filling 80–85% of the height.",
  },
  {
    message: "Posture check failed. Please upload another photo",
    meaning:
      "Your head is tilted, turned, or your shoulders are not square to the camera. Image quality is not the issue.",
    fix: "Retake facing the camera straight on, chin level, both ears equally visible.",
  },
  {
    message: "isMobileDeviceDetected failed. Please upload another photo",
    meaning:
      "The checker thinks the image is a phone screenshot or selfie: wide-angle distortion, arm-length framing or screen borders.",
    fix: "Ask someone to take the photo from 1–1.5 m away, then crop and resize it properly rather than uploading the raw selfie.",
  },
  {
    message: "Photo upload not working / stuck",
    meaning:
      "Usually the file is the wrong format, too large, or the pixel size does not match what the form expects.",
    fix: "Use a JPEG at the exact pixel size and under the file-size limit (250 KB for Passport Seva).",
  },
];

const REQUIREMENTS = [
  ["Face size", "Face (chin to crown) fills about 70–80% of the photo height. Indian Passport Seva 2.0 expects 80–85%.", "Scale and crop to the ratio for the country you choose."],
  ["Head position", "Face centred, looking straight at the camera, head not tilted or turned.", "Detect the eyes and centre the face; strong tilts are flagged so you can retake."],
  ["Background", "Plain, uniform and light: white or off-white, no patterns, objects or shadows.", "Remove the background and replace it with plain white."],
  ["Expression", "Neutral expression, mouth closed, both eyes open and clearly visible.", "Checked; we cannot change your expression, so retake if you are smiling."],
  ["Glasses", "Strongly discouraged; India, the UK and the US now require no glasses at all.", "Take glasses off before the photo. Glare on lenses is a top rejection reason."],
  ["Lighting", "Even light on the face, no shadows, no red-eye, natural skin tone.", "Balance exposure and colour without retouching facial features."],
  ["Head coverings", "Not allowed, except for religious or medical reasons, with the full face visible from chin to forehead.", "Supported when the face edges are visible."],
  ["Recency", "Taken within the last 6 months and showing your current appearance.", "Use a new photo; we never reuse old images."],
  ["File (digital)", "Set by each country, e.g. Passport Seva: JPEG, 630 × 810 px, up to 250 KB.", "Export at the exact pixel size as a compressed JPEG."],
];

const PHOTO_SIZES = [
  ["India (Passport Seva 2.0)", "35 × 45 mm (some missions abroad: 2 × 2 in)", "630 × 810 px, JPEG, ≤ 250 KB"],
  ["United Kingdom", "35 × 45 mm", "600 × 750 px minimum"],
  ["United States", "2 × 2 in (51 × 51 mm)", "600 × 600 px minimum"],
  ["Schengen / EU visa", "35 × 45 mm", "630 × 810 px"],
  ["Canada", "50 × 70 mm", "Set by the application form"],
  ["Australia", "35 × 45 mm", "413 × 531 px"],
  ["New Zealand", "35 × 45 mm", "900 × 1200 px minimum"],
  ["China", "33 × 48 mm", "420 × 560 px"],
];

const INDIA_SPECS = [
  ["Pixel size", "630 × 810 px (35 × 45 mm ratio, 7:9)"],
  ["File", "JPEG, up to 250 KB"],
  ["Face size", "Face fills 80–85% of the photo height"],
  ["Background", "Plain white, no shadows"],
  ["Glasses", "Not allowed (medical exceptions only)"],
  ["Recency", "Taken in the last 6 months"],
  ["Printed (where asked)", "35 × 45 mm, or 2 × 2 in at some missions abroad"],
];

const HOW_TO_STEPS = [
  {
    name: "Take a plain front-facing photo",
    text: "Stand about 1–1.5 m from the camera in even daylight. Face the lens, keep a neutral expression, eyes open, no glasses. Any background works.",
  },
  {
    name: "Upload it and choose your country",
    text: "Pick the passport, visa or ID you are applying for. We load that country’s ICAO size, face ratio and file rules.",
  },
  {
    name: "We fix it automatically",
    text: "The background is replaced with white, the face is centred and scaled, and the photo is resized to the exact pixels.",
  },
  {
    name: "Preview free, then download",
    text: "Compare before and after, then download the clean JPEG and a printable 6×4″ sheet, ready to upload to Passport Seva or any portal.",
  },
];

const COMPARISON = [
  ["Exact digital size for the portal", "Yes, per country", "Often print only", "Sometimes"],
  ["White background replacement", "Automatic", "Backdrop in studio", "Rarely"],
  ["Face ratio for Passport Seva 2.0 (80–85%)", "Yes", "Depends on studio", "Usually generic"],
  ["Preview before paying", "Free", "No", "Yes"],
  ["Human review option", "Expert plan", "Yes", "No"],
  ["Time", "About 1 minute", "Travel + wait", "Varies"],
  ["Watermark-free download", "After one payment", "Prints only", "Often watermarked or paid"],
];

const ACCEPTABLE = [
  "Recent colour photo, sharp and in focus",
  "Plain white or off-white background",
  "Face straight on, centred, neutral expression",
  "Both eyes open, hair away from eyes",
  "Even lighting with no shadows",
];

const REJECTED = [
  "Selfie at arm’s length (distorted face, “mobile device detected”)",
  "Smiling with teeth, head tilted, or looking away",
  "Glasses, glare, or a hat or cap",
  "Shadows on the face or behind the head",
  "Grey, patterned, or coloured background",
  "Old, filtered, edited or beauty-mode photo",
];

const INFANT_RULES = {
  acceptable: [
    "Baby lying on a plain white sheet, photographed from above",
    "Eyes open where possible (newborns are allowed some leniency)",
    "Face straight on, whole head visible",
  ],
  rejected: [
    "A parent’s hands, arms or shoulder in the frame",
    "Dummies, toys or bottles visible",
    "Baby in a car seat or with a patterned blanket behind",
  ],
};

const CLOUDINARY = "https://res.cloudinary.com/dipzpwbbk/image/upload";
const EXAMPLES = [
  {
    title: "Wall shadow and yellow tint removed",
    before: `${CLOUDINARY}/c_fill,g_face,w_420,h_540,q_auto,f_auto/v1786628280/before_uk_f24dre.jpg`,
    after: "/images/passport-photo-white-background-after.webp",
  },
  {
    title: "Tilted, off-centre head aligned",
    before: `${CLOUDINARY}/c_fill,g_face,w_420,h_540,q_auto,f_auto/v1786630383/1000383324_bxx77h.jpg`,
    after: `${CLOUDINARY}/c_fill,g_face,w_420,h_540,q_auto,f_auto/v1786630498/597e95e4-676d-41dd-be79-c45be7e07b04_photo_zm53xt.jpg`,
  },
  {
    title: "Harsh light and glare balanced",
    before: `${CLOUDINARY}/c_fill,g_face,w_420,h_540,q_auto,f_auto/v1786628395/before_us_phel7i.jpg`,
    after: `${CLOUDINARY}/c_fill,g_face,w_420,h_540,q_auto,f_auto/v1786628788/ulape_c0dexm.jpg`,
  },
];

const FAQS = [
  {
    question: "What is the ICAO standard for a photo?",
    answer:
      "An ICAO standard photograph is a passport or ID photo that follows the International Civil Aviation Organization’s Doc 9303 rules for machine-readable travel documents: plain light background, neutral face looking straight at the camera, eyes open, no shadows or glasses, and the face filling a fixed share of the frame so face-recognition gates can read it.",
  },
  {
    question: "What does “photo is not valid as per ICAO standards” mean?",
    answer:
      "It means the portal’s automatic checker compared your photo with the ICAO Doc 9303 photo rules and found a problem. The usual causes are a face that is too small or too large in the frame, a background that is not plain white, shadows, a tilted head, glasses, or the wrong pixel size. Fix those and upload again.",
  },
  {
    question: "Why does Passport Seva reject my photo when the image quality is fine?",
    answer:
      "The Passport Seva photo check looks at geometry, not only sharpness. A clear photo still fails if the face covers less than about 80% of the height, the head is tilted, or the background has shadows. Messages like “posture check failed” or “isMobileDeviceDetected failed” point to framing and posture, not quality.",
  },
  {
    question: "How do I check if my photo is ICAO compliant?",
    answer:
      "Upload it to the free ICAO photo checker at the top of this page. It checks the background, head size, eye line and pixel size for the country you choose and shows a corrected preview, so you can see the result before you submit it anywhere.",
  },
  {
    question: "What is the ICAO standard photo size?",
    answer:
      "ICAO does not set one size for every country. It sets the proportions and each country picks the physical and pixel size. The most common size is 35 × 45 mm. India’s online upload uses 630 × 810 px JPEG up to 250 KB, the UK uses 35 × 45 mm and the US uses 2 × 2 inches.",
  },
  {
    question: "How do I convert my photo to ICAO standard?",
    answer:
      "Take a front-facing photo in even light, upload it above and choose your country. We replace the background with white, centre and scale your face to the ICAO ratio, and resize it to the exact pixels. Preview it free, then download.",
  },
  {
    question: "What is the Indian passport photo size?",
    answer:
      "For online upload on Passport Seva, use a 630 × 810 pixel JPEG (35 × 45 mm ratio) up to 250 KB, with a white background and the face filling 80–85% of the height. Some Indian missions abroad still ask for 2 × 2 inch prints, so check your mission’s notice.",
  },
  {
    question: "Is the photo size different for Indian passport renewal?",
    answer:
      "No. A renewal (re-issue) uses the same ICAO photo rules and the same 630 × 810 px upload size as a new application. You need a new photo taken in the last 6 months; you cannot reuse the photo from your old passport.",
  },
  {
    question: "Why is my Passport Seva photo upload not working?",
    answer:
      "The most common reasons are a file over 250 KB, a PNG or HEIC file instead of JPEG, or pixel dimensions other than 630 × 810. Export the photo as a JPEG at the exact size and try again; clearing the browser cache or using a desktop browser also helps.",
  },
  {
    question: "Can you show an example of an ICAO photo?",
    answer:
      "Yes. The hero image and the before-and-after examples on this page show ICAO compliant photographs: plain background, centred face, neutral expression, and the head filling the frame between the guide lines.",
  },
  {
    question: "Can I wear glasses in an ICAO photo?",
    answer:
      "Avoid them. ICAO strongly discourages glasses, and India, the UK and the US do not accept them except for medical reasons with a doctor’s note. Glare on lenses is one of the most common rejection reasons.",
  },
  {
    question: "Are infant and baby photos held to ICAO standards?",
    answer:
      "Yes, with some leniency. Babies under about one year do not need a neutral expression or fully open eyes in every country, but the background must be plain and no hands, toys or dummies may be visible. Lay the baby on a white sheet and photograph from above.",
  },
  {
    question: "What if my photo is still rejected?",
    answer:
      "With the Expert plan, a person checks your photo before you get it, and we remake it free if an official portal rejects it. Email us the rejection message and your PayPal order reference.",
  },
  {
    question: "Do you store my photo?",
    answer:
      "Your photo is processed only to create your passport photo and is stored only as long as needed to deliver your download. We never sell it, share it, or use it to train models.",
  },
];

const SOURCES = [
  {
    name: "ICAO Doc 9303 — Machine Readable Travel Documents (photo specifications)",
    url: "https://www.icao.int/publications/pages/publication.aspx?docnum=9303",
  },
  {
    name: "Indian mission notice: Guidelines for ICAO-compliant photographs for passport applications",
    url: "https://eoimanila.gov.in//docs/Guidelines_for_ICAO_Compliant_Photographs_for_Passport_Applications.pdf",
  },
  {
    name: "Passport Seva — official portal (photo guidelines and notices)",
    url: "https://www.passportindia.gov.in/",
  },
  {
    name: "GOV.UK — Photos for passports",
    url: "https://www.gov.uk/photos-for-passports",
  },
  {
    name: "U.S. Department of State — Passport photo requirements",
    url: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function Tick({ tone = "amber" }: { tone?: "amber" | "red" }) {
  return (
    <span
      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
        tone === "amber" ? "bg-amber-400 text-black" : "bg-gray-200 text-gray-600"
      }`}
    >
      {tone === "amber" ? (
        <Check className="size-3" strokeWidth={3} aria-hidden="true" />
      ) : (
        <X className="size-3" strokeWidth={3} aria-hidden="true" />
      )}
    </span>
  );
}

function CheckList({ items, tone = "amber" }: { items: string[]; tone?: "amber" | "red" }) {
  return (
    <ul className="mt-5 flex flex-col gap-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-gray-700">
          <Tick tone={tone} />
          {t}
        </li>
      ))}
    </ul>
  );
}

const ctaClass =
  "group inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-black transition-colors hover:bg-amber-500 active:bg-amber-500 sm:py-3";
const ctaSecondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-medium text-black ring-1 ring-gray-200 transition-colors ring-inset hover:bg-gray-50 active:bg-gray-50 sm:py-3";

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function Home() {
  const stats = [
    { value: "50+", label: "countries and visa formats" },
    { value: "~1 min", label: "from upload to ICAO photo" },
    { value: "Free", label: "ICAO check and preview" },
    { value: "0", label: "accounts or subscriptions" },
  ];

  return (
    <>
      <JsonLd
        siteUrl={SITE_URL}
        pageName={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        dateModified={LAST_REVIEWED.iso}
        faqItems={FAQS}
        howToSteps={HOW_TO_STEPS}
        citations={SOURCES.map((s) => s.url)}
        topic="ICAO standard photograph"
        image={{ url: HERO_IMAGE.url, width: HERO_IMAGE.width, height: HERO_IMAGE.height, caption: HERO_IMAGE.alt }}
        supportEmail={PRICING.supportEmail}
      />
      <Navbar />

      <main id="main-content" className="flex flex-1 flex-col">
        {/* HERO */}
        <section className="relative isolate px-4 pt-24 pb-4 sm:px-6 sm:pt-32">
          <div className="absolute inset-x-2 top-2 bottom-0 -z-10 mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gray-100 sm:inset-x-6 sm:top-4 sm:rounded-[32px] lg:inset-x-12">
            <div className="bg-dots absolute inset-0" />
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-10 pb-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pb-14">
            <div className="text-center lg:text-left">
              <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/80 py-1 pr-3.5 pl-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200 backdrop-blur sm:text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-black text-white">
                  <Globe2 className="size-3.5" aria-hidden="true" />
                </span>
                <span className="truncate">ICAO Doc 9303 · Passport Seva 2.0 ready</span>
              </p>

              <h1 className="mt-5 text-[clamp(2.1rem,8.5vw,3.1rem)] leading-[1.05] font-bold tracking-[-0.03em] text-balance text-black sm:mt-6 lg:text-[3.6rem]">
                ICAO standard photograph,{" "}
                <span className="text-amber-600">
                  made online in a minute.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-gray-600 sm:text-lg lg:mx-0">
                Got <strong className="font-semibold text-black">“photo is not valid as per ICAO standards”</strong>?
                Upload the rejected photo and we turn it into an ICAO standard photograph with a white background,
                the right face size and exact pixels for Passport Seva, UK, US, Schengen and 50+ other countries.
              </p>

              <div className="mx-auto mt-7 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:justify-start">
                <a href="#make-photo" className={ctaClass}>
                  Upload your photo
                  <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                </a>
                <a href="#requirements" className={ctaSecondaryClass}>
                  See ICAO requirements
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                <span className="font-semibold text-black">Free ICAO check and preview</span> · no account needed
              </p>

              <ul className="mx-auto mt-6 grid max-w-xs gap-2 text-left text-sm text-gray-600 sm:max-w-none sm:grid-cols-3 sm:gap-3 sm:text-center lg:text-left">
                {[
                  { icon: ShieldCheck, text: "Built on ICAO Doc 9303" },
                  { icon: Lock, text: "Never sold or shared" },
                  { icon: Undo2, text: "Free remake if rejected" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 sm:justify-center lg:justify-start">
                    <Icon className="size-4 shrink-0 text-amber-600" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="relative mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[420px]">
              <Image
                src={HERO_IMAGE.url}
                alt={HERO_IMAGE.alt}
                width={HERO_IMAGE.width}
                height={HERO_IMAGE.height}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 360px, 300px"
                className="h-auto w-full"
              />
            </figure>
          </div>
        </section>

        {/* UPLOAD / CHECKER */}
        <Section
          id="make-photo"
          eyebrow="Free ICAO photo checker"
          title="Free ICAO standards photo checker online"
          subtitle="An online passport photo checker and maker in one: choose your country, upload any front-facing photo and preview a corrected ICAO compliant photograph free."
          className="scroll-mt-2 pt-8 sm:pt-10 lg:pt-12"
        >
          <div className="mx-auto max-w-3xl">
            {/* Static page: the tool looks up the visitor's country in the browser. */}
            <IcaoPhotoTool detectVisitorCountry />
            <p className="mt-4 text-center text-sm text-gray-600">
              Only want to test a photo you already have? Use the free{" "}
              <Link href="/passport-photo-checker" className="font-medium text-amber-700 underline-offset-4 hover:underline">
                passport photo checker
              </Link>
              .
            </p>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
              <Clock className="size-3.5 shrink-0" aria-hidden="true" />
              Rules checked against official sources on{" "}
              <time dateTime={LAST_REVIEWED.iso}>{LAST_REVIEWED.label}</time>
            </p>
          </div>
        </Section>

        {/* PROOF */}
        <section aria-label="At a glance" className="px-4 sm:px-6">
          <dl className="reveal mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-gray-200 ring-1 ring-gray-200 md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1 bg-white px-4 py-5 text-center sm:px-6 sm:py-7">
                <dt className="order-2 text-xs leading-snug text-pretty text-gray-500 sm:text-sm">{label}</dt>
                <dd className="order-1 text-2xl font-bold tracking-tight tabular-nums sm:text-4xl">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* WHAT IS */}
        <Section id="what-is" eyebrow="The basics" title="What is an ICAO standard photograph?">
          <AnswerBox>
            An <strong>ICAO standard photograph</strong> is a passport, visa or ID photo that meets the{" "}
            <strong>International Civil Aviation Organization (ICAO)</strong> photo standards in Doc 9303: a recent
            colour photo with a plain light background, a neutral face looking straight at the camera, both eyes
            open, no shadows or glasses, and the head filling a fixed share of the frame. These rules let e-passport
            chips and airport face-recognition gates match your face reliably.
          </AnswerBox>
          <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-100 p-5 sm:p-8">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">Why ICAO photo standards exist</h3>
              <p className="mt-2 leading-relaxed text-pretty text-gray-600">
                ICAO is the UN agency that sets rules for international travel documents. Its photo standard is used
                by more than 190 countries, so an ICAO compliant photo works for most passports and visas. Each
                country then adds its own print size, pixel size and file limit.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-100 p-5 sm:p-8">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">Other names for an ICAO photo</h3>
              <p className="mt-2 leading-relaxed text-pretty text-gray-600">
                You may see it called an ICAO compliant photo, ICAO format photo, ICAO passport photo, biometric
                passport photo, <span lang="it">foto ICAO</span> or <span lang="es">formato ICAO</span> (Italian and
                Spanish), or <span lang="tr">biyometrik fotoğraf</span> (Turkish). They all mean the same standard.
              </p>
            </div>
          </div>
        </Section>

        {/* MEANING */}
        <Section
          id="meaning"
          eyebrow="The error explained"
          title="What does “photo is not valid as per ICAO standards” mean?"
          className="bg-gray-50"
        >
          <AnswerBox>
            It means an automatic checker compared your photo with the ICAO photo rules and found at least one
            problem. Usually the face is the wrong size in the frame, the background is not plain white, there are
            shadows or glasses, the head is tilted, or the file is the wrong pixel size. Your photo can look sharp
            and still fail.
          </AnswerBox>
          <p className="mx-auto mt-6 max-w-3xl leading-relaxed text-pretty text-gray-600">
            Indian embassies and consulates moved passport applications to the{" "}
            <strong className="text-black">Global Passport Seva Portal 2.0</strong> in 2025, which checks every
            uploaded photo against ICAO rules automatically. That is why many applicants, including those renewing
            a passport from abroad, now see this error for photos that were accepted before.
          </p>

          <div className="mx-auto mt-10 max-w-5xl">
            <InfoTable
              caption="Common photo error messages and how to fix them"
              head={["Error message", "What it means", "How to fix it"]}
              rows={ERROR_MESSAGES.map((r) => [`“${r.message}”`, r.meaning, r.fix])}
            />
          </div>

          <div className="mx-auto mt-6 max-w-5xl rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-8">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">Passport Seva photo upload not working?</h3>
            <p className="mt-2 leading-relaxed text-pretty text-gray-600">
              Most Indian passport photo upload issues come from four things: a face that fills less than 80% of
              the photo height (older studio photos were cropped at 70–80%), a light-grey background instead of
              white, a selfie taken at arm’s length, and a file larger than 250 KB or not exactly 630 × 810 px.
              Fixing all four solves most rejections.
            </p>
          </div>
        </Section>

        {/* REQUIREMENTS */}
        <Section id="requirements" eyebrow="Requirements" title="ICAO photo standards and passport photo requirements">
          <AnswerBox>
            An ICAO compliant photo needs a plain white or light background, a neutral face looking straight at the
            camera, both eyes open, no glasses or shadows, and the face filling about 70–85% of the photo height,
            saved at the exact size the issuing country requires.
          </AnswerBox>
          <div className="mx-auto mt-10 max-w-5xl">
            <InfoTable
              caption="ICAO photo guidelines checklist"
              head={["Rule", "ICAO requirement", "What our tool does"]}
              rows={REQUIREMENTS}
            />
          </div>

          <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-100 p-5 sm:p-8">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">Acceptable ICAO photo</h3>
              <CheckList items={ACCEPTABLE} />
            </div>
            <div className="rounded-2xl bg-gray-100 p-5 sm:p-8">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">Rejected photo</h3>
              <CheckList items={REJECTED} tone="red" />
            </div>
          </div>
        </Section>

        {/* EXAMPLES */}
        <Section
          id="examples"
          eyebrow="Examples"
          title="ICAO photo examples: before and after"
          subtitle="Real phone photos that would fail an ICAO check, and the compliant photographs made from them."
          className="bg-gray-50"
        >
          <ul className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {EXAMPLES.map((ex) => (
              <li key={ex.title} className="rounded-2xl bg-white p-3 ring-1 ring-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <figure>
                    <Image
                      src={ex.before}
                      alt={`Before: rejected passport photo — ${ex.title.toLowerCase()}`}
                      width={420}
                      height={540}
                      sizes="(min-width: 768px) 160px, 45vw"
                      className="aspect-[7/9] h-auto w-full rounded-xl bg-gray-100 object-cover"
                    />
                    <figcaption className="mt-1.5 text-center text-xs text-gray-500">Before</figcaption>
                  </figure>
                  <figure>
                    <Image
                      src={ex.after}
                      alt={`After: ICAO compliant photograph — ${ex.title.toLowerCase()}`}
                      width={420}
                      height={540}
                      sizes="(min-width: 768px) 160px, 45vw"
                      className="aspect-[7/9] h-auto w-full rounded-xl bg-gray-100 object-cover ring-2 ring-amber-400"
                    />
                    <figcaption className="mt-1.5 text-center text-xs font-semibold text-amber-700">After</figcaption>
                  </figure>
                </div>
                <h3 className="mt-3 px-1 pb-1 text-base font-bold">{ex.title}</h3>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-6 max-w-5xl rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-8">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">Acceptable vs rejected infant passport photo</h3>
            <div className="grid gap-x-8 md:grid-cols-2">
              <CheckList items={INFANT_RULES.acceptable} />
              <CheckList items={INFANT_RULES.rejected} tone="red" />
            </div>
          </div>
        </Section>

        {/* SIZES */}
        <Section id="sizes" eyebrow="Photo sizes" title="ICAO standards photo size by country">
          <AnswerBox>
            ICAO fixes the proportions, not one universal size. The most common print size is 35 × 45 mm. For an
            Indian passport applied online, use a <strong>630 × 810 px JPEG up to 250 KB</strong>.
          </AnswerBox>
          <div className="mx-auto mt-10 max-w-5xl">
            <InfoTable head={["Country / document", "Printed size", "Digital upload"]} rows={PHOTO_SIZES} />
            <p className="mt-3 flex items-start gap-1.5 px-1 text-xs text-gray-500">
              <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
              Governments change these rules. Always confirm on the official site of the office you are applying
              to; the checker above lists all 50+ formats we support.
            </p>
          </div>
        </Section>

        {/* INDIA (Summary linking to dedicated /india/passport-photo-maker spoke to prevent cannibalization) */}
        <Section
          id="india"
          eyebrow="India"
          title="Passport Seva 2.0 ICAO photo specifications"
          subtitle="Key 630 × 810 px upload rules for Indian passports and renewals, linked to our dedicated Indian passport photo maker."
          className="bg-gray-50"
        >
          <AnswerBox>
            Online Indian passport uploads require a <strong>630 × 810 pixel JPEG up to 250 KB</strong>, plain white
            background, no glasses, and the face filling <strong>80–85%</strong> of the photo height.{" "}
            <Link href="/india/passport-photo-maker" className="font-semibold text-amber-800 underline underline-offset-4 hover:text-black">
              Open the dedicated Indian passport photo maker
            </Link>{" "}
            with India preselected.
          </AnswerBox>
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 lg:grid-cols-[1.2fr_1fr]">
            <InfoTable caption="Passport Seva 2.0 quick reference" head={["Item", "Requirement"]} rows={INDIA_SPECS} />
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-7">
                <h3 className="text-lg font-bold tracking-tight sm:text-xl">Renewals and re-issues</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-gray-600 sm:text-base">
                  Renewal and re-issue use the same ICAO rules and the same photo size as a new passport. Use a new
                  photo; the one in your old passport will not be accepted.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-7">
                <h3 className="text-lg font-bold tracking-tight sm:text-xl">Applying in India or abroad</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-gray-600 sm:text-base">
                  At a Passport Seva Kendra in India your photo is usually taken at the appointment. Applications
                  through Indian embassies and consulates abroad need an uploaded ICAO photo, and some missions also
                  ask for printed copies.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* HOW TO */}
        <Section
          id="how-to"
          eyebrow="How it works"
          title="How to convert a photo to ICAO standard"
          subtitle="Four steps, about a minute, from any phone photo."
        >
          <ol className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_TO_STEPS.map((s, i) => (
              <li key={s.name} className="rounded-2xl bg-gray-100 p-5 sm:p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-amber-400 font-semibold text-black">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-gray-600">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <a href="#make-photo" className={ctaClass}>
              Convert my photo now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
        </Section>

        {/* COMPARISON */}
        <Section
          id="compare"
          eyebrow="Compare"
          title="Online ICAO photo maker vs photo studio vs free checkers"
          subtitle="Free checkers are good for a quick test and studios suit people who need prints. An online maker is fastest when you need an exact digital file for a portal."
          className="bg-gray-50"
        >
          <div className="mx-auto max-w-5xl">
            <InfoTable
              head={["Feature", "ID Photo Maker", "Photo studio", "Free online checkers"]}
              rows={COMPARISON}
              highlightCol={1}
            />
          </div>
        </Section>

        {/* E-E-A-T */}
        <Section id="about" eyebrow="Trust" title="Who made this guide and how we check it" className="bg-gray-50">
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {[
              {
                icon: BookOpenCheck,
                title: "Based on official rules",
                body: "Every requirement on this page comes from ICAO Doc 9303 and the official photo notices of the passport offices listed below, not from other photo websites.",
              },
              {
                icon: ShieldCheck,
                title: "Tested on real rejections",
                body: "The ID Photo Maker team built the tool from photos customers had rejected by passport portals, and checks the output against each country’s size, face-ratio and file limits.",
              },
              {
                icon: Lock,
                title: "Independent and private",
                body: "We are not a government website. Your photo is used only to make your passport photo and is never sold or used to train models.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-7">
                <span className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-gray-600">{body}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-6 max-w-5xl rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-7">
            <h3 className="text-lg font-bold tracking-tight">Official sources</h3>
            <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {SOURCES.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl bg-gray-100 px-4 py-3 font-medium transition-colors hover:text-amber-700"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              Written by the ID Photo Maker editorial team · Last reviewed{" "}
              <time dateTime={LAST_REVIEWED.iso}>{LAST_REVIEWED.label}</time>
            </p>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" eyebrow="FAQ" title="ICAO photo questions, answered">
          <div className="mx-auto flex max-w-3xl flex-col gap-2">
            {FAQS.map((f, i) => (
              <details key={f.question} className="faq-item group rounded-2xl bg-gray-100" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-colors hover:text-amber-700 sm:px-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-semibold sm:text-lg">{f.question}</h3>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white">
                    <Plus className="size-4 text-gray-600 transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                  </span>
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-pretty text-gray-600 sm:px-6">{f.answer}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* POLICIES (required for payments) */}
        <Section id="policies" eyebrow="Policies" title="Refunds, privacy and support" className="bg-gray-50">
          <div className="mx-auto grid max-w-5xl gap-4 text-sm md:grid-cols-2">
            {[
              {
                id: "refunds",
                title: "Refund policy",
                body: "You see a free preview before paying. If your downloaded photo has a technical fault, or an official portal rejects an Expert-checked photo, email us within 30 days with your PayPal order reference and the rejection message. We will remake the photo or refund you in full.",
              },
              {
                id: "privacy",
                title: "Privacy",
                body: "Photos are sent over an encrypted connection to our processing service only to create your passport photo. Payments are handled by PayPal, which sends your receipt; we never see your card or PayPal details. We do not sell or share your data.",
              },
              {
                id: "terms",
                title: "Terms",
                body: "ID Photo Maker is an independent photo service, not affiliated with ICAO, Passport Seva, the Ministry of External Affairs or any government. Final acceptance is always decided by the issuing authority. Upload only photos of yourself or people you are authorised to apply for.",
              },
            ].map((p) => (
              <div key={p.id} id={p.id} className="scroll-mt-28 rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-7">
                <h3 className="text-lg font-bold tracking-tight text-black">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-pretty text-gray-600">{p.body}</p>
              </div>
            ))}
            <div id="contact" className="scroll-mt-28 rounded-2xl bg-white p-5 ring-1 ring-gray-200 sm:p-7">
              <h3 className="text-lg font-bold tracking-tight text-black">Contact</h3>
              <p className="mt-2 leading-relaxed text-pretty text-gray-600">
                Email{" "}
                <a href={`mailto:${PRICING.supportEmail}`} className="font-medium text-amber-700 underline-offset-4 hover:underline">
                  {PRICING.supportEmail}
                </a>{" "}
                with your PayPal order reference. We reply within one working day.
              </p>
            </div>
          </div>
        </Section>

        {/* SPECIALIZED CHECKERS & TOOLS (Internal Hub Links) */}
        <Section
          id="checkers"
          eyebrow="Specialized tools"
          title="Country photo checkers, makers and print sheets"
          subtitle="Jump straight to a dedicated passport photo checker, size formatter, white-background editor, or free print template."
        >
          <ul className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/passport-photo-checker",
                title: "Passport Photo Checker",
                desc: "Free biometric check and preview for 50+ countries.",
              },
              {
                href: "/passport-size-photo-maker",
                title: "Passport Size Photo Maker",
                desc: "Auto-crop and size passport photos for 50+ countries.",
              },
              {
                href: "/digital-passport-photo",
                title: "Digital Passport Photo",
                desc: "Create exact pixel JPEGs for online applications.",
              },
              {
                href: "/uk/passport-photo-checker",
                title: "UK Passport Photo Checker",
                desc: "Check 600×750 px and 35×45 mm HMPO requirements.",
              },
              {
                href: "/us/passport-photo-checker",
                title: "US Passport Photo Checker",
                desc: "Validate 2×2 inch (600×600 px) U.S. passport photos.",
              },
              {
                href: "/us/passport-photo-size",
                title: "US Passport Photo Size",
                desc: "Exact 2×2 inch measurements, pixels & instant resizer.",
              },
              {
                href: "/us/visa-photo-checker",
                title: "US Visa Photo Checker",
                desc: "Verify 600×600 px DS-160 and USCIS visa photos.",
              },
              {
                href: "/dv-lottery-photo-checker",
                title: "DV Lottery Photo Checker",
                desc: "Validate 600×600 px Green Card Lottery entries.",
              },
              {
                href: "/india/passport-photo-maker",
                title: "Indian Passport Photo Maker",
                desc: "Format 630×810 px Passport Seva 2.0 photos.",
              },
              {
                href: "/35x45-photo-maker",
                title: "35×45 mm Photo Maker",
                desc: "Resize and crop global 35×45 mm passport photos.",
              },
              {
                href: "/white-background-passport-photo",
                title: "White Background Photo",
                desc: "Remove shadows and cluttered walls automatically.",
              },
              {
                href: "/passport-photo-template-4x6",
                title: "4×6 Print Template",
                desc: "Build a free 300 DPI 4×6″ kiosk print sheet.",
              },
              {
                href: "/print-passport-photo-a4",
                title: "Print on A4 Paper",
                desc: "Arrange up to 24 passport photos on an A4 sheet.",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col justify-between rounded-2xl bg-gray-100 p-5 transition-colors hover:bg-amber-50 hover:ring-1 hover:ring-amber-400"
                >
                  <div>
                    <h3 className="text-base font-bold text-black">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                    Open tool <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        {/* FINAL CTA */}
        <section className="px-4 pt-14 pb-14 sm:px-6 sm:pt-20 sm:pb-20">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-black px-6 py-14 text-center [--dot:oklch(100%_0_0/0.08)] sm:py-20">
            <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
                Get an ICAO standard photograph that passes the first time.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-gray-400 sm:mt-4 sm:text-lg">
                Upload your photo, check it free, and see your ICAO photo before you decide.
              </p>
              <a href="#make-photo" className={`${ctaClass} mt-8 w-full max-w-xs sm:w-auto`}>
                Upload your photo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

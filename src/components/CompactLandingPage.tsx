import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ExternalLink, Plus, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import IcaoPhotoTool from "@/components/IcaoPhotoTool";
import PrintTemplateGenerator from "@/components/PrintTemplateGenerator";
import { PRICING } from "@/lib/config/pricing";
import { getSiteUrl } from "@/lib/site";

export interface CompactFaq {
  question: string;
  answer: string;
}

export interface CompactStep {
  name: string;
  text: string;
}

export interface CompactSource {
  name: string;
  url: string;
}

export interface CompactInternalLink {
  href: string;
  label: string;
  description: string;
}

export interface CompactLandingPageData {
  /** Route path without trailing slash, e.g. "/passport-photo-checker". */
  path: string;
  /** Primary compact keyword (one per page). */
  primaryKeyword: string;
  /** SEO title (50-60 chars). */
  seoTitle: string;
  /** Meta description (140-160 chars). */
  metaDescription: string;
  /** Open Graph title & description. */
  ogTitle: string;
  ogDescription: string;
  ogLocale?: string;
  /** ISO date last reviewed against official sources. */
  lastReviewedIso: string;
  /** Breadcrumb label for the current page. */
  breadcrumbLabel: string;
  /** Which interactive tool to embed: AI ICAO photo processor or browser print-sheet builder. */
  toolMode?: "icao" | "print-sheet";
  /** Initial paper size when toolMode === "print-sheet" (e.g. "4x6" | "a4"). */
  printPaperSize?: string;
  /** Initial photo standard when toolMode === "print-sheet" (e.g. "35x45" | "51x51"). */
  printPhotoStandard?: string;
  /** Country code locked in IcaoPhotoTool, or null to detect via geo-IP. */
  defaultCountryCode: string | null;
  fallbackCountryCode?: string;
  /** Custom button text inside the interactive upload widget. */
  toolCtaLabel: string;
  /** Optional custom navbar CTA text. */
  navCtaText?: string;
  /** 1. H1 containing the primary compact keyword. */
  h1: string;
  /** 2. Introduction (40-60 words). */
  intro: string;
  /** Hero CTAs. */
  primaryCtaText: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  /** 3. Main tool section heading & short prompt. */
  toolHeading: string;
  toolSummary: string;
  /** 4. Key features (3-5 concise bullets). */
  featuresHeading: string;
  features: string[];
  /** 5. How it works (3-4 numbered steps). */
  howItWorksHeading: string;
  steps: CompactStep[];
  /** 6. Requirements / compliance (80-100 words across 2 short paragraphs). */
  complianceHeading: string;
  complianceParagraphs: string[];
  sources: CompactSource[];
  /** 7. Why id-photo-maker (40-60 words). */
  whyHeading: string;
  whyBody: string;
  /** 8. FAQs (3-4 concise questions). */
  faqHeading: string;
  faqs: CompactFaq[];
  /** 9. Final CTA (20-30 words). */
  finalCtaHeading: string;
  finalCtaBody: string;
  finalCtaButton: string;
  /** 2-4 contextual internal links (rendered as navigation, excluded from copy count). */
  relatedLinks: CompactInternalLink[];
}

export function buildCompactMetadata(data: CompactLandingPageData): Metadata {
  const canonical = data.path;

  // No hreflang: every page exists in one language only, so alternates add nothing.
  // The social image comes from the route's opengraph-image.tsx.
  return {
    title: { absolute: data.seoTitle },
    description: data.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: "ID Photo Maker",
      locale: data.ogLocale || "en_GB",
      title: data.ogTitle,
      description: data.ogDescription,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: data.ogTitle,
      description: data.ogDescription,
    },
  };
}

const ctaClass =
  "group inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-black transition-colors hover:bg-amber-500 active:bg-amber-500 sm:py-3";
const ctaSecondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-medium text-black ring-1 ring-gray-200 transition-colors ring-inset hover:bg-gray-50 active:bg-gray-50 sm:py-3";

export interface CompactLandingPageProps {
  data: CompactLandingPageData;
}

/** Statically rendered; when no country is fixed, the tool detects it in the browser. */
export default function CompactLandingPage({ data }: CompactLandingPageProps) {
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        siteUrl={siteUrl}
        pagePath={data.path}
        pageName={data.seoTitle}
        description={data.metaDescription}
        dateModified={data.lastReviewedIso}
        faqItems={data.faqs}
        howToSteps={data.steps}
        howToName={data.howItWorksHeading}
        appName={`ID Photo Maker ${data.breadcrumbLabel}`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: data.breadcrumbLabel, path: data.path },
        ]}
        citations={data.sources.map((s) => s.url)}
        topic={data.primaryKeyword}
        supportEmail={PRICING.supportEmail}
      />

      <Navbar ctaHref="#make-photo" ctaText={data.navCtaText || "Check photo"} />

      <main id="main-content" className="flex flex-1 flex-col">
        {/* 1 & 2. HERO: H1 + INTRO + CTAs */}
        <section className="relative isolate px-4 pt-24 pb-8 sm:px-6 sm:pt-32 sm:pb-12">
          <div className="absolute inset-x-2 top-2 bottom-0 -z-10 mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gray-100 sm:inset-x-6 sm:top-4 sm:rounded-[32px] lg:inset-x-12">
            <div className="bg-dots absolute inset-0" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <nav aria-label="Breadcrumb" className="mb-4 flex justify-center text-xs text-gray-500">
              <ol className="inline-flex items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-black">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-gray-800">
                  {data.breadcrumbLabel}
                </li>
              </ol>
            </nav>

            <h1 className="text-[clamp(2rem,7vw,3.15rem)] leading-[1.08] font-bold tracking-[-0.03em] text-balance text-black">
              {data.h1}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-pretty text-gray-600 sm:text-lg">
              {data.intro}
            </p>

            <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <a href="#make-photo" className={ctaClass}>
                {data.primaryCtaText}
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
              <a href={data.secondaryCtaHref} className={ctaSecondaryClass}>
                {data.secondaryCtaText}
              </a>
            </div>
          </div>
        </section>

        {/* 3. MAIN TOOL SECTION */}
        <section id="make-photo" className="scroll-mt-24 px-4 py-8 sm:px-6 sm:py-12">
          <div className={data.toolMode === "print-sheet" ? "mx-auto max-w-5xl" : "mx-auto max-w-3xl"}>
            <div className="mx-auto mb-5 max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                {data.toolHeading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                {data.toolSummary}
              </p>
            </div>
            {data.toolMode === "print-sheet" ? (
              <PrintTemplateGenerator
                initialPaperSize={data.printPaperSize || "4x6"}
                initialPhotoStandard={data.printPhotoStandard || "35x45"}
                showInstructions={false}
              />
            ) : (
              <IcaoPhotoTool
                initialCountryCode={data.defaultCountryCode}
                detectVisitorCountry={data.defaultCountryCode === null}
                fallbackCountryCode={data.fallbackCountryCode || "GB"}
                ctaLabel={data.toolCtaLabel}
              />
            )}
          </div>
        </section>

        {/* 4. KEY FEATURES & 5. HOW IT WORKS */}
        <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200 sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                {data.featuresHeading}
              </h2>
              <ul className="mt-4 space-y-3">
                {data.features.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-black">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200 sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                {data.howItWorksHeading}
              </h2>
              <ol className="mt-4 space-y-3.5">
                {data.steps.map((step, i) => (
                  <li key={step.name} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
                      {i + 1}
                    </span>
                    <div>
                      <strong className="font-semibold text-black">{step.name}:</strong>{" "}
                      <span>{step.text}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 6. REQUIREMENTS / COMPLIANCE & 7. WHY id-photo-maker */}
        <section id="requirements" className="scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-2xl bg-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                {data.complianceHeading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                {data.complianceParagraphs.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.sources.map((src) => (
                  <a
                    key={src.url}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200 transition-colors hover:text-amber-700"
                  >
                    {src.name}
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200 ring-inset sm:p-8">
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-amber-400 text-black">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
                {data.whyHeading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-800 sm:text-base">
                {data.whyBody}
              </p>
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section id="faq" className="scroll-mt-24 bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-black sm:text-3xl">
              {data.faqHeading}
            </h2>
            <div className="mt-6 flex flex-col gap-2.5">
              {data.faqs.map((faq, i) => (
                <details
                  key={faq.question}
                  className="faq-item group rounded-2xl bg-white ring-1 ring-gray-200"
                  open={i === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-colors hover:text-amber-700 sm:px-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-semibold text-black">{faq.question}</h3>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Plus className="size-4 text-gray-600 transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600 sm:px-6 sm:text-base">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FINAL CTA */}
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-black px-6 py-12 text-center [--dot:oklch(100%_0_0/0.08)] sm:py-14">
            <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl">
                {data.finalCtaHeading}
              </h2>
              <p className="mt-3 text-sm text-pretty text-gray-300 sm:text-base">
                {data.finalCtaBody}
              </p>
              <a href="#make-photo" className={`${ctaClass} mt-6 w-full max-w-xs sm:w-auto`}>
                {data.finalCtaButton}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* RELATED INTERNAL LINKS (Navigation) */}
        <nav aria-label="Related photo checkers" className="border-t border-gray-100 bg-gray-50 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">
              Related photo checkers
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block h-full rounded-xl bg-white p-4 ring-1 ring-gray-200 transition-colors hover:ring-amber-400"
                  >
                    <span className="font-semibold text-black">{link.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-gray-600">
                      {link.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </main>

      <Footer />
    </>
  );
}

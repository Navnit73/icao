export interface JsonLdFaqEntry {
  question: string;
  answer: string;
}

export interface JsonLdProps {
  siteUrl?: string;
  siteName?: string;
  pageName: string;
  description: string;
  logoUrl?: string;
  /** ISO 8601 date the page content was last reviewed. */
  dateModified: string;
  datePublished?: string;
  /** Omit to leave the offer price out (e.g. when prices are shown only after upload). */
  price?: string;
  priceCurrency?: string;
  faqItems: JsonLdFaqEntry[];
  howToSteps: Array<{ name: string; text: string }>;
  /** Official documents the page content is based on. */
  citations?: string[];
  /** Main hero/example image of the page. */
  supportEmail?: string;
  image?: { url: string; width: number; height: number; caption: string };
  /** Main topic of the page, e.g. "ICAO standard photograph". */
  topic?: string;
}

export const DEFAULT_SITE_URL = "https://pixpassport.uk";

/** Schema.org graph for the single-page ICAO photo site. */
export default function JsonLd({
  siteUrl = DEFAULT_SITE_URL,
  siteName = "PixPassport",
  pageName,
  description,
  logoUrl,
  dateModified,
  datePublished,
  price,
  priceCurrency,
  faqItems,
  howToSteps,
  citations = [],
  image,
  topic,
  supportEmail,
}: JsonLdProps) {
  const orgId = `${siteUrl}/#organization`;
  const pageId = `${siteUrl}/#webpage`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteName,
        url: siteUrl,
        logo: logoUrl || `${siteUrl}/pixpassport.jpg`,
        ...(supportEmail
          ? { contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: supportEmail } }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        publisher: { "@id": orgId },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url: siteUrl,
        name: pageName,
        description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: topic ? [{ "@type": "Thing", name: topic }, { "@id": `${siteUrl}/#app` }] : { "@id": `${siteUrl}/#app` },
        ...(image
          ? {
              primaryImageOfPage: {
                "@type": "ImageObject",
                url: image.url,
                contentUrl: image.url,
                width: image.width,
                height: image.height,
                caption: image.caption,
              },
              image: image.url,
            }
          : {}),
        author: { "@id": orgId },
        ...(datePublished ? { datePublished } : {}),
        dateModified,
        ...(citations.length ? { citation: citations } : {}),
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#app`,
        name: `${siteName} ICAO Photo Maker`,
        url: `${siteUrl}/#make-photo`,
        applicationCategory: "PhotographyApplication",
        operatingSystem: "Any (web browser)",
        ...(price && priceCurrency
          ? { offers: { "@type": "Offer", price, priceCurrency, availability: "https://schema.org/InStock" } }
          : {}),
        provider: { "@id": orgId },
      },
      {
        "@type": "HowTo",
        name: "How to convert a photo to ICAO standard",
        step: howToSteps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}

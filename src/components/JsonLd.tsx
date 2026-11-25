import { PRICING } from "@/lib/config/pricing";
import { LOGO_PATH, SITE_NAME, SITE_URL } from "@/lib/site";

export interface JsonLdFaqEntry {
  question: string;
  answer: string;
}

export interface JsonLdBreadcrumb {
  name: string;
  path: string;
}

export interface JsonLdProps {
  siteUrl?: string;
  siteName?: string;
  /** Route path relative to siteUrl, e.g. "/" or "/passport-photo-checker". */
  pagePath?: string;
  pageName: string;
  description: string;
  logoUrl?: string;
  /** ISO 8601 date the page content was last reviewed. */
  dateModified: string;
  datePublished?: string;
  /** Offers on the WebApplication; defaults to the free check/preview plus the paid download. */
  offers?: JsonLdOffer[];
  /** Official profiles of the business (social accounts, directories). */
  sameAs?: string[];
  faqItems: JsonLdFaqEntry[];
  howToSteps: Array<{ name: string; text: string }>;
  /** Custom HowTo schema name; defaults to ICAO conversion. */
  howToName?: string;
  /** Custom WebApplication name; defaults to "<siteName> ICAO Photo Maker". */
  appName?: string;
  /** Optional breadcrumb trail for subpages. */
  breadcrumbs?: JsonLdBreadcrumb[];
  /** Official documents the page content is based on. */
  citations?: string[];
  /** Main hero/example image of the page. */
  supportEmail?: string;
  image?: { url: string; width: number; height: number; caption: string };
  /** Main topic of the page, e.g. "ICAO standard photograph". */
  topic?: string;
}

export interface JsonLdOffer {
  name: string;
  price: string;
  priceCurrency: string;
  description?: string;
}

/** Free ICAO check and preview, then the paid watermark-free download (base currency). */
export const DEFAULT_OFFERS: JsonLdOffer[] = [
  {
    name: "Free ICAO photo check and preview",
    price: "0",
    priceCurrency: PRICING.currency,
    description: "Upload a photo, choose a country and preview the compliant result free.",
  },
  {
    name: PRICING.productName,
    price: PRICING.amount.toFixed(2),
    priceCurrency: PRICING.currency,
    description: PRICING.productDescription,
  },
];

/** Schema.org graph for the homepage and compact-keyword landing pages. */
export default function JsonLd({
  siteUrl = SITE_URL,
  siteName = SITE_NAME,
  pagePath = "/",
  pageName,
  description,
  logoUrl,
  dateModified,
  datePublished,
  offers = DEFAULT_OFFERS,
  sameAs = [],
  faqItems,
  howToSteps,
  howToName = "How to convert a photo to ICAO standard",
  appName,
  breadcrumbs,
  citations = [],
  image,
  topic,
  supportEmail,
}: JsonLdProps) {
  const baseUrl = siteUrl.replace(/\/+$/, "");
  const normalizedPath = pagePath === "/" ? "" : `/${pagePath.replace(/^\/+|\/+$/g, "")}`;
  const pageUrl = `${baseUrl}${normalizedPath}` || baseUrl;
  const orgId = `${baseUrl}/#organization`;
  const pageId = `${pageUrl}#webpage`;
  const appId = `${pageUrl}#app`;

  const graphNodes: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: siteName,
      url: baseUrl,
      logo: logoUrl || `${baseUrl}${LOGO_PATH}`,
      ...(sameAs.length ? { sameAs } : {}),
      ...(supportEmail
        ? { contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: supportEmail } }
        : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: siteName,
      publisher: { "@id": orgId },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": pageId,
      url: pageUrl,
      name: pageName,
      description,
      isPartOf: { "@id": `${baseUrl}/#website` },
      about: topic ? [{ "@type": "Thing", name: topic }, { "@id": appId }] : { "@id": appId },
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
      "@id": appId,
      name: appName || `${siteName} ICAO Photo Maker`,
      url: `${pageUrl}#make-photo`,
      applicationCategory: "PhotographyApplication",
      operatingSystem: "Any (web browser)",
      ...(offers.length
        ? {
            offers: offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              price: o.price,
              priceCurrency: o.priceCurrency,
              ...(o.description ? { description: o.description } : {}),
              availability: "https://schema.org/InStock",
            })),
          }
        : {}),
      provider: { "@id": orgId },
    },
    {
      "@type": "HowTo",
      name: howToName,
      step: howToSteps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  if (breadcrumbs && breadcrumbs.length > 0) {
    graphNodes.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, index) => {
        const crumbPath =
          crumb.path === "/" ? "" : `/${crumb.path.replace(/^\/+|\/+$/g, "")}`;
        return {
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${baseUrl}${crumbPath}`,
        };
      }),
    });
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": graphNodes,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}

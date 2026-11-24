import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

// Single-page site: the homepage is the only indexable URL.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}`,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-GB": `${SITE_URL}`,
        },
      },
    },
  ];
}

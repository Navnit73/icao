import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const SITE_URL = getSiteUrl();

/** Indexable routes, highest priority first. */
const ROUTES: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1.0 },
  { path: "/passport-photo-checker", priority: 0.9 },
  { path: "/digital-passport-photo", priority: 0.9 },
  { path: "/passport-size-photo-maker", priority: 0.9 },
  { path: "/uk/passport-photo-checker", priority: 0.9 },
  { path: "/us/passport-photo-checker", priority: 0.9 },
  { path: "/us/visa-photo-checker", priority: 0.9 },
  { path: "/india/passport-photo-maker", priority: 0.9 },
  { path: "/dv-lottery-photo-checker", priority: 0.9 },
  { path: "/us/passport-photo-size", priority: 0.85 },
  { path: "/35x45-photo-maker", priority: 0.85 },
  { path: "/white-background-passport-photo", priority: 0.85 },
  { path: "/passport-photo-template-4x6", priority: 0.85 },
  { path: "/print-passport-photo-a4", priority: 0.85 },
];

// Keep sitemap entries strictly without lastModified per site crawling policy.
// No hreflang alternates: each page exists in one language only.
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority,
  }));
}

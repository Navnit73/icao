/** Shared site constants for metadata, structured data and landing pages. */

export const SITE_NAME = "ID Photo Maker";
export const DEFAULT_SITE_URL = "https://id-photo-maker.com";

/**
 * Canonical origin with no trailing slash. The only production domain is
 * https://id-photo-maker.com; NEXT_PUBLIC_SITE_URL exists for staging builds.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  const withScheme =
    raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = getSiteUrl();

/** Brand logo served from /public. */
export const LOGO_PATH = "/id-photo-maker.jpg";
export const LOGO_URL = `${SITE_URL}${LOGO_PATH}`;

export const HERO_IMAGE = {
  url: "https://res.cloudinary.com/dipzpwbbk/image/upload/v1790579164/Online-Passport-Photo-Tool_uohrxk.webp",
  width: 1102,
  height: 1427,
  alt: "ICAO standard photograph example: 35 × 45 mm passport photo with plain background and head-height guide lines",
} as const;

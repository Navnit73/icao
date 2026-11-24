/** Shared site constants for metadata, structured data and the homepage. */

export const HERO_IMAGE = {
  url: "https://res.cloudinary.com/dipzpwbbk/image/upload/v1790579164/Online-Passport-Photo-Tool_uohrxk.webp",
  width: 1102,
  height: 1427,
  alt: "ICAO standard photograph example: 35 × 45 mm passport photo with plain background and head-height guide lines",
} as const;

/** Social preview: the hero photo padded to 1200×630 on white by Cloudinary. */
export const OG_IMAGE =
  "https://res.cloudinary.com/dipzpwbbk/image/upload/c_pad,b_white,w_1200,h_630,f_jpg,q_auto/v1790579164/Online-Passport-Photo-Tool_uohrxk.webp";

export const OG_IMAGE_ALT = "ICAO standard photograph example with 35 × 45 mm frame and head-height guides";

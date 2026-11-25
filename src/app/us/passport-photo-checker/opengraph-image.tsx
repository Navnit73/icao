import { renderOgImage } from "@/lib/og-image";
import { US_PASSPORT_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch3-pages";

export const alt = US_PASSPORT_PHOTO_CHECKER_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: US_PASSPORT_PHOTO_CHECKER_PAGE.breadcrumbLabel,
    title: US_PASSPORT_PHOTO_CHECKER_PAGE.h1,
    detail: "2 × 2 in · 600 × 600 px · no glasses",
  });
}

import { renderOgImage } from "@/lib/og-image";
import { US_PASSPORT_PHOTO_SIZE_PAGE } from "@/lib/seo/batch3-pages";

export const alt = US_PASSPORT_PHOTO_SIZE_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: US_PASSPORT_PHOTO_SIZE_PAGE.breadcrumbLabel,
    title: US_PASSPORT_PHOTO_SIZE_PAGE.h1,
    detail: "2 × 2 in (51 × 51 mm) · 600–1200 px",
  });
}

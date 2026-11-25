import { renderOgImage } from "@/lib/og-image";
import { INDIAN_PASSPORT_PHOTO_MAKER_PAGE } from "@/lib/seo/batch2-pages";

export const alt = INDIAN_PASSPORT_PHOTO_MAKER_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: INDIAN_PASSPORT_PHOTO_MAKER_PAGE.breadcrumbLabel,
    title: INDIAN_PASSPORT_PHOTO_MAKER_PAGE.h1,
    detail: "Passport Seva 2.0 · 630 × 810 px · under 250 KB",
  });
}

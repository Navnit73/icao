import { renderOgImage } from "@/lib/og-image";
import { UK_PASSPORT_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch1-pages";

export const alt = UK_PASSPORT_PHOTO_CHECKER_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: UK_PASSPORT_PHOTO_CHECKER_PAGE.breadcrumbLabel,
    title: UK_PASSPORT_PHOTO_CHECKER_PAGE.h1,
    detail: "HMPO rules · 35 × 45 mm · 600 × 750 px minimum",
  });
}

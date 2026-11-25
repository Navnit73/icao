import { renderOgImage } from "@/lib/og-image";
import { PASSPORT_PHOTO_4X6_TEMPLATE_PAGE } from "@/lib/seo/batch2-pages";

export const alt = PASSPORT_PHOTO_4X6_TEMPLATE_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: PASSPORT_PHOTO_4X6_TEMPLATE_PAGE.breadcrumbLabel,
    title: PASSPORT_PHOTO_4X6_TEMPLATE_PAGE.h1,
    detail: "6 × 4 in sheet · 300 DPI · cutting guides",
  });
}

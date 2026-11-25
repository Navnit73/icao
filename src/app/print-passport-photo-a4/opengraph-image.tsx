import { renderOgImage } from "@/lib/og-image";
import { PRINT_PASSPORT_PHOTO_A4_PAGE } from "@/lib/seo/batch2-pages";

export const alt = PRINT_PASSPORT_PHOTO_A4_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: PRINT_PASSPORT_PHOTO_A4_PAGE.breadcrumbLabel,
    title: PRINT_PASSPORT_PHOTO_A4_PAGE.h1,
    detail: "Up to 24 photos on A4 · exact scale · 300 DPI",
  });
}

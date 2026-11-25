import { renderOgImage } from "@/lib/og-image";
import { PASSPORT_SIZE_PHOTO_MAKER_PAGE } from "@/lib/seo/batch3-pages";

export const alt = PASSPORT_SIZE_PHOTO_MAKER_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: PASSPORT_SIZE_PHOTO_MAKER_PAGE.breadcrumbLabel,
    title: PASSPORT_SIZE_PHOTO_MAKER_PAGE.h1,
    detail: "Auto-crop · white background · 50+ countries",
  });
}

import { renderOgImage } from "@/lib/og-image";
import { WHITE_BACKGROUND_PASSPORT_PHOTO_PAGE } from "@/lib/seo/batch2-pages";

export const alt = WHITE_BACKGROUND_PASSPORT_PHOTO_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: WHITE_BACKGROUND_PASSPORT_PHOTO_PAGE.breadcrumbLabel,
    title: WHITE_BACKGROUND_PASSPORT_PHOTO_PAGE.h1,
    detail: "Plain white background · no shadows · auto-crop",
  });
}

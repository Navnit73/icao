import { renderOgImage } from "@/lib/og-image";
import { PASSPORT_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch1-pages";

export const alt = PASSPORT_PHOTO_CHECKER_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: PASSPORT_PHOTO_CHECKER_PAGE.breadcrumbLabel,
    title: PASSPORT_PHOTO_CHECKER_PAGE.h1,
    detail: "Head size · eye line · background · 50+ countries",
  });
}

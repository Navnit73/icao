import { renderOgImage } from "@/lib/og-image";
import { PHOTO_35X45_MAKER_PAGE } from "@/lib/seo/batch2-pages";

export const alt = PHOTO_35X45_MAKER_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: PHOTO_35X45_MAKER_PAGE.breadcrumbLabel,
    title: PHOTO_35X45_MAKER_PAGE.h1,
    detail: "35 × 45 mm · 70–80% head height · country presets",
  });
}

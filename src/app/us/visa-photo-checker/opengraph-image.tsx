import { renderOgImage } from "@/lib/og-image";
import { US_VISA_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch1-pages";

export const alt = US_VISA_PHOTO_CHECKER_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: US_VISA_PHOTO_CHECKER_PAGE.breadcrumbLabel,
    title: US_VISA_PHOTO_CHECKER_PAGE.h1,
    detail: "DS-160 · 600 × 600 px JPEG · under 240 KB",
  });
}

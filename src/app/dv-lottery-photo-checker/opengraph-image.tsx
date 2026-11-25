import { renderOgImage } from "@/lib/og-image";
import { DV_LOTTERY_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch1-pages";

export const alt = DV_LOTTERY_PHOTO_CHECKER_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: DV_LOTTERY_PHOTO_CHECKER_PAGE.breadcrumbLabel,
    title: DV_LOTTERY_PHOTO_CHECKER_PAGE.h1,
    detail: "600 × 600 px JPEG · 50–69% head height",
  });
}

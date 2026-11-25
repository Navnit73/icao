import { renderOgImage } from "@/lib/og-image";
import { DIGITAL_PASSPORT_PHOTO_PAGE } from "@/lib/seo/batch3-pages";

export const alt = DIGITAL_PASSPORT_PHOTO_PAGE.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: DIGITAL_PASSPORT_PHOTO_PAGE.breadcrumbLabel,
    title: DIGITAL_PASSPORT_PHOTO_PAGE.h1,
    detail: "Exact pixel JPEGs for UK, US, India, EU portals",
  });
}

import { renderOgImage } from "@/lib/og-image";

export const alt = "ICAO standard photograph maker: fix “photo not valid” errors online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "ICAO Doc 9303 photo maker",
    title: "ICAO standard photograph, made online in a minute",
    detail: "Passport Seva · UK · US · Schengen · 50+ countries",
  });
}

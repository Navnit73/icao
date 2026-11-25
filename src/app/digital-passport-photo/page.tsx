import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { DIGITAL_PASSPORT_PHOTO_PAGE } from "@/lib/seo/batch3-pages";

export const metadata = buildCompactMetadata(DIGITAL_PASSPORT_PHOTO_PAGE);

export default function DigitalPassportPhotoPage() {
  return <CompactLandingPage data={DIGITAL_PASSPORT_PHOTO_PAGE} />;
}

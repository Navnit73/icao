import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { US_PASSPORT_PHOTO_SIZE_PAGE } from "@/lib/seo/batch3-pages";

export const metadata = buildCompactMetadata(US_PASSPORT_PHOTO_SIZE_PAGE);

export default function UsPassportPhotoSizePage() {
  return <CompactLandingPage data={US_PASSPORT_PHOTO_SIZE_PAGE} />;
}

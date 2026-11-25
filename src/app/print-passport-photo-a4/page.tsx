import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { PRINT_PASSPORT_PHOTO_A4_PAGE } from "@/lib/seo/batch2-pages";

export const metadata = buildCompactMetadata(PRINT_PASSPORT_PHOTO_A4_PAGE);

export default function PrintPassportPhotoA4Page() {
  return <CompactLandingPage data={PRINT_PASSPORT_PHOTO_A4_PAGE} />;
}

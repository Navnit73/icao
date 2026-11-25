import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { US_PASSPORT_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch3-pages";

export const metadata = buildCompactMetadata(US_PASSPORT_PHOTO_CHECKER_PAGE);

export default function UsPassportPhotoCheckerPage() {
  return <CompactLandingPage data={US_PASSPORT_PHOTO_CHECKER_PAGE} />;
}

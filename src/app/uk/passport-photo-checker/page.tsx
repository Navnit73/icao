import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { UK_PASSPORT_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch1-pages";

export const metadata = buildCompactMetadata(UK_PASSPORT_PHOTO_CHECKER_PAGE);

export default function UkPassportPhotoCheckerPage() {
  return <CompactLandingPage data={UK_PASSPORT_PHOTO_CHECKER_PAGE} />;
}

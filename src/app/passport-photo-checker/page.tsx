import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { PASSPORT_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch1-pages";

export const metadata = buildCompactMetadata(PASSPORT_PHOTO_CHECKER_PAGE);

export default function PassportPhotoCheckerPage() {
  return <CompactLandingPage data={PASSPORT_PHOTO_CHECKER_PAGE} />;
}

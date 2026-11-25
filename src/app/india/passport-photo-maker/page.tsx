import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { INDIAN_PASSPORT_PHOTO_MAKER_PAGE } from "@/lib/seo/batch2-pages";

export const metadata = buildCompactMetadata(INDIAN_PASSPORT_PHOTO_MAKER_PAGE);

export default function IndianPassportPhotoMakerPage() {
  return <CompactLandingPage data={INDIAN_PASSPORT_PHOTO_MAKER_PAGE} />;
}

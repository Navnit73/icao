import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { WHITE_BACKGROUND_PASSPORT_PHOTO_PAGE } from "@/lib/seo/batch2-pages";

export const metadata = buildCompactMetadata(WHITE_BACKGROUND_PASSPORT_PHOTO_PAGE);

export default function WhiteBackgroundPassportPhotoPage() {
  return <CompactLandingPage data={WHITE_BACKGROUND_PASSPORT_PHOTO_PAGE} />;
}

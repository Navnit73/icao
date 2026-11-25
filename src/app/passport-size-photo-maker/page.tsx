import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { PASSPORT_SIZE_PHOTO_MAKER_PAGE } from "@/lib/seo/batch3-pages";

export const metadata = buildCompactMetadata(PASSPORT_SIZE_PHOTO_MAKER_PAGE);

export default function PassportSizePhotoMakerPage() {
  return <CompactLandingPage data={PASSPORT_SIZE_PHOTO_MAKER_PAGE} />;
}

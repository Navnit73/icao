import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { PASSPORT_PHOTO_4X6_TEMPLATE_PAGE } from "@/lib/seo/batch2-pages";

export const metadata = buildCompactMetadata(PASSPORT_PHOTO_4X6_TEMPLATE_PAGE);

export default function PassportPhotoTemplate4x6Page() {
  return <CompactLandingPage data={PASSPORT_PHOTO_4X6_TEMPLATE_PAGE} />;
}

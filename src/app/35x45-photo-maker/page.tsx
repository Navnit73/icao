import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { PHOTO_35X45_MAKER_PAGE } from "@/lib/seo/batch2-pages";

export const metadata = buildCompactMetadata(PHOTO_35X45_MAKER_PAGE);

export default function Photo35x45MakerPage() {
  return <CompactLandingPage data={PHOTO_35X45_MAKER_PAGE} />;
}

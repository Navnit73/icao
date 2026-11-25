import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { US_VISA_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch1-pages";

export const metadata = buildCompactMetadata(US_VISA_PHOTO_CHECKER_PAGE);

export default function UsVisaPhotoCheckerPage() {
  return <CompactLandingPage data={US_VISA_PHOTO_CHECKER_PAGE} />;
}

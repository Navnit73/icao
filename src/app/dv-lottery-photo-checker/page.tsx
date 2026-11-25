import CompactLandingPage, { buildCompactMetadata } from "@/components/CompactLandingPage";
import { DV_LOTTERY_PHOTO_CHECKER_PAGE } from "@/lib/seo/batch1-pages";

export const metadata = buildCompactMetadata(DV_LOTTERY_PHOTO_CHECKER_PAGE);

export default function DvLotteryPhotoCheckerPage() {
  return <CompactLandingPage data={DV_LOTTERY_PHOTO_CHECKER_PAGE} />;
}

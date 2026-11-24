import type { Metadata } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingProvider from "@/components/PricingProvider";
import PhotoPreview from "@/components/PhotoPreview";
import { getPlanPricing } from "@/lib/config/pricing";
import { countryDisplayName, resolveCurrencyFromHeaders } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Your ICAO Photo Preview",
  description: "Preview your ICAO-compliant photo, then pay to download the watermark-free version.",
  alternates: { canonical: undefined, languages: undefined },
  robots: { index: false, follow: false },
};

export interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const { currency, country } = resolveCurrencyFromHeaders(await headers());
  const standard = getPlanPricing("standard", currency, country);

  return (
    <>
      <Navbar priceText={standard.amountFormatted} />
      <main id="main-content" className="flex flex-1 flex-col bg-gray-50 px-4 pt-24 pb-12 sm:px-6 sm:pt-32">
        <section aria-label="Photo preview" className="mx-auto w-full max-w-7xl">
          <PricingProvider initialCurrency={currency} country={country}>
            <PhotoPreview resultId={id} priceCountryName={countryDisplayName(country)} />
          </PricingProvider>
        </section>
      </main>
      <Footer priceText={standard.amountFormatted} />
    </>
  );
}

/**
 * Pricing configuration.
 * Price points per currency live in src/lib/currency.ts; the charged currency is
 * resolved server-side from the visitor's geo-IP country.
 * Payment is taken client-side with PayPal Smart Buttons (src/components/PaymentButton.tsx),
 * which charge exactly the amount derived here.
 */

import {
  BASE_CURRENCY,
  CURRENCIES,
  formatMoney,
  getPriceInMinorUnits,
  type CurrencyCode,
  type PlanType,
} from "@/lib/currency";
import { getSiteUrl } from "@/lib/site";

export type { PlanType };

const baseAmountInSubunits = getPriceInMinorUnits(BASE_CURRENCY, "standard");
const baseExpertAmountInSubunits = getPriceInMinorUnits(BASE_CURRENCY, "expert_edit");

export const PRICING = {
  /** Standard Pack amount in base currency units (e.g. 7.99 GBP) */
  amount: baseAmountInSubunits / 100,
  /** Amount in smallest currency unit (pence/cents) */
  amountInPence: baseAmountInSubunits,
  amountInSubunits: baseAmountInSubunits,

  /** Expert Edit amount in base currency units (e.g. 13.99 GBP) */
  expertEditAmount: baseExpertAmountInSubunits / 100,
  expertEditAmountInPence: baseExpertAmountInSubunits,
  expertEditAmountInSubunits: baseExpertAmountInSubunits,

  /** Base (fallback) ISO 4217 currency code */
  currency: BASE_CURRENCY,
  /** Human-readable base currency symbol */
  currencySymbol: CURRENCIES[BASE_CURRENCY].symbol,
  /** Product identifier */
  productType: "digital_passport_photo",
  /** Product display name */
  productName: "Official Biometric Passport Photo",
  /** Product description */
  productDescription:
    "AI-processed, government-compliant biometric passport photo with background removal, auto-crop, and print-ready 6×4″ sheet.",
  /** Business display name */
  businessName: "ID Photo Maker",
  /** Support email */
  supportEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@id-photo-maker.com",
  /** Website URL */
  siteUrl: getSiteUrl(),
} as const;

export type PlanPricing = ReturnType<typeof getPlanPricing>;

export function getPlanPricing(
  plan: PlanType = "standard",
  currency: CurrencyCode = BASE_CURRENCY,
  /** Visitor's country, for country-specific prices (e.g. India in USD). */
  country?: string | null
) {
  const isExpert = plan === "expert_edit";
  const def = CURRENCIES[currency];
  const planSubunits = getPriceInMinorUnits(currency, plan, country);

  return {
    planType: plan,
    title: isExpert ? "Expert Edit & Review" : "Standard Photo",
    amount: planSubunits / 10 ** def.exponent,
    amountFormatted: formatMoney(planSubunits, currency, { trimWholeNumbers: true }),
    amountInSubunits: planSubunits,
    currency,
    currencySymbol: def.symbol,
    description: isExpert
      ? "AI-processed photo + 100% human expert manual inspection, touchups & guaranteed government acceptance."
      : "AI-processed, government-compliant biometric passport photo with instant download & print sheet.",
  };
}

export type PricingConfig = typeof PRICING;

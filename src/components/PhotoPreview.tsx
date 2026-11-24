"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Download,
  Loader2,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import PaymentButton, { type PaidOrder } from "@/components/PaymentButton";
import { getCountryByCode } from "@/config/countries";
import type { PassportProcessResult } from "@/lib/passport-api";
import { PRICING, type PlanType } from "@/lib/config/pricing";
import { usePricing } from "@/components/PricingProvider";

const PrintTemplateGenerator = dynamic(() => import("@/components/PrintTemplateGenerator"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center gap-2 p-8 text-sm text-gray-500">
      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      Loading print sheet builder…
    </div>
  ),
});

export interface PhotoPreviewProps {
  /** Result id from the URL (/preview/[id]), as saved by saveProcessedResult. */
  resultId: string;
  /** Visitor's country name for the price label, e.g. "India". */
  priceCountryName?: string | null;
}

/** Shape written to storage by saveProcessedResult in src/lib/photo-processing.ts. */
interface StoredResult extends PassportProcessResult {
  result_id: string;
  country_code: string;
  country_name: string;
  target_dimensions?: string;
  document_type?: string;
  original_preview?: string;
  timestamp?: number;
}

type MailStatus = "sending" | "sent" | "failed";

interface PaidInfo extends PaidOrder {
  planType: PlanType;
  paidAt: string;
  /** Email the customer typed before paying; the photo is sent here. */
  customerEmail: string;
  amount: number;
  currency: string;
  mailStatus: MailStatus;
}

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const UPLOAD_HREF = "/#make-photo";
const paidKey = (id: string) => `pixpassport_paid_${id}`;

/** Paid state is kept in this browser so a refresh keeps the download available. */
function loadPaid(id: string): PaidInfo | null {
  try {
    const raw = localStorage.getItem(paidKey(id));
    return raw ? (JSON.parse(raw) as PaidInfo) : null;
  } catch {
    return null;
  }
}

function savePaid(id: string, info: PaidInfo) {
  try {
    localStorage.setItem(paidKey(id), JSON.stringify(info));
  } catch {
    // Storage blocked: the download still works for this visit
  }
}

/** Downloads a remote image as a file; falls back to opening it if the fetch is blocked. */
async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(String(res.status));
    const blobUrl = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    window.open(url, "_blank", "noopener");
  }
}

function pct(value?: number): string | null {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  // API may return 0–1 ratios or 0–100 percentages
  const v = value <= 1 ? value * 100 : value;
  return `${Math.round(v)}%`;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Finds the saved result for this id in session storage, then local storage. */
function loadStoredResult(id: string): StoredResult | null {
  const ids = Array.from(new Set([id, safeDecode(id)]));
  const stores: Array<() => Storage> = [() => sessionStorage, () => localStorage];
  for (const getStore of stores) {
    try {
      const store = getStore();
      for (const key of ids) {
        const raw = store.getItem(`pixpassport_${key}`);
        if (raw) return JSON.parse(raw) as StoredResult;
      }
      const latest = store.getItem("pixpassport_latest");
      if (latest) {
        const parsed = JSON.parse(latest) as StoredResult;
        if (ids.includes(parsed.result_id)) return parsed;
      }
    } catch {
      // Storage blocked or corrupt: try the next one
    }
  }
  return null;
}

export default function PhotoPreview({ resultId, priceCountryName }: PhotoPreviewProps) {
  // undefined = still reading storage, null = not found
  const [result, setResult] = useState<StoredResult | null | undefined>(undefined);

  const [plan, setPlan] = useState<PlanType>("standard");
  const [paid, setPaid] = useState<PaidInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const emailValid = EMAIL_RE.test(email.trim());

  const { currency, standard, expert_edit } = usePricing();
  const activePricing = plan === "expert_edit" ? expert_edit : standard;

  useEffect(() => {
    // Storage is only readable in the browser, so this has to run after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(loadStoredResult(resultId));
    setPaid(loadPaid(resultId));
  }, [resultId]);

  useEffect(() => {
    if (paid) window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid?.orderID]);

  if (result === undefined) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500" aria-live="polite">
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        Loading your photo…
      </div>
    );
  }

  if (result === null) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <AlertCircle className="mx-auto mb-3 size-8 text-amber-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold">We could not find this photo</h1>
        <p className="mt-2 text-sm text-gray-600">
          Previews are kept only in this browser. If you opened this link on another device or cleared your browser
          data, please upload your photo again. If you already paid, email us your PayPal order reference.
        </p>
        <Link
          href={UPLOAD_HREF}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-black transition-colors hover:bg-amber-500"
        >
          <RotateCcw className="size-4" aria-hidden="true" /> Upload a photo
        </Link>
      </div>
    );
  }

  const country = getCountryByCode(result.country_code);
  const countryName = result.country_name || country?.country_name || result.country_code;
  const documentType = result.document_type || country?.document_type || "passport";
  const previewUrl = result.preview_url || result.image_url;
  const fullImageUrl = result.image_url || result.preview_url;
  const dimensions = result.dimensions || result.target_dimensions || country?.dimensions || "";
  const originalPreview = result.original_preview || null;
  const fileName = `icao-photo-${result.country_code.toLowerCase()}-${dimensions || "photo"}.jpg`;

  /** Records the order and emails the photo. Safe to call again: the server ignores repeats. */
  async function recordOrder(info: PaidInfo) {
    if (!result) return;
    let next: MailStatus = "failed";
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: info.orderID,
          email: info.customerEmail,
          plan: info.planType,
          amount: info.amount,
          currency: info.currency,
          resultId: result.result_id,
          countryCode: result.country_code,
          countryName,
          documentType,
          dimensions,
          imageUrl: fullImageUrl,
          payerEmail: info.email || undefined,
          payerName: info.name || undefined,
          payerID: info.payerID || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; emailed?: boolean };
      next = res.ok && data.ok && data.emailed ? "sent" : "failed";
    } catch {
      next = "failed";
    }
    const updated = { ...info, mailStatus: next };
    savePaid(resultId, updated);
    setPaid(updated);
  }

  function handlePaid(order: PaidOrder) {
    const info: PaidInfo = {
      ...order,
      planType: plan,
      paidAt: new Date().toISOString(),
      customerEmail: email.trim().toLowerCase(),
      amount: activePricing.amountInSubunits,
      currency,
      mailStatus: "sending",
    };
    savePaid(resultId, info);
    setPaid(info);
    void recordOrder(info);
  }

  async function handleDownload() {
    if (!fullImageUrl) return;
    setDownloading(true);
    await downloadImage(fullImageUrl, fileName);
    setDownloading(false);
  }

  const paymentDescription =
    plan === "expert_edit"
      ? `ICAO ${countryName} ${documentType} photo + expert review`
      : `ICAO ${countryName} ${documentType} photo + print sheet`;

  const expertMailto = paid
    ? `mailto:${PRICING.supportEmail}?subject=${encodeURIComponent(
        `Expert review — PayPal order ${paid.orderID}`
      )}&body=${encodeURIComponent(
        `Hi,\n\nI paid for the expert-checked photo.\n\nPayPal order: ${paid.orderID}\nCountry: ${countryName} (${documentType}, ${dimensions} px)\nPhoto: ${fullImageUrl ?? ""}\n\nThanks`
      )}`
    : "";

  const metrics = result.metrics;
  const checks: Array<{ label: string; detail?: string | null }> = [
    { label: `Resized to ${dimensions} px for ${countryName}` },
    { label: "Head size and eye line aligned to ICAO ratios", detail: pct(metrics?.head_height_pct) && `Head height ${pct(metrics?.head_height_pct)}` },
    { label: "Crown clearance at the top of the frame", detail: pct(metrics?.top_margin_pct) && `Top margin ${pct(metrics?.top_margin_pct)}` },
    {
      label: metrics?.background_corrected ? "Background replaced with plain white" : "Plain, light background",
      detail: metrics?.background_valid === false ? "Check background before submitting" : null,
    },
    { label: "Exported as JPEG for online upload" },
  ];

  const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-black transition-colors hover:bg-amber-500 active:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60";
  const btnSecondary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black ring-1 ring-gray-200 transition-colors ring-inset hover:bg-gray-50";
  const stageIdx = paid ? 3 : 2;

  return (
    <div className="rounded-3xl bg-gray-100 p-2 text-left">
      <div className="rounded-2xl bg-white p-4 sm:p-6">
        {/* Progress */}
        <ol className="mb-5 grid grid-cols-4 gap-1.5 text-[11px] font-medium text-gray-500 sm:text-xs" aria-label="Progress">
          {["Upload", "ICAO fix", "Preview", "Download"].map((label, i) => (
            <li key={label} className="flex flex-col gap-1.5" aria-current={i === stageIdx ? "step" : undefined}>
              <span className={`h-1.5 rounded-full ${i <= stageIdx ? "bg-amber-400" : "bg-gray-200"}`} />
              <span className={i <= stageIdx ? "text-black" : ""}>{label}</span>
            </li>
          ))}
        </ol>

        {!paid ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h1 className="mb-3 text-xl font-bold sm:text-2xl">Your ICAO photo preview</h1>
              <div className="grid grid-cols-2 gap-3">
                {originalPreview && (
                  <figure className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={originalPreview}
                      alt="Your original uploaded photo"
                      className="aspect-[7/9] w-full rounded-xl bg-gray-100 object-cover"
                    />
                    <figcaption className="mt-1.5 text-xs text-gray-500">Before</figcaption>
                  </figure>
                )}
                {previewUrl && (
                  <figure className={`text-center ${originalPreview ? "" : "col-span-2"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={`ICAO-compliant ${countryName} ${documentType} photo preview`}
                      className="aspect-[7/9] w-full rounded-xl bg-gray-100 object-contain ring-2 ring-amber-400 select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                    />
                    <figcaption className="mt-1.5 text-xs font-semibold text-amber-700">After · {dimensions} px</figcaption>
                  </figure>
                )}
              </div>

              <ul className="mt-4 space-y-2 text-sm" aria-label="Checks applied to your photo">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
                    <span>
                      {c.label}
                      {c.detail && <span className="text-gray-500"> — {c.detail}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={UPLOAD_HREF}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black"
              >
                <RotateCcw className="size-4" aria-hidden="true" /> Use a different photo
              </Link>
            </div>

            <div>
              <h2 className="mb-1 text-lg font-bold">Choose your download</h2>
              {priceCountryName && (
                <p className="mb-3 text-xs text-gray-500">Prices shown in {currency} for {priceCountryName}</p>
              )}
              <fieldset className="space-y-2">
                <legend className="sr-only">Plan</legend>
                {(
                  [
                    {
                      id: "standard" as const,
                      pricing: standard,
                      icon: ShieldCheck,
                      name: "ICAO digital photo",
                      points: ["Watermark-free JPEG for online upload", "Printable 6×4″ photo sheet", "Instant download, PayPal receipt"],
                    },
                    {
                      id: "expert_edit" as const,
                      pricing: expert_edit,
                      icon: UserCheck,
                      name: "Expert-checked photo",
                      points: ["Everything in the digital photo", "A person reviews and retouches it", "Free remake if it is rejected"],
                    },
                  ]
                ).map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer gap-3 rounded-2xl p-4 ring-inset transition-colors ${
                      plan === p.id ? "bg-amber-50 ring-2 ring-amber-400" : "bg-gray-50 ring-1 ring-gray-200 hover:ring-amber-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="icao-plan"
                      className="mt-1 size-4 accent-amber-500"
                      checked={plan === p.id}
                      onChange={() => setPlan(p.id)}
                    />
                    <span className="flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-bold">
                          <p.icon className="size-4 text-amber-600" aria-hidden="true" />
                          {p.name}
                        </span>
                        <span className="text-lg font-extrabold tabular-nums">{p.pricing.amountFormatted}</span>
                      </span>
                      <span className="mt-1.5 block space-y-1">
                        {p.points.map((pt) => (
                          <span key={pt} className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Check className="size-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                            {pt}
                          </span>
                        ))}
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <div className="mt-4 space-y-3">
                <p className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-extrabold tabular-nums">
                    {activePricing.amountFormatted} <span className="text-xs font-medium text-gray-500">{currency}</span>
                  </span>
                </p>
                <div>
                  <label htmlFor="icao-email" className="mb-1.5 block text-sm font-semibold">
                    Email to receive your photo
                  </label>
                  <div
                    className={`flex items-center gap-2 rounded-xl bg-gray-100 px-4 ring-inset focus-within:ring-2 focus-within:ring-amber-400 ${
                      emailTouched && !emailValid ? "ring-2 ring-red-400" : "ring-1 ring-gray-200"
                    }`}
                  >
                    <Mail className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
                    <input
                      id="icao-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="no-focus-outline w-full bg-transparent py-3 text-base outline-none sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      aria-invalid={emailTouched && !emailValid}
                      aria-describedby="icao-email-help"
                      required
                    />
                  </div>
                  <p
                    id="icao-email-help"
                    className={`mt-1.5 text-xs ${emailTouched && !emailValid ? "text-red-700" : "text-gray-500"}`}
                  >
                    {emailTouched && !emailValid
                      ? "Enter a valid email to continue to payment."
                      : "We email your photo and order details here."}
                  </p>
                </div>
                {fullImageUrl ? (
                  <div
                    className={emailValid ? "" : "pointer-events-none opacity-50"}
                    onPointerDownCapture={() => setEmailTouched(true)}
                    aria-disabled={!emailValid}
                  >
                    <PaymentButton
                      amount={activePricing.amountInSubunits}
                      currency={currency}
                      description={paymentDescription}
                      customId={`${result.result_id}|${plan}`}
                      disabled={!emailValid}
                      onSuccess={handlePaid}
                    />
                  </div>
                ) : (
                  <p role="alert" className="flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-800">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    Your photo session expired. Please upload your photo again.
                  </p>
                )}
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
                  <Lock className="size-3.5 shrink-0" aria-hidden="true" />
                  Secure checkout by PayPal · pay with PayPal or card · one-time, no subscription
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <h1 className="text-xl font-bold sm:text-2xl">Your ICAO photo is ready</h1>
            <div role="status" className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-4 text-sm ring-1 ring-amber-200 ring-inset">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden="true" />
              <span>
                Payment complete. PayPal order reference: <span className="font-mono">{paid.orderID}</span>.{" "}
                {paid.mailStatus === "sent" && (
                  <>
                    We have emailed your photo to <strong>{paid.customerEmail}</strong>.
                  </>
                )}
                {paid.mailStatus === "sending" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> Sending your photo to{" "}
                    <strong>{paid.customerEmail}</strong>…
                  </span>
                )}
                {paid.mailStatus === "failed" && (
                  <>
                    We could not email your photo just now, so please download it below. Keep the order reference in
                    case you need to contact us.
                  </>
                )}
              </span>
            </div>

            {paid.planType === "expert_edit" && paid.mailStatus === "sent" && (
              <div className="rounded-xl bg-gray-50 p-4 text-sm ring-1 ring-gray-200 ring-inset">
                <p className="font-semibold">Expert review in progress</p>
                <p className="mt-1 text-gray-600">
                  Our team has your photo and will email the checked version to {paid.customerEmail} within one
                  working day.
                </p>
              </div>
            )}

            {paid.planType === "expert_edit" && paid.mailStatus === "failed" && (
              <div className="rounded-xl bg-gray-50 p-4 text-sm ring-1 ring-gray-200 ring-inset">
                <p className="font-semibold">One more step for your expert review</p>
                <p className="mt-1 text-gray-600">
                  Send us your order so a person can check and retouch your photo. We reply with the checked version,
                  usually within one working day.
                </p>
                <a href={expertMailto} className={`${btnSecondary} mt-3`}>
                  <Mail className="size-4" aria-hidden="true" /> Email my photo for expert review
                </a>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading || !fullImageUrl}
                className={`${btnPrimary} flex-1`}
              >
                {downloading ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="size-5" aria-hidden="true" />
                )}
                Download ICAO photo ({dimensions} px)
              </button>
              <Link href={UPLOAD_HREF} className={btnSecondary}>
                <RotateCcw className="size-5" aria-hidden="true" /> Photo for someone else
              </Link>
            </div>

            {fullImageUrl && (
              <div>
                <h2 className="mb-2 text-lg font-bold">Print a 6×4″ photo sheet</h2>
                <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200">
                  <PrintTemplateGenerator
                    initialImageUrl={fullImageUrl}
                    initialPaperSize="4x6"
                    initialPhotoStandard={dimensions.startsWith("600x600") ? "2x2" : "35x45"}
                    showInstructions={false}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

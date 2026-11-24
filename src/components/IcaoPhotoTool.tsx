"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Check, CheckCircle2, ImagePlus, Loader2, Lock } from "lucide-react";
import { COUNTRIES, getCountryByCode, type CountryPassportConfig } from "@/config/countries";
import CountryCombobox from "@/components/CountryCombobox";
import { compressImageTo3MB } from "@/lib/image-compress";
import {
  makePreviewDataUrl,
  requestPhotoProcessing,
  saveProcessedResult,
} from "@/lib/photo-processing";

export interface IcaoPhotoToolProps {
  /** Visitor's country from geo-IP; preselects the matching document format. */
  initialCountryCode?: string | null;
  /** Used when the geo country has no format in src/config/countries.json. */
  fallbackCountryCode?: string;
}

type Stage = "upload" | "processing";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 20;

const PROCESSING_STEPS = [
  "Detecting face, eyes and head position",
  "Replacing background with plain white",
  "Cropping to ICAO head-size and eye-line ratios",
  "Resizing to the official pixel dimensions",
];

const SORTED_COUNTRIES = [...COUNTRIES].sort((a, b) =>
  a.country_name.localeCompare(b.country_name)
);

/**
 * Upload step of the ICAO photo flow. Once the photo is processed, the result
 * is saved in browser storage and the user is sent to /preview/[id].
 */
export default function IcaoPhotoTool({
  initialCountryCode,
  fallbackCountryCode = "GB",
}: IcaoPhotoToolProps) {
  const router = useRouter();
  const startCode =
    (initialCountryCode && getCountryByCode(initialCountryCode)?.country_code) ||
    fallbackCountryCode;

  const [countryCode, setCountryCode] = useState(startCode);
  const country: CountryPassportConfig =
    getCountryByCode(countryCode) || getCountryByCode(fallbackCountryCode) || COUNTRIES[0];

  const [stage, setStage] = useState<Stage>("upload");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);

  // Cycle the progress messages while the API call runs
  useEffect(() => {
    if (stage !== "processing") return;
    const id = setInterval(
      () => setStepIndex((i) => Math.min(i + 1, PROCESSING_STEPS.length - 1)),
      1800
    );
    return () => clearInterval(id);
  }, [stage]);

  // Keep the tool in view while processing
  useEffect(() => {
    if (stage === "processing") toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stage]);

  async function handleFile(f: File) {
    setError(null);
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Please upload a JPEG, PNG or WebP photo.");
      return;
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Your photo must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setStage("processing");
    setStepIndex(0);

    let previewData: string | null = null;
    try {
      previewData = await makePreviewDataUrl(f);
      setOriginalPreview(previewData);
    } catch {
      // Preview is optional
    }

    let uploadFile = f;
    try {
      uploadFile = (await compressImageTo3MB(f)).file;
    } catch {
      // Send the original if compression fails
    }

    try {
      const apiResult = await requestPhotoProcessing(
        uploadFile,
        country.country_code,
        country.document_type || "passport"
      );
      const id = saveProcessedResult(apiResult, {
        countryCode: country.country_code,
        countryName: country.country_name,
        targetDimensions: country.dimensions,
        documentType: country.document_type,
        originalPreview: previewData,
      });
      // Stay on the processing screen until the preview page takes over
      router.push(`/preview/${encodeURIComponent(id)}`);
    } catch (err) {
      setStage("upload");
      setOriginalPreview(null);
      setError(
        err instanceof Error
          ? err.message
          : "We could not process this photo. Please try a clearer, front-facing photo."
      );
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) void handleFile(f);
    e.target.value = "";
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  }

  const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-black transition-colors hover:bg-amber-500 active:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60";
  const stageIdx = stage === "upload" ? 0 : 1;

  return (
    <div ref={toolRef} className="scroll-mt-28 rounded-3xl bg-gray-100 p-2 text-left">
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

        {error && (
          <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-800">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* STAGE 1: Upload */}
        {stage === "upload" && (
          <div className="space-y-4">
            <CountryCombobox
              id="icao-country"
              label="Which passport, visa or ID is this photo for?"
              countries={SORTED_COUNTRIES}
              value={country.country_code}
              onChange={setCountryCode}
            />

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload your photo. Drag and drop or press Enter to choose a file."
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`group cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
                isDragging ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50 hover:border-amber-400 hover:bg-amber-50/50"
              }`}
            >
              <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <ImagePlus className="size-6" aria-hidden="true" />
              </span>
              <p className="text-base font-bold sm:text-lg">Upload or take a photo</p>
              <p className="mt-1 text-sm text-gray-500">
                JPEG, PNG or WebP up to {MAX_FILE_SIZE_MB} MB · a phone photo is fine
              </p>
              <span className={`${btnPrimary} mt-4 w-full sm:w-auto`}>
                Fix my photo free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </div>
            <input
              ref={inputRef}
              id="icao-photo-input"
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              className="sr-only"
              onChange={onFileChange}
              aria-label="Choose a photo from your device"
            />

            <ul className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
              {[
                "Face the camera, neutral expression",
                "Eyes open, mouth closed, no glasses",
                "Even light, no shadows on face",
                "Any background — we replace it",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-amber-400 text-black">
                    <Check className="size-2.5" strokeWidth={3.5} aria-hidden="true" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Lock className="size-3.5 shrink-0" aria-hidden="true" />
              Free check and preview. Your photo is never sold or shared.
            </p>
          </div>
        )}

        {/* STAGE 2: Processing */}
        {stage === "processing" && (
          <div className="flex flex-col items-center py-6 text-center" aria-live="polite">
            {originalPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={originalPreview}
                alt=""
                className="mb-4 size-24 rounded-full object-cover ring-4 ring-amber-200"
              />
            )}
            <Loader2 className="mb-3 size-8 animate-spin text-amber-500" aria-hidden="true" />
            <p className="text-lg font-bold">Converting your photo to ICAO standard…</p>
            <ul className="mt-4 space-y-2 text-left text-sm">
              {PROCESSING_STEPS.map((s, i) => (
                <li key={s} className={`flex items-center gap-2 ${i <= stepIndex ? "" : "opacity-40"}`}>
                  {i < stepIndex ? (
                    <CheckCircle2 className="size-4 text-amber-600" aria-hidden="true" />
                  ) : (
                    <span className="size-4 rounded-full border-2 border-gray-300" aria-hidden="true" />
                  )}
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

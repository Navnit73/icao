/**
 * Client-side helpers for sending a photo to the id-photo-maker processing proxy
 * (POST /api/passport-photo). Used by the homepage IcaoPhotoTool.
 */

import type { PassportProcessResult } from "@/lib/passport-api";

export interface ProcessedResultMeta {
  countryCode: string;
  countryName: string;
  documentType: string;
  /** "widthxheight" in pixels, e.g. "600x750". */
  targetDimensions?: string;
  /** Data URL of the photo the user uploaded, shown on the preview page. */
  originalPreview?: string | null;
}

/** Uploads a photo to the server-side proxy and returns the processed result. */
export async function requestPhotoProcessing(
  file: File,
  countryCode: string,
  documentType: string
): Promise<PassportProcessResult> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const freshFile = new File([file], `upload_${Date.now()}.${fileExt}`, {
    type: file.type,
  });

  const formData = new FormData();
  formData.append("image", freshFile);
  formData.append("country_code", countryCode);
  formData.append("document_type", documentType || "passport");

  const res = await fetch("/api/passport-photo", {
    method: "POST",
    body: formData,
  });

  let data: PassportProcessResult;
  try {
    data = await res.json();
  } catch {
    throw new Error("The photo service returned an unexpected response. Please try again.");
  }
  if (!res.ok || data.status === "error" || data.error) {
    throw new Error(data.error || "Failed to process passport photo.");
  }
  return data;
}

/**
 * Stores a processed result where /preview/[id] looks for it and returns the
 * result id to navigate to.
 */
export function saveProcessedResult(
  result: PassportProcessResult,
  meta: ProcessedResultMeta
): string {
  const timestamp = Date.now();
  const resultId =
    result.result_id || `res_${meta.countryCode.toLowerCase()}_${timestamp}`;

  const payload = {
    ...result,
    result_id: resultId,
    country_code: meta.countryCode,
    country_name: meta.countryName,
    target_dimensions: meta.targetDimensions,
    document_type: meta.documentType,
    original_preview: meta.originalPreview ?? undefined,
    timestamp,
  };

  if (typeof window !== "undefined") {
    const full = JSON.stringify(payload);
    // Without the original photo the preview still works (it just hides "Before").
    const slim = JSON.stringify({ ...payload, original_preview: undefined });
    const stores: Array<() => Storage> = [() => window.sessionStorage, () => window.localStorage];
    for (const getStore of stores) {
      let store: Storage;
      try {
        store = getStore(); // throws when site data is blocked
      } catch {
        continue;
      }
      pruneOldResults(store, resultId);
      if (!writeResult(store, resultId, full)) writeResult(store, resultId, slim);
    }
  }

  return resultId;
}

const STORAGE_PREFIX = "id-photo-maker_";
const LATEST_KEY = `${STORAGE_PREFIX}latest`;
/** Results kept per storage area; older ones are removed to stay under quota. */
const MAX_STORED_RESULTS = 3;

/** Writes the result under its own key and as "latest". Returns false if storage is full or blocked. */
function writeResult(store: Storage, resultId: string, json: string): boolean {
  try {
    store.setItem(`${STORAGE_PREFIX}${resultId}`, json);
    store.setItem(LATEST_KEY, json);
    return true;
  } catch {
    try {
      store.removeItem(`${STORAGE_PREFIX}${resultId}`);
    } catch {
      // Storage blocked
    }
    return false;
  }
}

/** Removes all but the newest stored results so the browser's ~5 MB quota does not fill up. */
function pruneOldResults(store: Storage, keepId: string): void {
  try {
    const entries: Array<{ key: string; ts: number }> = [];
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      if (!key || !key.startsWith(STORAGE_PREFIX) || key === LATEST_KEY) continue;
      if (key === `${STORAGE_PREFIX}${keepId}`) continue;
      let ts = 0;
      try {
        ts = Number(JSON.parse(store.getItem(key) || "{}").timestamp) || 0;
      } catch {
        // Unreadable entry: oldest, removed first
      }
      entries.push({ key, ts });
    }
    entries
      .sort((a, b) => b.ts - a.ts)
      .slice(MAX_STORED_RESULTS - 1)
      .forEach(({ key }) => store.removeItem(key));
  } catch {
    // Storage blocked
  }
}

/**
 * Downscales a photo to a JPEG data URL (long edge <= maxEdge) for the
 * "Before" preview, so it fits in browser storage. Falls back to the
 * full-size data URL if the browser cannot decode the image.
 */
export async function makePreviewDataUrl(file: Blob, maxEdge = 1600): Promise<string> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.88);
  } catch {
    return readFileAsDataUrl(file);
  }
}

/** Reads a file as a data URL (used for the "original photo" preview). */
export function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to read image file"));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

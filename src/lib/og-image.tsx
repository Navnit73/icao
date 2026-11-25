import { ImageResponse } from "next/og";

/**
 * Per-page Open Graph / social preview image (1200×630), rendered at build time
 * by each route's opengraph-image.tsx. Inline styles are required by ImageResponse.
 */

export interface OgImageOptions {
  /** Short label above the title, e.g. "UK passport photo checker". */
  eyebrow: string;
  /** Main headline, ideally the page H1. */
  title: string;
  /** Spec line under the title, e.g. "35 × 45 mm · 600 × 750 px". */
  detail?: string;
}

const INK = "#0A0A0A";
const MUTED = "#4B5563";
const ACCENT = "#FBBF24";
const PAPER = "#F3F4F6";

export function renderOgImage({ eyebrow, title, detail }: OgImageOptions): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FFFFFF",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 48 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: ACCENT,
              color: INK,
              fontSize: 26,
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: 999,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: title.length > 42 ? 58 : 68,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              color: INK,
            }}
          >
            {title}
          </div>
          {detail ? (
            <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: MUTED }}>{detail}</div>
          ) : null}
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              alignItems: "center",
              fontSize: 30,
              fontWeight: 700,
              color: INK,
            }}
          >
            <div style={{ display: "flex", width: 18, height: 18, borderRadius: 999, background: ACCENT, marginRight: 14 }} />
            id-photo-maker.com
          </div>
        </div>

        {/* Stylised 35 × 45 mm photo with head-height guides */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 360,
            background: PAPER,
            borderRadius: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              width: 245,
              height: 315,
              background: "#FFFFFF",
              border: `4px solid ${INK}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", position: "absolute", top: 34, left: 0, right: 0, borderTop: `3px dashed ${ACCENT}` }} />
            <div style={{ display: "flex", position: "absolute", top: 208, left: 0, right: 0, borderTop: `3px dashed ${ACCENT}` }} />
            <div style={{ display: "flex", marginTop: 40, width: 128, height: 164, borderRadius: 999, background: "#D1D5DB" }} />
            <div style={{ display: "flex", marginTop: 8, width: 230, height: 140, borderRadius: 120, background: "#D1D5DB" }} />
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

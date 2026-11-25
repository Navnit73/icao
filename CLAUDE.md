# id-photo-maker.com — AI & Engineering Guide (CLAUDE.md)

## 1. Project Overview & Mission

**id-photo-maker.com** (the only production domain: `https://id-photo-maker.com`) is a global ICAO standard photo maker and checker. Visitors upload a photo, pick a country, and get a passport, visa or ID photo at that country's exact size, head ratio and pixel spec (UK, US, India / Passport Seva, Schengen and 50+ more), plus printable 6×4″ and A4 sheets.

There is no other brand or domain. Never reference `pixpassport`, "PixPassport UK" or `icao-standard-photo.online` in user-facing code, metadata or docs. (The photo-processing backend still runs on its legacy host via `ID_PHOTO_MAKER_API_URL`; that is internal only.)

### Core Value Propositions

- **Free check and preview:** the ICAO check and a corrected preview are free; the watermark-free download is paid (PayPal, geo-priced; see `src/lib/currency.ts`).
- **Exact country specs:** sizes and pixel rules come from `src/config/countries.json`.
- **Privacy:** photos are processed for the order only, never sold or shared; no account needed.

---

## 2. Technology Stack

- **Framework:** Next.js (App Router)
- **Runtime / Library:** React 19 / TypeScript 5
- **Styling Engine:** Tailwind CSS v4
- **UI Component Library:** DaisyUI v5 (CSS-first configuration via `@plugin "daisyui/theme"`)
- **Icons:** Lucide React (`lucide-react`)
- **Content Infrastructure:** `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`
- **Fonts:** `next/font/google` (Geist Sans, Geist Mono)

---

## 3. Essential Commands

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run ESLint validation
npm run lint

# Compile production build
npm run build

# Run production server
npm start
```

---

## 4. Architectural Rules & Code Conventions

### Component Architecture

1. **Server Components by Default:** Keep all layout, SEO, static copy, and JSON-LD components as React Server Components.
2. **Client Components Only When Required:** Mark interactive components (e.g. `IcaoPhotoTool.tsx`, `Navbar.tsx` mobile drawer) with `"use client"`.
6. **Keep marketing pages static:** do not call `headers()` / `cookies()` in the homepage or landing pages; it makes them uncacheable. Geo-dependent UI fetches `/api/geo` in the browser (see `IcaoPhotoTool` `detectVisitorCountry`).
3. **No Competing UI Libraries:** Do NOT install or introduce shadcn/ui, Material UI, Mantine, Chakra, or other third-party component libraries. Use DaisyUI and custom CSS utility classes.
4. **Semantic Color Tokens:** Never hardcode arbitrary hex colors in component classes. Use semantic tokens (`bg-base-100`, `bg-base-200`, `text-primary`, `bg-secondary`, `text-base-content`, `border-base-300`).
5. **Reusable Props & SEO Friendly:** All components export strongly typed prop interfaces and default data constants, utilizing semantic HTML (`<header>`, `<nav>`, `<section>`, `<article>`, `<ol>`, `<ul>`, `<figure>`, `<footer>`) and ARIA landmarks.

### Design & Styling (`src/app/globals.css`)

- Theme is configured via `@plugin "daisyui/theme"` with the custom theme name `id-photo-maker`.
- **Primary:** `#65A30D` (Lime Green — `lime-600`), hover `#4D7C0F` (`lime-700`)
- **Secondary:** `#172033` (Deep Navy)
- **Accent:** `#0F766E` (Teal)
- **Neutral / Content:** `#172033`
- **Base 100 / 200 / 300:** `#FFFFFF` / `#F8FAFC` / `#E2E8F0`

### Image Handling & Icons

- Use `/id-photo-maker.jpg` (`LOGO_URL` in `src/lib/site.ts`) for favicon, Apple touch icon, schema logo, and email/invoice logos.
- Social preview images are per page: each route has an `opengraph-image.tsx` that calls `renderOgImage()` from `src/lib/og-image.tsx`. A new indexable page needs one too.
- Use Next.js `<Image />` component with descriptive `alt` text for brand logos and visual assets.

---

## 5. Photo Specifications

Country specs (physical size, pixels, head ratio, file limits) live in `src/config/countries.json`; do not hardcode them in components. Common reference points:

| Document                  | Size                      | Digital                      |
| :------------------------ | :------------------------ | :--------------------------- |
| India (Passport Seva 2.0) | 35 × 45 mm                | 630 × 810 px JPEG, ≤ 250 KB  |
| United Kingdom (HMPO)     | 35 × 45 mm                | 600 × 750 px minimum         |
| United States / DV / visa | 2 × 2 in (51 × 51 mm)     | 600 × 600 px, ≤ 240 KB (DV)  |
| Schengen / EU             | 35 × 45 mm                | Set by each portal           |

---

## 6. SEO & Search Strategy

### Page targeting (one primary keyword per page, no overlap)

| Route                              | Primary keyword                       |
| :--------------------------------- | :------------------------------------ |
| `/`                                | ICAO standard photograph              |
| `/passport-photo-checker`          | passport photo checker                |
| `/digital-passport-photo`          | digital passport photo                |
| `/passport-size-photo-maker`       | passport size photo maker             |
| `/35x45-photo-maker`               | 35x45 mm photo maker                  |
| `/white-background-passport-photo` | passport photo with white background  |
| `/uk/passport-photo-checker`       | UK passport photo checker             |
| `/us/passport-photo-checker`       | US passport photo checker             |
| `/us/passport-photo-size`          | US passport photo size                |
| `/us/visa-photo-checker`           | US visa photo checker                 |
| `/dv-lottery-photo-checker`        | DV lottery photo checker              |
| `/india/passport-photo-maker`      | Indian passport photo maker           |
| `/passport-photo-template-4x6`     | passport photo 4x6 template           |
| `/print-passport-photo-a4`         | print passport photo on A4            |

Landing page copy lives in `src/lib/seo/batch*-pages.ts` and renders through `CompactLandingPage.tsx`.

### Mandatory Metadata & Crawling Rules

- **Site URL:** always use `getSiteUrl()` / `SITE_URL` from `src/lib/site.ts`; never read `NEXT_PUBLIC_SITE_URL` directly. It resolves to `https://id-photo-maker.com` (CI sets the same value).
- **Canonical:** every indexable page sets a self-referencing `alternates.canonical`. The root layout deliberately sets none.
- **No hreflang:** the site is English-only with no translated or regional duplicates, so do not add `alternates.languages` to metadata or the sitemap.
- **Sitemap:** `src/app/sitemap.ts` is the only sitemap (there is no `public/sitemap.xml`). Add every new indexable route to `ROUTES`. **CRITICAL RULE:** do NOT add `lastModified`; entries are strictly `{ url, changeFrequency, priority }`.
- **robots:** `src/app/robots.ts` blocks `/api/` and `/preview/`; preview pages are also `noindex`.
- **Structured data:** `src/components/JsonLd.tsx` (Organization, WebSite, WebPage, WebApplication with offers, FAQPage, HowTo, BreadcrumbList).
- **Passport Photo API:** `src/lib/passport-api.ts` (server-side, `Authorization: Bearer <key>` and `x-api-key`), proxied by `src/app/api/passport-photo/route.ts` so the key never reaches the browser.

---

## 7. Directory Structure

```
id-photo-maker.com/
├── public/
│   ├── id-photo-maker.jpg         # Brand logo (schema, emails, invoices)
│   └── images/                    # Site-hosted example images
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── geo/route.ts           # Visitor country for client-side preselection
│   │   │   ├── passport-photo/route.ts # Server-side proxy to the photo API
│   │   │   ├── orders/, payments/, webhooks/, invoices/, download/, indexnow/
│   │   ├── <landing-page>/            # 13 keyword landing pages (see section 6)
│   │   │   ├── page.tsx               # Static; renders CompactLandingPage
│   │   │   └── opengraph-image.tsx    # Per-page social preview image
│   │   ├── preview/[id]/page.tsx      # Paid-download preview (noindex)
│   │   ├── layout.tsx                 # Root layout and shared metadata
│   │   ├── page.tsx                   # Homepage (static)
│   │   ├── opengraph-image.tsx        # Homepage social preview image
│   │   ├── not-found.tsx              # 404 (noindex)
│   │   ├── robots.ts                  # robots.txt
│   │   └── sitemap.ts                 # sitemap.xml (only sitemap)
│   ├── components/
│   │   ├── CompactLandingPage.tsx     # Landing page template + buildCompactMetadata()
│   │   ├── IcaoPhotoTool.tsx          # Upload + country picker (client)
│   │   ├── JsonLd.tsx                 # Schema.org graph
│   │   ├── PrintTemplateGenerator.tsx # 6×4″ / A4 print sheets (client)
│   │   └── Navbar.tsx, Footer.tsx, Section.tsx, PhotoPreview.tsx, ...
│   ├── config/countries.json, countries.ts   # Country photo specs
│   └── lib/
│       ├── site.ts                    # SITE_URL, getSiteUrl(), LOGO_URL, HERO_IMAGE
│       ├── og-image.tsx               # renderOgImage() for opengraph-image.tsx files
│       ├── seo/batch*-pages.ts        # Landing page copy
│       ├── currency.ts, config/pricing.ts  # Geo pricing
│       └── passport-api.ts            # Photo API client (server only)
├── CLAUDE.md, DESIGN.md, DEPLOY.md, README.md
└── next.config.ts, eslint.config.mjs, tsconfig.json
```

# ICAO Photo Maker — ICAO Standard Passport & ID Photos Online

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-v5-570DF8?style=flat-square)](https://daisyui.com/)

A Next.js web app for making **ICAO standard passport, visa and ID photos** for 50+ countries. A user uploads a photo and picks a country and document. The server sends it to the PixPassport processing API, which removes the background, crops to size and checks compliance. The user gets a free watermarked preview and pays (PayPal) to download the clean photo and a print-ready 6×4″ sheet.

The homepage is built around the keyword *"ICAO standard photograph"* and the *"photo is not valid as per ICAO standards"* errors from portals such as Passport Seva.

> This repo started as a fork of [pixpassport.uk](https://github.com/Navnit73/pixpassport.uk) and still uses its brand, theme and API. It deploys to **id-photo-maker.com** (see [Deployment](#-deployment)).

---

## ✨ Features

* 🌍 **50+ countries and document types**: sizes from [src/config/countries.json](src/config/countries.json) (e.g. UK 35×45 mm, US 2×2″, India, Schengen).
* 🤖 **Automatic processing**: background removal, auto-crop, head-size and compliance metrics, all from the PixPassport API.
* 👀 **Free watermarked preview** at `/preview/[id]` (not indexed) before any payment.
* 💳 **PayPal checkout** (PayPal or card) with two plans: **Standard** and **Expert Edit & Review**.
* 💱 **Geo-based pricing**: the visitor's country (from a geo-IP header) picks the currency. Supported: GBP, USD, EUR, CAD, AUD, NZD, SGD, HKD, CHF. India and the UAE are charged in USD.
* 🖨️ **6×4″ (10×15 cm) print sheet** built in the browser, for home or pharmacy printing.
* 🔍 **SEO setup**: metadata, JSON-LD, dynamic sitemap, robots.txt and IndexNow submission.

### Pricing (base prices)

| Currency | Standard | Expert Edit |
| :--- | ---: | ---: |
| GBP | £7.99 | £13.99 |
| USD | $8.99 | $16.99 |
| EUR | €7.99 | €15.99 |
| India (USD) | $5.99 | $10.99 |

All price points live in [src/lib/currency.ts](src/lib/currency.ts).

---

## 🔄 How It Works

```
Upload photo + choose country      (IcaoPhotoTool, client)
        │
        ▼
POST /api/passport-photo           (Next.js route, server)
        │  adds the API key, forwards the image
        ▼
PixPassport API /process           (background removal, crop, checks)
        │
        ▼
Result saved in session/localStorage → /preview/[id]
        │  watermarked preview
        ▼
PayPal Smart Buttons               (order created and captured in the browser,
        │                            amount and currency checked)
        ▼
Clean download + 6×4″ print sheet  (PrintTemplateGenerator, client)
```

**Privacy note:** the photo goes to our server and on to the PixPassport API for processing. The app does not save it to its own database. The processed result is kept in the user's browser storage.

### Server-side order pipeline (Razorpay)

The repo also has a server-side order flow: Razorpay orders, signature checks, webhooks, MongoDB payment records, PDF invoices uploaded to Cloudinary, signed download tokens, and Resend emails. The code is in `src/app/api/payments`, `src/app/api/webhooks/razorpay`, `src/app/api/download`, `src/app/api/invoices` and `src/lib/{payments,invoices,storage,email,db}`. **The current UI does not call it** because checkout is PayPal and runs in the browser. It needs `MONGODB_URI`, `RAZORPAY_*`, `CLOUDINARY_*` and `RESEND_*` if you turn it back on.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, TypeScript 5 |
| **Styling** | Tailwind CSS v4 + DaisyUI v5 (`pixpassport` theme in [globals.css](src/app/globals.css)) |
| **Icons** | Lucide React |
| **Payments** | `@paypal/react-paypal-js` (live); `razorpay` (server pipeline) |
| **Data / storage** | MongoDB, Cloudinary |
| **Email** | Resend |
| **Validation** | Zod |
| **PDF** | `pdf-lib` (invoices) |
| **Content** | MDX (`@next/mdx`), `remark`, `gray-matter` |
| **Deploy** | PM2 + nginx on a VPS, GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites

* Node.js 22 (the version CI and the server use)
* npm

### Setup

```bash
git clone https://github.com/Navnit73/icao.git
cd icao
npm install
# create .env.local with the variables below
npm run dev                  # http://localhost:3000
```

### Environment Variables

Only the first group is needed to run the photo tool locally. Never add the `NEXT_PUBLIC_` prefix to a secret.

| Variable | Needed for | Notes |
| :--- | :--- | :--- |
| `PIXPASSPORT_API_URL` | Photo processing | Base URL of the PixPassport API (server only) |
| `PIXPASSPORT_API_KEY` | Photo processing | Sent as `Authorization: Bearer` and `x-api-key` (server only) |
| `NEXT_PUBLIC_SITE_URL` | Metadata, canonical URLs, emails | e.g. `https://id-photo-maker.com`. Defaults to `https://pixpassport.uk` |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Checkout | Uses PayPal's `test` sandbox client if unset |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Support links / emails | |
| `GEO_PRICING_ENABLED`, `GEO_IP_HEADER`, `GEO_COUNTRY_OVERRIDE` | Geo pricing | `GEO_COUNTRY_OVERRIDE` is handy for testing a country locally |
| `PAYMENT_ENABLED_CURRENCIES`, `NEXT_PUBLIC_PAYMENT_CURRENCY` | Currency selection | e.g. `GBP,USD,EUR` |
| `MONGODB_URI`, `MONGODB_DB_NAME` | Server order pipeline | DB name defaults to `pixpassport` |
| `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Server order pipeline | |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Invoice PDF storage | |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_BCC_EMAIL` | Order emails | Emails are skipped when the key is unset |

`NEXT_PUBLIC_*` values are baked in at build time, so set them before `npm run build`.

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run indexnow` | Submit site URLs to IndexNow ([scripts/submit-indexnow.mjs](scripts/submit-indexnow.mjs)) |

---

## 📁 Project Structure

```
icao/
├── .github/workflows/deploy.yml   # Lint + build, then SSH deploy to the VPS
├── public/
│   ├── images/                    # Example photos
│   ├── pixpassport.jpg            # Brand asset
│   └── <key>.txt                  # IndexNow key file
├── scripts/
│   ├── deploy.sh                  # Server-side deploy with health check + auto-rollback
│   └── submit-indexnow.mjs        # IndexNow CLI
├── src/
│   ├── app/
│   │   ├── page.tsx               # Homepage: ICAO photo tool + guide content
│   │   ├── preview/[id]/page.tsx  # Watermarked preview + checkout (noindex)
│   │   ├── not-found.tsx
│   │   ├── layout.tsx             # Root layout & metadata
│   │   ├── sitemap.ts / robots.ts
│   │   └── api/
│   │       ├── passport-photo/    # Proxy to the PixPassport API
│   │       ├── indexnow/          # IndexNow submission endpoint
│   │       ├── payments/          # Razorpay create-order / verify / status
│   │       ├── webhooks/razorpay/
│   │       ├── download/[token]/  # Token-gated download
│   │       └── invoices/[paymentId]/
│   ├── components/
│   │   ├── IcaoPhotoTool.tsx      # Upload + country picker
│   │   ├── CountryCombobox.tsx
│   │   ├── PhotoPreview.tsx       # Preview, payment, download
│   │   ├── PaymentButton.tsx      # PayPal Smart Buttons
│   │   ├── PrintTemplateGenerator.tsx  # 6×4″ print sheet
│   │   ├── PricingProvider.tsx, Section.tsx
│   │   └── Navbar.tsx, Footer.tsx, JsonLd.tsx
│   ├── config/countries.{json,ts} # Country / document photo sizes
│   ├── lib/
│   │   ├── passport-api.ts        # Server-side API client
│   │   ├── photo-processing.ts    # Client helpers for upload + result storage
│   │   ├── currency.ts            # Currencies, prices, geo resolution
│   │   ├── config/pricing.ts      # Plan pricing
│   │   ├── payments/, invoices/, storage/, email/, db/, models/, logging/
│   │   └── seo/indexnow.ts, site.ts, image-compress.ts
│   └── instrumentation.ts         # Warms the MongoDB connection on start-up
├── ecosystem.config.cjs           # PM2 process (id-photo-maker, port 3009)
├── CLAUDE.md / AGENTS.md          # Assistant guides
├── DEPLOY.md                      # VPS deployment guide
└── DESIGN.md                      # Design system
```

---

## 🚢 Deployment

Production runs on a shared VPS behind nginx and Cloudflare, managed by PM2 as the `id-photo-maker` process on port **3009**.

* **CI/CD:** pushing to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml). It runs lint and build, then SSHes into the server and runs [scripts/deploy.sh](scripts/deploy.sh).
* **Deploy script:** takes a single-run lock, resets to `origin/main`, runs `npm ci` and `npm run build`, reloads PM2 and health-checks the port. It **rolls back automatically** to the previous commit and build if any step fails.
* **Secrets:** production env lives only on the server in `~/apps/id-photo-maker.com/.env.production` and is never committed. GitHub Actions needs the `HOST`, `USERNAME`, `SSH_KEY` and (optionally) `SSH_PORT` secrets.

The full step-by-step guide (nginx, TLS, DNS, port registry) is in [DEPLOY.md](DEPLOY.md).

---

## 📐 Photo Standards Reference

Each country's pixel size comes from `countries.json`. The common ICAO 9303 rules are:

* Plain, light background (white for many countries), with no shadows
* Face centred, looking at the camera, neutral expression, mouth closed
* Head height usually 70–80% of the photo (UK: 29–34 mm on 35×45 mm)
* No hats or tinted glasses (religious headwear allowed); eyes visible

---

## 📄 License

Private project (`"private": true` in `package.json`). There is no open-source licence file.

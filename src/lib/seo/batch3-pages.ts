import type { CompactLandingPageData } from "@/components/CompactLandingPage";

const REVIEWED_ISO = "2026-11-25";

/** Cluster 10: Digital Passport Photo (/digital-passport-photo) */
export const DIGITAL_PASSPORT_PHOTO_PAGE: CompactLandingPageData = {
  path: "/digital-passport-photo",
  primaryKeyword: "digital passport photo",
  seoTitle: "Digital Passport Photo Online — Exact Pixels for Portals",
  metaDescription:
    "Create a compliant digital passport photo online for UK, US, India, EU, and 50+ portals. Automatic white background, exact pixels, and free instant preview.",
  ogTitle: "Digital Passport Photo Online — Exact Pixels for Portals",
  ogDescription:
    "Turn any clear portrait into a portal-ready digital passport photo JPEG with exact country pixel dimensions, white background, and free instant preview.",
  lastReviewedIso: REVIEWED_ISO,
  breadcrumbLabel: "Digital Passport Photo",
  toolMode: "icao",
  defaultCountryCode: null,
  fallbackCountryCode: "GB",
  toolCtaLabel: "Make digital photo free",
  navCtaText: "Make digital photo",
  h1: "Digital Passport Photo Online for Government Portals",
  intro:
    "Applying online for a passport or e-visa? Government upload forms reject everyday phone images over wrong pixel dimensions, HEIC formats, heavy shadows, or oversized files. Create a digital passport photo online in one minute with exact country pixel sizing, clean background replacement, and a free instant preview.",
  primaryCtaText: "Create digital photo free",
  secondaryCtaText: "Check digital pixel specs",
  secondaryCtaHref: "#requirements",
  toolHeading: "Convert any phone portrait into a digital passport picture",
  toolSummary:
    "Choose your destination country below and upload a front-facing JPEG, PNG, or WebP photo for an instant digital preview.",
  featuresHeading: "Built for online passport applications",
  features: [
    "Exports exact portal-specific pixel dimensions: UK 600×750 px, US 600×600 px, India 630×810 px, and NZ 900×1200 px.",
    "Converts HEIC-converted, PNG, or WebP uploads into standard sRGB JPEG files ready for upload.",
    "Automatically centres your face, aligns eye height, and replaces busy backgrounds with plain white.",
    "Includes a free watermarked preview, email delivery after checkout, and optional human Expert review.",
  ],
  howItWorksHeading: "How to get a digital photo for passport upload",
  steps: [
    {
      name: "Pick your country portal",
      text: "Select from 50+ countries above to load exact digital pixel and aspect-ratio specs.",
    },
    {
      name: "Upload a front-facing portrait",
      text: "Have someone photograph you in natural daylight from 1 to 1.5 metres away.",
    },
    {
      name: "Review your free digital check",
      text: "Inspect head height, top margin, and background metrics before deciding to pay.",
    },
    {
      name: "Download your clean JPEG",
      text: "Complete a one-time payment to download the digital passport photo and receive an email copy.",
    },
  ],
  complianceHeading: "Digital passport photo technical requirements",
  complianceParagraphs: [
    "Online passport systems enforce strict file rules alongside biometric framing: GOV.UK requires JPEG at 600×750 px minimum (50 KB–10 MB); U.S. online portals require 600×600 to 1200×1200 px (≤240 KB); Indian Passport Seva 2.0 mandates 630×810 px (≤250 KB); and Immigration New Zealand specifies 900×1200 px (3:4 portrait). Never upload screenshots, beauty-filtered images, or scans of paper photos.",
    "ID Photo Maker automates pixel sizing, geometry checks, and background cleanup; final digital photo acceptance is always determined by the official application portal.",
  ],
  sources: [
    { name: "GOV.UK Digital Photos", url: "https://www.gov.uk/photos-for-passports" },
    { name: "Travel.State.Gov Photos", url: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html" },
    { name: "Passport Seva India", url: "https://www.passportindia.gov.in/" },
  ],
  whyHeading: "Why make your digital photo with ID Photo Maker?",
  whyBody:
    "Generic editors guess pixel sizes and skip biometric head ratios. ID Photo Maker maps 50+ official country specifications, shows a free side-by-side compliance preview with no account required, emails your clean JPEG immediately after PayPal checkout, and backs Expert-checked photos with a 30-day remake or refund.",
  faqHeading: "Digital passport photo FAQs",
  faqs: [
    {
      question: "What file format do online passport portals require?",
      answer:
        "Almost all government passport and visa portals require a standard 24-bit colour JPEG (.jpg) file rather than PNG, WebP, or iPhone HEIC.",
    },
    {
      question: "Does a digital passport photo come with a UK booth code?",
      answer:
        "No. ID Photo Maker generates a compliant digital JPEG file that you upload directly to GOV.UK or any online application form—no booth code is required for direct uploads.",
    },
    {
      question: "Can I also print my digital passport photo if needed?",
      answer:
        "Yes. Every paid download unlocks both the standalone digital JPEG for online submission and our 300 DPI 6×4″ print sheet builder.",
    },
    {
      question: "Do you store or share my digital passport picture?",
      answer:
        "Photos are processed over an encrypted connection only to build your download and are never sold, shared, or used to train models.",
    },
  ],
  finalCtaHeading: "Get your digital passport photo ready in 60 seconds",
  finalCtaBody:
    "Upload a front-facing portrait now for a free pixel, framing, and background check before downloading.",
  finalCtaButton: "Create digital photo",
  relatedLinks: [
    { href: "/passport-size-photo-maker", label: "Passport Size Photo Maker", description: "Auto-crop and size prints & digital photos." },
    { href: "/passport-photo-checker", label: "Passport Photo Checker", description: "Test any existing photo for compliance." },
    { href: "/uk/passport-photo-checker", label: "UK Passport Checker", description: "Verify 600×750 px GOV.UK upload specs." },
    { href: "/india/passport-photo-maker", label: "Indian Passport Maker", description: "Format 630×810 px Passport Seva files." },
  ],
};

/** Cluster 13 (absorbs Cluster 11 cropping keywords): Passport Size Photo Maker (/passport-size-photo-maker) */
export const PASSPORT_SIZE_PHOTO_MAKER_PAGE: CompactLandingPageData = {
  path: "/passport-size-photo-maker",
  primaryKeyword: "passport size photo maker",
  seoTitle: "Passport Size Photo Maker Online — 50+ Country Formats",
  metaDescription:
    "Make a passport size photo online in 60 seconds. Auto-crop, white background replacement, compliance check for 50+ countries, and 6×4″ print sheet preview.",
  ogTitle: "Passport Size Photo Maker Online — 50+ Country Formats",
  ogDescription:
    "Turn any smartphone portrait into a properly cropped passport size photo with white background and 6×4″ print sheet for 50+ countries.",
  lastReviewedIso: REVIEWED_ISO,
  breadcrumbLabel: "Passport Size Photo Maker",
  toolMode: "icao",
  defaultCountryCode: null,
  fallbackCountryCode: "GB",
  toolCtaLabel: "Make passport photo free",
  navCtaText: "Make passport photo",
  h1: "Passport Size Photo Maker & Auto-Cropper Online",
  intro:
    "Turn any clear smartphone picture into a government-sized ID photo without visiting a studio. Our online passport size photo maker automatically crops your portrait to exact country dimensions, replaces messy backgrounds with plain white, checks biometric head proportions, and gives you a free preview before download.",
  primaryCtaText: "Make passport photo free",
  secondaryCtaText: "Check size requirements",
  secondaryCtaHref: "#requirements",
  toolHeading: "Crop and make your passport photo online",
  toolSummary:
    "Select your country below and upload a front-facing portrait. We auto-crop to official passport dimensions and show a free before-and-after preview.",
  featuresHeading: "Key passport picture maker & cropper features",
  features: [
    "Automated biometric photo cropping—aligns eye level, chin-to-crown ratio, and top clearance precisely.",
    "50+ official country presets covering 35×45 mm, 2×2 inches, 50×70 mm, and 33×48 mm standards.",
    "Built-in plain white background replacement that clears indoor shadows and clutter.",
    "Generates both a clean digital JPEG and a 300 DPI printable 6×4″ sheet after one-time checkout.",
  ],
  howItWorksHeading: "How to make a passport photo online",
  steps: [
    {
      name: "Choose your country size",
      text: "Pick the country you are applying for so exact width, height, and head ratios load automatically.",
    },
    {
      name: "Upload your portrait",
      text: "Select a recent, evenly lit front-facing photo from your phone or computer.",
    },
    {
      name: "Inspect the auto-cropped preview",
      text: "Check head-height percentage, top margin, and white background free before paying.",
    },
    {
      name: "Download digital and print files",
      text: "Unlock your watermark-free JPEG and 6×4″ sheet with a single PayPal payment.",
    },
  ],
  complianceHeading: "Official passport photo size & cropping rules",
  complianceParagraphs: [
    "Cropping a photo manually often fails because passport authorities check head height and eye position, not just outer border size. Under ICAO Doc 9303, most countries—including the UK, EU, India, and Australia—use 35×45 mm with the head filling 70–80% of the frame (80–85% on Passport Seva 2.0), while the United States requires 2×2 inches (51×51 mm) with a 50–69% head ratio.",
    "ID Photo Maker runs automated cropping and framing checks for measurable technical rules; final acceptance is always decided by the issuing government office.",
  ],
  sources: [
    { name: "ICAO Doc 9303", url: "https://www.icao.int/publications/pages/publication.aspx?docnum=9303" },
    { name: "GOV.UK Photo Rules", url: "https://www.gov.uk/photos-for-passports" },
    { name: "Travel.State.Gov", url: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html" },
  ],
  whyHeading: "Why use ID Photo Maker instead of a manual cropper?",
  whyBody:
    "Free manual croppers make you guess chin-to-crown alignment and leave wall shadows untouched. ID Photo Maker automates face detection, background cleanup, and exact sizing in one minute—with a free preview, zero subscriptions, and optional human Expert verification backed by our 30-day remake or refund policy.",
  faqHeading: "Passport size photo maker FAQs",
  faqs: [
    {
      question: "How does automatic passport photo cropping work?",
      answer:
        "Our tool detects your eyes and head outline, centres your face, scales chin-to-crown height to your chosen country's biometric ratio, and trims the frame to exact official dimensions.",
    },
    {
      question: "Can I use a selfie to make a passport size photo?",
      answer:
        "Avoid arm-length selfies because wide-angle phone lenses distort facial proportions. Ask someone else to photograph you from 1 to 1.5 metres away in natural light.",
    },
    {
      question: "Do I get both digital and printable passport sizes?",
      answer:
        "Yes. One payment unlocks the watermark-free digital JPEG for online forms plus a 300 DPI printable 6×4″ sheet you can print at any photo kiosk or home printer.",
    },
  ],
  finalCtaHeading: "Make your passport size photo in one minute",
  finalCtaBody:
    "Upload any clear portrait now to auto-crop, clean the background, and preview your photo free.",
  finalCtaButton: "Make passport photo",
  relatedLinks: [
    { href: "/digital-passport-photo", label: "Digital Passport Photo", description: "Create exact pixel JPEGs for online portals." },
    { href: "/35x45-photo-maker", label: "35×45 mm Photo Maker", description: "Dedicated 35×45 mm formatter for UK, EU & India." },
    { href: "/white-background-passport-photo", label: "White Background Editor", description: "Replace dark or shadowed walls automatically." },
    { href: "/passport-photo-template-4x6", label: "4×6 Print Template", description: "Tile cropped photos onto a free 4×6″ sheet." },
  ],
};

/** Cluster 22: US Passport Photo Checker (/us/passport-photo-checker) */
export const US_PASSPORT_PHOTO_CHECKER_PAGE: CompactLandingPageData = {
  path: "/us/passport-photo-checker",
  primaryKeyword: "US passport photo checker",
  seoTitle: "US Passport Photo Checker — Free 2×2 Online Validator",
  metaDescription:
    "Check your US passport photo online free. Verify 2×2 inch (600×600 px) size, white background, 1–1⅜ in head height, and no-glasses rules before applying.",
  ogTitle: "US Passport Photo Checker — Free 2×2 Online Validator",
  ogDescription:
    "Validate your American passport picture online free against U.S. State Department 2×2 inch (600×600 px) framing and white-background rules.",
  ogLocale: "en_US",
  lastReviewedIso: REVIEWED_ISO,
  breadcrumbLabel: "US Passport Photo Checker",
  toolMode: "icao",
  defaultCountryCode: "US",
  fallbackCountryCode: "US",
  toolCtaLabel: "Check US passport photo free",
  navCtaText: "Check US photo",
  h1: "US Passport Photo Checker Online Free",
  intro:
    "Submitting a DS-11, mail-in DS-82, or online MyTravelGov passport renewal? The State Department's official cropper cannot be used for online renewals and does not test lighting or backgrounds. Our free US passport photo checker verifies 2×2 inch (600×600 px) framing, replaces backdrops with plain white, and shows an instant preview.",
  primaryCtaText: "Check US photo free",
  secondaryCtaText: "See US passport rules",
  secondaryCtaHref: "#requirements",
  toolHeading: "Validate your American passport picture online",
  toolSummary:
    "United States (600×600 px / 2×2 inches) is preselected below. Upload a recent portrait for a free compliance check and preview.",
  featuresHeading: "What our US passport photo validator checks",
  features: [
    "Exact 1:1 square framing at 600×600 px for digital portals and 2×2 inches (51×51 mm) for print.",
    "Head-height verification inside the mandatory 1 to 1⅜ inch (50–69%) vertical window.",
    "Automatic plain white background cleanup to remove shadows, doors, or off-colour walls.",
    "Free side-by-side preview plus a 2×2 inch 4×6″ sheet (print for under $0.50 at CVS or Walgreens).",
  ],
  howItWorksHeading: "How to check a US passport photo online",
  steps: [
    {
      name: "Take a recent photo without glasses",
      text: "Stand facing a bright window with a neutral expression or natural closed-mouth smile.",
    },
    {
      name: "Upload to the US checker",
      text: "Drop your JPEG, PNG, or WebP file above with United States 600×600 px preselected.",
    },
    {
      name: "Review your free compliance preview",
      text: "Check head-height percentage, top clearance, and clean white background side by side.",
    },
    {
      name: "Download digital or print sheet",
      text: "Pay once to unlock your clean JPEG and 4×6″ sheet holding 2×2 inch prints.",
    },
  ],
  complianceHeading: "Official U.S. passport photo requirements",
  complianceParagraphs: [
    "Per U.S. Department of State guidelines, passport photos must be taken within the last six months, printed at exactly 2×2 inches (51×51 mm) on matte or glossy photo paper—or uploaded as a 600×600 to 1200×1200 px JPEG under 240 KB for digital submissions. Head height must measure 1 to 1⅜ inches (25–35 mm) on a plain white or off-white background. Eyeglasses have been prohibited since November 2016 except with a signed doctor's statement.",
    "ID Photo Maker runs automated framing and background checks to help avoid delays; final passport photo acceptance is always determined by the U.S. Department of State.",
  ],
  sources: [
    { name: "Travel.State.Gov Passport Photos", url: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html" },
    { name: "Official State Dept Photo Tool", url: "https://tsg.phototool.state.gov/photo" },
  ],
  whyHeading: "Why use ID Photo Maker for U.S. passport photos?",
  whyBody:
    "Drugstore counters charge $16.99 to $17.99 for two paper prints, and free croppers ignore shadows and head scaling. ID Photo Maker checks your photo free, cleans the white background automatically, lets you print a 2×2 inch 4×6″ sheet for pennies, and offers optional human Expert verification.",
  faqHeading: "US passport photo checker FAQs",
  faqs: [
    {
      question: "Can I use the State Department Photo Tool for online passport renewal?",
      answer:
        "No. The U.S. Department of State explicitly advises against using tsg.phototool.state.gov for online passport renewals—and notes it does not verify photo quality or lighting.",
    },
    {
      question: "Are eyeglasses allowed in a U.S. passport photo?",
      answer:
        "No. Remove all eyeglasses before taking your photo unless you have a documented medical exception accompanied by a signed physician statement.",
    },
    {
      question: "Can I smile in an American passport picture?",
      answer:
        "A neutral expression is safest, though the State Department allows a natural, closed-mouth smile with both eyes fully open and looking straight at the camera.",
    },
  ],
  finalCtaHeading: "Check your US passport photo before you apply",
  finalCtaBody:
    "Upload your portrait now for a free 2×2 inch (600×600 px) compliance check and corrected preview.",
  finalCtaButton: "Check US photo now",
  relatedLinks: [
    { href: "/us/passport-photo-size", label: "US Passport Photo Size", description: "Exact 2×2 inch, mm, and pixel sizing guide." },
    { href: "/us/visa-photo-checker", label: "US Visa Photo Checker", description: "Verify 600×600 px DS-160 & USCIS photos." },
    { href: "/dv-lottery-photo-checker", label: "DV Lottery Photo Checker", description: "Check 600×600 px Green Card entry photos." },
    { href: "/passport-photo-template-4x6", label: "4×6 Print Template", description: "Tile 2×2″ photos onto a free 4×6″ kiosk sheet." },
  ],
};

/** Cluster 23: US Passport Photo Size (/us/passport-photo-size) */
export const US_PASSPORT_PHOTO_SIZE_PAGE: CompactLandingPageData = {
  path: "/us/passport-photo-size",
  primaryKeyword: "US passport photo size",
  seoTitle: "US Passport Photo Size (2×2 in) — Exact Specs & Resizer",
  metaDescription:
    "US passport photo size is 2×2 inches (51×51 mm) or 600×600 to 1200×1200 px online. Auto-resize your photo with 1–1⅜ in head height and 4×6″ print template.",
  ogTitle: "US Passport Photo Size (2×2 in) — Exact Specs & Resizer",
  ogDescription:
    "Resize any portrait to the exact US passport photo size: 2×2 inches (51×51 mm), 600×600 px digital JPEG, and 1–1⅜ inch head height with a 4×6″ print sheet.",
  ogLocale: "en_US",
  lastReviewedIso: REVIEWED_ISO,
  breadcrumbLabel: "US Passport Photo Size",
  toolMode: "icao",
  defaultCountryCode: "US",
  fallbackCountryCode: "US",
  toolCtaLabel: "Resize to 2×2 in free",
  navCtaText: "Resize to 2×2″",
  h1: "US Passport Photo Size (2×2 Inches) & Instant Resizer",
  intro:
    "The official US passport photo size is exactly 2×2 inches (51×51 mm) for paper applications and 600×600 to 1200×1200 pixels for online uploads. Getting the head height and eye line right matters just as much as the square border. Upload your portrait below to auto-resize to exact U.S. measurements and preview free.",
  primaryCtaText: "Resize to 2×2 inches",
  secondaryCtaText: "View exact measurements",
  secondaryCtaHref: "#requirements",
  toolHeading: "Auto-resize your photo to 2×2 US passport dimensions",
  toolSummary:
    "United States (600×600 px / 2×2 in) is preselected below. Upload your portrait to format exact square proportions and plain white background.",
  featuresHeading: "What our 2×2 US passport size tool formats",
  features: [
    "Exact 2×2 inch (51×51 mm) square aspect ratio and 600×600 px sRGB JPEG digital output.",
    "Scales chin-to-crown head height strictly between 1 inch and 1⅜ inches (25–35 mm).",
    "Replaces patterned or shadowed walls with a clean, uniform white background automatically.",
    "Generates a printable 4×6″ template holding 2×2 inch copies alongside your clean JPEG after checkout.",
  ],
  howItWorksHeading: "How to resize a photo to US passport dimensions",
  steps: [
    {
      name: "Upload a front-facing portrait",
      text: "Choose a recent, unedited photo taken without glasses in even indoor daylight.",
    },
    {
      name: "Auto-scale to 2×2 measurements",
      text: "Our tool centres your face, aligns head height to 50–69%, and cleans the background.",
    },
    {
      name: "Check your free preview",
      text: "Confirm square 600×600 px dimensions, head height percentage, and top clearance.",
    },
    {
      name: "Download digital file & 4×6″ sheet",
      text: "Unlock the watermark-free JPEG and print 2×2 inch photos at CVS, Walgreens, or Walmart.",
    },
  ],
  complianceHeading: "Official U.S. passport photo measurements",
  complianceParagraphs: [
    "U.S. Department of State size specifications require a 2×2 inch (51×51 mm) printed photo where your head measures 1 to 1⅜ inches (25–35 mm) from bottom of chin to top of hair, and eyes sit 1⅛ to 1⅜ inches (28–35 mm) from the bottom edge. Digital uploads must be square JPEG files between 600×600 and 1200×1200 pixels, 24-bit sRGB colour, and 240 KB or less on a plain white or off-white backdrop.",
    "ID Photo Maker verifies measurable dimensions and proportions automatically; final acceptance always belongs to the U.S. Department of State.",
  ],
  sources: [
    { name: "Travel.State.Gov Photo Specs", url: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html" },
    { name: "U.S. Visa Photo Dimensions", url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html" },
  ],
  whyHeading: "Why resize with ID Photo Maker?",
  whyBody:
    "Cropping a photo to 2×2 inches in a phone gallery ignores head height, eye level, and white-background rules. ID Photo Maker locks every U.S. State Department measurement automatically, previews your result free with no signup, and includes a 4×6″ print sheet so you skip $17 pharmacy passport fees.",
  faqHeading: "US passport photo size FAQs",
  faqs: [
    {
      question: "What is the exact US passport photo size in cm and mm?",
      answer:
        "A printed U.S. passport photo measures exactly 51×51 mm (5.1×5.1 cm), which equals 2×2 inches.",
    },
    {
      question: "What is 2×2 inches in pixels for a US passport photo?",
      answer:
        "At 300 DPI for printing, 2×2 inches equals 600×600 pixels. Digital U.S. portals accept square JPEGs from 600×600 px up to 1200×1200 px under 240 KB.",
    },
    {
      question: "Can I print 2×2 passport photos on a 4×6 sheet at Walgreens or CVS?",
      answer:
        "Yes. Print your 4×6″ sheet as a standard 4×6 photo at 100% scale (no auto-crop), then trim each 2×2 inch square along the corner guides.",
    },
  ],
  finalCtaHeading: "Format your 2×2 inch US passport photo now",
  finalCtaBody:
    "Upload any clear portrait above to resize to exact U.S. passport measurements and preview free.",
  finalCtaButton: "Resize to 2×2 now",
  relatedLinks: [
    { href: "/us/passport-photo-checker", label: "US Passport Checker", description: "Verify full U.S. passport compliance rules." },
    { href: "/us/visa-photo-checker", label: "US Visa Photo Checker", description: "Check 600×600 px DS-160 & USCIS photos." },
    { href: "/passport-photo-template-4x6", label: "4×6 Print Template", description: "Tile 2×2″ photos onto a free 4×6″ sheet." },
    { href: "/dv-lottery-photo-checker", label: "DV Lottery Photo Checker", description: "Validate 600×600 px Green Card entries." },
  ],
};

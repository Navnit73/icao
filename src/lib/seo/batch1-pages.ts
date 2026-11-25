import type { CompactLandingPageData } from "@/components/CompactLandingPage";

const REVIEWED_ISO = "2026-11-25";

/** Cluster 1: General Passport Photo Checker (/passport-photo-checker) */
export const PASSPORT_PHOTO_CHECKER_PAGE: CompactLandingPageData = {
  path: "/passport-photo-checker",
  primaryKeyword: "passport photo checker",
  seoTitle: "Passport Photo Checker — Free Online Biometric Check",
  metaDescription:
    "Test your passport photo online free. Check head size, eye line, white background, and exact dimensions for 50+ countries, then preview a fixed copy.",
  ogTitle: "Passport Photo Checker — Free Online Biometric Check",
  ogDescription:
    "Check passport photos online free against official size, head-height, and background rules for 50+ countries, with an instant corrected preview.",
  lastReviewedIso: REVIEWED_ISO,
  breadcrumbLabel: "Passport Photo Checker",
  defaultCountryCode: null,
  fallbackCountryCode: "GB",
  toolCtaLabel: "Check my photo free",
  h1: "Online Passport Photo Checker for 50+ Countries",
  intro:
    "Avoid portal rejections before you apply. Our free passport photo checker tests any portrait against official biometric dimensions, head height, eye alignment, and plain-background rules for over 50 countries. Upload your image, review a corrected preview in about a minute, and pay only if you want the clean download.",
  primaryCtaText: "Check your photo free",
  secondaryCtaText: "View compliance rules",
  secondaryCtaHref: "#requirements",
  toolHeading: "Check and fix your passport picture online",
  toolSummary:
    "Select your country below and upload a front-facing JPEG, PNG, or WebP photo for an instant compliance check and preview.",
  featuresHeading: "What our passport photo validator checks",
  features: [
    "Exact country pixel dimensions and aspect ratio across 50+ passport and ID formats.",
    "Biometric head-height percentage, eye-line position, and top crown margin.",
    "Automatic plain white background replacement to remove wall shadows and clutter.",
    "Free before-and-after preview with optional human Expert review and 6×4″ print sheet.",
  ],
  howItWorksHeading: "How to check a passport photo online",
  steps: [
    {
      name: "Choose your country",
      text: "Pick the issuing country from the list to load its official pixel and framing rules.",
    },
    {
      name: "Upload your photo",
      text: "Add a recent front-facing smartphone or camera portrait with even light.",
    },
    {
      name: "Review the free check",
      text: "Inspect your side-by-side preview and automated head, margin, and background metrics.",
    },
    {
      name: "Download when ready",
      text: "Unlock the watermark-free JPEG and printable 6×4″ sheet with a one-time payment.",
    },
  ],
  complianceHeading: "Biometric passport photo requirements",
  complianceParagraphs: [
    "Most e-passports follow ICAO Doc 9303 standards: a recent colour photo taken within six months, neutral expression with mouth closed, eyes open looking straight ahead, even lighting without shadows, and a plain light background. Common print sizes include 35×45 mm (UK, EU, India, Australia) and 2×2 inches (US).",
    "ID Photo Maker runs automated geometric and background checks to help catch sizing and framing errors early, while final acceptance is always decided by the issuing government office.",
  ],
  sources: [
    { name: "ICAO Doc 9303", url: "https://www.icao.int/publications/pages/publication.aspx?docnum=9303" },
    { name: "GOV.UK", url: "https://www.gov.uk/photos-for-passports" },
    { name: "Travel.State.Gov", url: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html" },
  ],
  whyHeading: "Why use ID Photo Maker?",
  whyBody:
    "Basic free checkers only flag errors and leave you to re-edit. ID Photo Maker checks your photo and fixes background shadows, centring, and exact country pixel dimensions in one step—with a free watermarked preview, zero subscriptions, and optional human review backed by our 30-day remake or refund policy.",
  faqHeading: "Passport photo checker FAQs",
  faqs: [
    {
      question: "Is the online passport photo checker free to use?",
      answer:
        "Yes. Uploading your photo, running the automated biometric check, and viewing the corrected watermarked preview are free with no account required. You only pay if you choose to download the clean digital file and 6×4″ print sheet.",
    },
    {
      question: "Can I check a photo taken on my phone?",
      answer:
        "Yes. Ask someone to photograph you from 1 to 1.5 metres away in even daylight rather than taking an arm-length selfie, then upload the JPEG, PNG, or WebP file.",
    },
    {
      question: "Does passing the online check guarantee government approval?",
      answer:
        "No automated tool can grant official approval. Our checker tests measurable geometry, pixel size, and background rules; final approval always rests with the passport authority.",
    },
    {
      question: "Which countries are supported by this biometric photo checker?",
      answer:
        "ID Photo Maker supports over 50 countries including the UK, United States, India, Australia, Canada, China, New Zealand, and Schengen Area nations.",
    },
  ],
  finalCtaHeading: "Check your passport photo before you submit",
  finalCtaBody:
    "Upload your portrait now for a free biometric check and corrected preview in about one minute.",
  finalCtaButton: "Start free photo check",
  relatedLinks: [
    { href: "/", label: "ICAO Photo Checker", description: "Fix ICAO Doc 9303 and Passport Seva rejections." },
    { href: "/uk/passport-photo-checker", label: "UK Passport Photo Checker", description: "Check 600×750 px and 35×45 mm HMPO rules." },
    { href: "/us/visa-photo-checker", label: "US Visa Photo Checker", description: "Verify 600×600 px DS-160 and USCIS specs." },
    { href: "/dv-lottery-photo-checker", label: "DV Lottery Photo Checker", description: "Test 600×600 px Green Card entry photos." },
  ],
};

/** Cluster 2: UK Passport Photo Checker (/uk/passport-photo-checker) */
export const UK_PASSPORT_PHOTO_CHECKER_PAGE: CompactLandingPageData = {
  path: "/uk/passport-photo-checker",
  primaryKeyword: "UK passport photo checker online free",
  seoTitle: "UK Passport Photo Checker Online Free — HMPO Size Check",
  metaDescription:
    "Check your UK passport photo online free against HMPO size (600×750 px / 35×45 mm), head height, and framing rules. Preview a compliant copy in 60 seconds.",
  ogTitle: "UK Passport Photo Checker Online Free — HMPO Size Check",
  ogDescription:
    "Test your British passport picture free online against HM Passport Office size, framing, and background rules before uploading to GOV.UK.",
  ogLocale: "en_GB",
  lastReviewedIso: REVIEWED_ISO,
  breadcrumbLabel: "UK Passport Photo Checker",
  defaultCountryCode: "GB",
  fallbackCountryCode: "GB",
  toolCtaLabel: "Check UK photo free",
  h1: "UK Passport Photo Checker Online Free",
  intro:
    "Applying or renewing on GOV.UK and unsure if your photo will pass? Our free UK passport photo checker tests your portrait against HM Passport Office size, head-height, and framing standards. Upload your image, check the metrics, and inspect a corrected 600×750 px preview before you decide to download.",
  primaryCtaText: "Check UK photo free",
  secondaryCtaText: "Read HMPO photo rules",
  secondaryCtaHref: "#requirements",
  toolHeading: "Check your UK passport picture online",
  toolSummary:
    "United Kingdom (600×750 px) is preselected below. Upload a recent portrait for a free automated check and side-by-side preview.",
  featuresHeading: "Key UK passport checker features",
  features: [
    "Checks official 600×750 px minimum digital dimensions and 35×45 mm print proportions.",
    "Verifies 29–34 mm chin-to-crown head height ratio and clear top crown margin.",
    "Replaces cluttered backgrounds cleanly and centres your eye line automatically.",
    "Includes a watermark-free JPEG for direct GOV.UK upload plus a 6×4″ print sheet after purchase.",
  ],
  howItWorksHeading: "How to check a UK passport photo online",
  steps: [
    {
      name: "Take a plain portrait",
      text: "Have someone photograph your head and shoulders in even daylight without glasses or filters.",
    },
    {
      name: "Upload to the UK checker",
      text: "Drop your JPEG, PNG, or WebP file into the preconfigured UK tool above.",
    },
    {
      name: "Inspect your free preview",
      text: "Review head-height percentage, top margin, and background checks side by side.",
    },
    {
      name: "Download and upload to GOV.UK",
      text: "Unlock the clean JPEG for direct online submission or print the 6×4″ sheet for paper forms.",
    },
  ],
  complianceHeading: "HM Passport Office photo requirements",
  complianceParagraphs: [
    "According to GOV.UK guidelines, digital UK passport photos must be taken within the last month, saved as JPEG between 50 KB and 10 MB, and measure at least 600×750 pixels. Printed photos require 35×45 mm sizing with a 29–34 mm head height. HMPO specifies a plain cream or light-grey background, closed mouth, neutral expression, and eyes clearly visible without glare.",
    "ID Photo Maker performs automated technical checks and outputs a digital JPEG for direct GOV.UK upload—not a booth photo code. HM Passport Office always makes the final approval decision.",
  ],
  sources: [
    { name: "GOV.UK Digital Photos", url: "https://www.gov.uk/photos-for-passports" },
    { name: "GOV.UK Printed Photo Rules", url: "https://www.gov.uk/photos-for-passports/photo-requirements" },
  ],
  whyHeading: "Why use ID Photo Maker for UK photos?",
  whyBody:
    "GOV.UK does not offer a standalone pre-application checker, and high-street booths cost £10 to £15 per session. ID Photo Maker lets you test unlimited retries at home with a free preview, clear metric checks, optional human Expert review, and a 30-day remake or refund policy if an Expert-checked photo is rejected.",
  faqHeading: "UK passport photo checker FAQs",
  faqs: [
    {
      question: "Do I need a digital photo code for a UK passport online?",
      answer:
        "No. GOV.UK allows you to upload a compliant digital JPEG file directly from your phone or computer. ID Photo Maker supplies a digital file for direct upload rather than a booth code.",
    },
    {
      question: "What background colour does HM Passport Office prefer?",
      answer:
        "GOV.UK recommends a plain cream or light-grey background with clear contrast and no shadows. Stand half a metre from a light wall in natural daylight for the best result.",
    },
    {
      question: "Can I wear glasses in my UK passport picture?",
      answer:
        "Remove glasses unless you must wear them for medical reasons. Tinted lenses are not allowed, and frames or reflections over your eyes trigger automatic rejections.",
    },
    {
      question: "Is the UK passport photo check free?",
      answer:
        "Yes. Checking your photo and viewing the watermarked preview are free with no signup. You only pay if you download the clean digital file and 6×4″ print sheet.",
    },
  ],
  finalCtaHeading: "Check your UK passport photo before applying",
  finalCtaBody:
    "Upload your portrait now for a free UK size and framing check with an instant preview.",
  finalCtaButton: "Check UK photo now",
  relatedLinks: [
    { href: "/passport-photo-checker", label: "General Passport Checker", description: "Check biometric photos for 50+ countries." },
    { href: "/", label: "ICAO Photo Checker", description: "Verify full ICAO Doc 9303 photo rules." },
    { href: "/us/visa-photo-checker", label: "US Visa Photo Checker", description: "Check 600×600 px US DS-160 visa photos." },
    { href: "/dv-lottery-photo-checker", label: "DV Lottery Photo Checker", description: "Validate Green Card Lottery 600×600 photos." },
  ],
};

/** Cluster 4: US Visa Photo Checker (/us/visa-photo-checker) */
export const US_VISA_PHOTO_CHECKER_PAGE: CompactLandingPageData = {
  path: "/us/visa-photo-checker",
  primaryKeyword: "US visa photo checker",
  seoTitle: "US Visa Photo Checker — Free DS-160 600×600 Compliance",
  metaDescription:
    "Check your US visa photo online for DS-160 and USCIS rules: 600×600 px JPEG, under 240 KB, white background, and 50–69% head height. Preview free instantly.",
  ogTitle: "US Visa Photo Checker — Free DS-160 600×600 Compliance",
  ogDescription:
    "Verify your US visa photo against DS-160 and USCIS 600×600 px, 2×2 inch, and white-background rules with a free instant preview.",
  ogLocale: "en_US",
  lastReviewedIso: REVIEWED_ISO,
  breadcrumbLabel: "US Visa Photo Checker",
  defaultCountryCode: "US",
  fallbackCountryCode: "US",
  toolCtaLabel: "Check US visa photo free",
  h1: "US Visa Photo Checker for DS-160 & USCIS",
  intro:
    "The official U.S. State Department cropper only resizes your image—it does not check backgrounds, lighting, or head proportions. Our US visa photo checker tests your portrait against 600×600 px DS-160 and 2×2 inch USCIS standards, replaces cluttered backdrops with plain white, and shows a free preview in seconds.",
  primaryCtaText: "Check US visa photo free",
  secondaryCtaText: "See DS-160 rules",
  secondaryCtaHref: "#requirements",
  toolHeading: "Run a free US visa photo check online",
  toolSummary:
    "United States (600×600 px) is preselected below. Upload your portrait to verify square framing, head height, and plain white background.",
  featuresHeading: "What our US visa photo tool validates",
  features: [
    "Exact 600×600 px square digital format for DS-160 and DS-260 portal uploads.",
    "Head-height alignment within the 50–69% (1 to 1⅜ inch) U.S. State Department window.",
    "Automatic plain white background replacement to remove shadows and patterns.",
    "Instant 2×2 inch layout on a printable 6×4″ sheet alongside your digital JPEG after checkout.",
  ],
  howItWorksHeading: "How to crop and check a US visa photo",
  steps: [
    {
      name: "Take a straight-on photo",
      text: "Face the camera in even light with no glasses, neutral expression, and both eyes open.",
    },
    {
      name: "Upload to the US visa tool",
      text: "Select your JPEG, PNG, or WebP file—United States 600×600 px is already loaded.",
    },
    {
      name: "Check the free preview",
      text: "Review your side-by-side corrected image, head-height metric, and background status.",
    },
    {
      name: "Download digital and print files",
      text: "Unlock the clean DS-160 JPEG and a 6×4″ sheet holding 2×2 inch prints for interviews.",
    },
  ],
  complianceHeading: "Official US visa & USCIS photo requirements",
  complianceParagraphs: [
    "U.S. Department of State guidelines require a recent colour photo taken within six months, square 1:1 ratio, 600×600 to 1200×1200 pixels in JPEG format under 240 KB (2×2 inches / 51×51 mm for paper prints). Your head must measure 50–69% of the image height against a plain white or off-white background, with no eyeglasses allowed except documented medical exceptions.",
    "ID Photo Maker runs automated sizing and framing checks to reduce upload errors, while final visa photo acceptance is always determined by the U.S. embassy, consulate, or USCIS officer.",
  ],
  sources: [
    { name: "Travel.State.Gov Visa Photos", url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html" },
    { name: "State Dept Photo Tool", url: "https://tsg.phototool.state.gov/photo" },
  ],
  whyHeading: "Why use ID Photo Maker for US visas?",
  whyBody:
    "Unlike basic croppers that fail when wall shadows or off-centre faces trigger DS-160 rejections, ID Photo Maker validates your framing, replaces the background with plain white, and formats both digital and 2×2 inch print sheets at once—with a free preview and optional human Expert review.",
  faqHeading: "US visa photo checker FAQs",
  faqs: [
    {
      question: "Why isn't the official State Department photo tool enough?",
      answer:
        "The State Department tool only crops an image to square dimensions. It explicitly does not check background quality, shadows, lighting, or eyeglasses.",
    },
    {
      question: "Can I wear eyeglasses in my US visa or USCIS photo?",
      answer:
        "No. Eyeglasses have been prohibited in U.S. visa and passport photos since November 2016 unless accompanied by a signed medical statement.",
    },
    {
      question: "What file size and pixel size does Form DS-160 require?",
      answer:
        "DS-160 requires a 24-bit colour JPEG between 600×600 and 1200×1200 pixels with a maximum file size of 240 KB.",
    },
    {
      question: "Do I get 2×2 inch prints for my embassy interview?",
      answer:
        "After downloading your clean digital JPEG, you can generate a 300 DPI 6×4″ print sheet formatted with 2×2 inch photos ready to print at any photo kiosk.",
    },
  ],
  finalCtaHeading: "Verify your US visa photo in one minute",
  finalCtaBody:
    "Upload your portrait for a free 600×600 px DS-160 compliance check and instant white-background preview.",
  finalCtaButton: "Check US visa photo",
  relatedLinks: [
    { href: "/dv-lottery-photo-checker", label: "DV Lottery Photo Checker", description: "Check 600×600 px Diversity Visa entries." },
    { href: "/passport-photo-checker", label: "Passport Photo Checker", description: "Validate biometric photos for 50+ countries." },
    { href: "/", label: "ICAO Photo Checker", description: "Fix ICAO Doc 9303 compliance errors online." },
    { href: "/uk/passport-photo-checker", label: "UK Passport Photo Checker", description: "Verify 600×750 px HMPO photo specs." },
  ],
};

/** Cluster 5: DV Lottery Photo Checker (/dv-lottery-photo-checker) */
export const DV_LOTTERY_PHOTO_CHECKER_PAGE: CompactLandingPageData = {
  path: "/dv-lottery-photo-checker",
  primaryKeyword: "DV lottery photo checker",
  seoTitle: "DV Lottery Photo Checker — Free 600×600 Green Card Test",
  metaDescription:
    "Check your DV Lottery photo online free. Verify 600×600 px JPEG size, under 240 KB, 50–69% head height, eye line, and plain white background before entry.",
  ogTitle: "DV Lottery Photo Checker — Free 600×600 Green Card Test",
  ogDescription:
    "Test your Diversity Visa Green Card Lottery photo online free against exact 600×600 px, head-height, and white-background rules.",
  ogLocale: "en_US",
  lastReviewedIso: REVIEWED_ISO,
  breadcrumbLabel: "DV Lottery Photo Checker",
  defaultCountryCode: "US",
  fallbackCountryCode: "US",
  toolCtaLabel: "Check DV Lottery photo free",
  h1: "DV Lottery Photo Checker — Free 600×600 Validation",
  intro:
    "A single photo error—wrong pixel dimensions, shadows, or outdated portraits—can disqualify your Diversity Visa entry without warning. Our free DV lottery photo checker validates your image against official 600×600 px Green Card rules, fixes the white background, and displays a corrected preview before you submit.",
  primaryCtaText: "Check DV photo free",
  secondaryCtaText: "See Green Card photo rules",
  secondaryCtaHref: "#requirements",
  toolHeading: "Validate your Diversity Visa photo online",
  toolSummary:
    "United States 600×600 px square format is preselected below. Upload your recent photo for a free automated check and preview.",
  featuresHeading: "Key DV photo checker capabilities",
  features: [
    "Formats and checks exact 600×600 px square JPEG dimensions for E-DV uploads.",
    "Aligns head height to the mandatory 50–69% frame range and proper eye level.",
    "Replaces uneven or coloured walls with a plain white background automatically.",
    "Offers a free watermarked preview plus optional human Expert review for added confidence.",
  ],
  howItWorksHeading: "How to check a DV Lottery photo",
  steps: [
    {
      name: "Take a new portrait",
      text: "Capture a fresh, unedited colour photo in even light with no glasses and a neutral face.",
    },
    {
      name: "Upload to the DV photo tool",
      text: "Drop your photo above—the 600×600 px U.S. square format is ready automatically.",
    },
    {
      name: "Inspect the compliance check",
      text: "Review head-height percentage, top margin, and background checks on the free preview.",
    },
    {
      name: "Download your entry JPEG",
      text: "Complete a one-time payment to download the clean JPEG ready for your DV application.",
    },
  ],
  complianceHeading: "Official Diversity Visa photo requirements",
  complianceParagraphs: [
    "Per U.S. Department of State instructions, every DV Lottery entry—including spouse and children—requires a JPEG photo sized 600×600 pixels (square 1:1 ratio) and no larger than 240 KB. The head must cover 50–69% of total height, eyes must sit 56–69% from the bottom, the background must be plain white or off-white, and glasses are not permitted. Photos must be taken within six months and never reused from a prior year.",
    "ID Photo Maker automates technical geometry and background checks; final entry eligibility is always evaluated solely by the U.S. Department of State.",
  ],
  sources: [
    { name: "Travel.State.Gov DV Photo Rules", url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html" },
    { name: "Official Photo Cropping Tool", url: "https://tsg.phototool.state.gov/photo" },
  ],
  whyHeading: "Why check your DV photo with ID Photo Maker?",
  whyBody:
    "Many free DV checkers only report pass or fail without fixing background shadows or head scaling. ID Photo Maker checks your photo and prepares a clean 600×600 px white-background JPEG in one minute, with a free preview, no account required, and optional human review.",
  faqHeading: "DV Lottery photo checker FAQs",
  faqs: [
    {
      question: "Can I reuse my photo from last year's DV Lottery?",
      answer:
        "No. Submitting the same photograph from a previous Diversity Visa entry causes automatic disqualification. Your photo must be taken within the last six months.",
    },
    {
      question: "Do children and spouses need separate 600×600 px photos?",
      answer:
        "Yes. Every family member listed on your Green Card entry requires an individual compliant 600×600 px JPEG under 240 KB.",
    },
    {
      question: "Are beauty filters or retouching allowed on DV photos?",
      answer:
        "No. Digital alterations that change your natural facial features can disqualify your entry. Use a sharp, unedited photo with even natural lighting.",
    },
    {
      question: "Is the DV Lottery photo check free?",
      answer:
        "Yes. Uploading your photo, viewing the automated metrics, and checking the watermarked preview are free. You pay only if you download the clean JPEG.",
    },
  ],
  finalCtaHeading: "Check your DV Lottery photo before entry",
  finalCtaBody:
    "Upload your portrait now for a free 600×600 px compliance check and instant corrected preview.",
  finalCtaButton: "Check DV photo now",
  relatedLinks: [
    { href: "/us/visa-photo-checker", label: "US Visa Photo Checker", description: "Check 600×600 px DS-160 and USCIS photos." },
    { href: "/passport-photo-checker", label: "Passport Photo Checker", description: "Validate biometric photos for 50+ countries." },
    { href: "/", label: "ICAO Photo Checker", description: "Check ICAO Doc 9303 photo rules online." },
    { href: "/uk/passport-photo-checker", label: "UK Passport Photo Checker", description: "Check UK 600×750 px HMPO photo specs." },
  ],
};

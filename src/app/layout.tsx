import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OG_IMAGE, OG_IMAGE_ALT } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const getMetadataBase = (): URL => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    try {
      const formatted =
        envUrl.startsWith("http://") || envUrl.startsWith("https://")
          ? envUrl
          : `https://${envUrl}`;
      return new URL(formatted);
    } catch {
      // Fall back to default if invalid URL
    }
  }
  return new URL("https://pixpassport.uk");
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL &&
  (process.env.NEXT_PUBLIC_SITE_URL.startsWith("http://") ||
    process.env.NEXT_PUBLIC_SITE_URL.startsWith("https://"))
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://pixpassport.uk";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),

  title: {
    default: "ICAO Standard Photograph Online | PixPassport",
    template: "%s | PixPassport",
  },

  description:
    "Make an ICAO standard photograph online. Fix “photo is not valid as per ICAO standards” for Passport Seva and 50+ countries, with a free preview.",

  authors: [{ name: "PixPassport", url: SITE_URL }],

  creator: "PixPassport",
  publisher: "PixPassport",

  // Canonical is set per page. A canonical here would be inherited by every
  // route that does not define its own and point it at the homepage.

  openGraph: {
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="pixpassport"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}

        {/* Microsoft Clarity - deferred until browser is idle */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "zipcs1itb4");
          `}
        </Script>

        {/* Google tag (gtag.js) - deferred until browser is idle */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4GEQP58E5C"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4GEQP58E5C');
          `}
        </Script>
      </body>
    </html>
  );
}

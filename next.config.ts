import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    // Single-page site: every retired URL 301s to the homepage so existing
    // links and rankings consolidate onto it.
    const retired = [
      "/tool",
      "/tool/:slug*",
      "/how-to",
      "/how-to/:slug*",
      "/passport-size-photo-maker",
      "/passport-size-photo-online",
      "/passport-photo-print-template-generator",
      "/print-passport-photos-at-home",
      "/about-us",
      "/contact-us",
      "/privacy-policy",
      "/terms-of-service",
      "/refund-policy",
      "/data-security-privacy-safeguards",
      "/uk-passport-photo",
      "/passport-renewal-photo-online",
      "/uk-baby-passport-photo",
      "/uk-driving-licence-photo",
      "/driving-licence-photo",
      "/photo-railcard",
      "/us-visa-photo",
      "/us-visa-photo-tool",
      "/schengen-visa-photo",
      "/indian-passport-photo",
      "/indian-passport-photo-maker",
      "/digital-passport-photo",
      "/photo-size-35x45mm",
      "/image-to-passport-size-converter",
      "/passport-photo-at-home",
      "/passport-photo-tool",
      "/online-id-photo-maker",
      "/order-passport-photos-online",
    ];
    return retired.map((source) => ({ source, destination: "/", permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/pixpassport.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icon.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/apple-icon.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);

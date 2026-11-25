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
    // Redirect retired legacy URLs to their best matching active landing pages.
    const toHome = [
      "/tool",
      "/tool/:slug*",
      "/how-to",
      "/how-to/:slug*",
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
      "/schengen-visa-photo",
      "/passport-photo-at-home",
      "/order-passport-photos-online",
    ];
    return [
      ...toHome.map((source) => ({ source, destination: "/", permanent: true })),
      { source: "/us-visa-photo", destination: "/us/visa-photo-checker", permanent: true },
      { source: "/us-visa-photo-tool", destination: "/us/visa-photo-checker", permanent: true },
      { source: "/passport-photo-print-template-generator", destination: "/passport-photo-template-4x6", permanent: true },
      { source: "/print-passport-photos-at-home", destination: "/print-passport-photo-a4", permanent: true },
      { source: "/photo-size-35x45mm", destination: "/35x45-photo-maker", permanent: true },
      { source: "/indian-passport-photo", destination: "/india/passport-photo-maker", permanent: true },
      { source: "/indian-passport-photo-maker", destination: "/india/passport-photo-maker", permanent: true },
      { source: "/passport-size-photo-online", destination: "/passport-size-photo-maker", permanent: true },
      { source: "/passport-photo-tool", destination: "/passport-size-photo-maker", permanent: true },
      { source: "/online-id-photo-maker", destination: "/passport-size-photo-maker", permanent: true },
      { source: "/image-to-passport-size-converter", destination: "/passport-size-photo-maker", permanent: true },
    ];
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
        source: "/id-photo-maker.jpg",
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

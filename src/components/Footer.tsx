import Image from "next/image";
import Link from "next/link";
import { PRICING } from "@/lib/config/pricing";

export interface FooterProps {
  supportEmail?: string;
  /** Visitor's local price, e.g. "₹499". */
  priceText?: string;
}

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#make-photo", label: "ICAO photo checker" },
      { href: "/#how-to", label: "How it works" },
      { href: "/#compare", label: "Compare" },
    ],
  },
  {
    title: "Guide",
    links: [
      { href: "/#what-is", label: "ICAO standard photograph" },
      { href: "/#meaning", label: "“Photo not valid” error" },
      { href: "/#requirements", label: "ICAO requirements" },
      { href: "/#examples", label: "Photo examples" },
      { href: "/#sizes", label: "Photo sizes" },
      { href: "/#india", label: "Indian passport photo" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/#refunds", label: "Refund policy" },
      { href: "/#privacy", label: "Privacy" },
      { href: "/#terms", label: "Terms" },
      { href: "/#contact", label: "Contact" },
    ],
  },
];

export default function Footer({ supportEmail = PRICING.supportEmail, priceText }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-gray-200 px-4 pt-12 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))]">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 font-semibold">
              <Image src="/pixpassport.jpg" alt="PixPassport logo" width={28} height={28} className="rounded-md" />
              PixPassport
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-pretty text-gray-500">
              ICAO-compliant passport, visa and ID photos from your phone photo, for 50+ countries.
              {priceText && <> From {priceText}, no subscription.</>}
            </p>
          </div>
          {FOOTER_COLUMNS.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <p className="text-sm font-semibold text-black">{title}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="text-gray-600 transition-colors hover:text-black">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-gray-500">
          PixPassport is an independent service. It is not affiliated with ICAO, Passport Seva, the Ministry of
          External Affairs, HM Passport Office or any government agency.
        </p>
        <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} PixPassport. All rights reserved.</p>
          <a href={`mailto:${supportEmail}`} className="transition-colors hover:text-black">
            {supportEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}

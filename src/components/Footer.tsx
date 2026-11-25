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
    title: "Photo Checkers",
    links: [
      { href: "/", label: "ICAO photo checker" },
      { href: "/passport-photo-checker", label: "Passport photo checker" },
      { href: "/uk/passport-photo-checker", label: "UK passport photo checker" },
      { href: "/us/passport-photo-checker", label: "US passport photo checker" },
      { href: "/us/visa-photo-checker", label: "US visa photo checker" },
      { href: "/dv-lottery-photo-checker", label: "DV lottery photo checker" },
    ],
  },
  {
    title: "Makers & Print Sheets",
    links: [
      { href: "/passport-size-photo-maker", label: "Passport size photo maker" },
      { href: "/digital-passport-photo", label: "Digital passport photo" },
      { href: "/35x45-photo-maker", label: "35×45 mm photo maker" },
      { href: "/us/passport-photo-size", label: "US passport photo size" },
      { href: "/white-background-passport-photo", label: "White background photo" },
      { href: "/india/passport-photo-maker", label: "Indian passport photo" },
      { href: "/passport-photo-template-4x6", label: "4×6 print template" },
      { href: "/print-passport-photo-a4", label: "Print on A4 paper" },
    ],
  },
  {
    title: "Guide & Legal",
    links: [
      { href: "/#requirements", label: "ICAO requirements" },
      { href: "/#meaning", label: "“Photo not valid” error" },
      { href: "/#faq", label: "FAQ" },
      { href: "/#refunds", label: "Refund policy" },
      { href: "/#privacy", label: "Privacy & terms" },
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
              <Image src="/id-photo-maker.jpg" alt="ID Photo Maker logo" width={28} height={28} className="rounded-md" />
              ID Photo Maker
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
          ID Photo Maker is an independent service. It is not affiliated with ICAO, Passport Seva, the Ministry of
          External Affairs, HM Passport Office or any government agency.
        </p>
        <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} ID Photo Maker. All rights reserved.</p>
          <a href={`mailto:${supportEmail}`} className="transition-colors hover:text-black">
            {supportEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}

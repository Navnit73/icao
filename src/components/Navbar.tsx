"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
}

export interface NavbarProps {
  links?: NavLink[];
  ctaHref?: string;
  ctaText?: string;
  /** Visitor's local price, e.g. "₹499"; shown in the CTA when set. */
  priceText?: string;
}

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { href: "/#requirements", label: "Requirements" },
  { href: "/#examples", label: "Examples" },
  { href: "/#india", label: "India" },
  { href: "/#how-to", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

const SCROLL_DELTA_PX = 6;

/** Floating header: transparent at the top, frosted once scrolled, hides while scrolling down. */
export default function Navbar({
  links = DEFAULT_NAV_LINKS,
  ctaHref = "/#make-photo",
  ctaText = "Upload photo",
  priceText,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) < SCROLL_DELTA_PX) return;
      setScrollingDown(y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const solid = scrolled || open;
  const hidden = scrollingDown && scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] transition-transform duration-300 sm:px-6 sm:pt-5 ${
        hidden ? "-translate-y-[120%]" : "translate-y-0"
      }`}
    >
      <div
        className={`mx-auto max-w-5xl rounded-2xl border transition-[background-color,border-color] duration-300 ${
          solid ? "border-gray-200/80 bg-white/80 backdrop-blur-xl backdrop-saturate-150" : "border-transparent"
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-2 pr-2 pl-3 sm:h-16 sm:pr-3 sm:pl-5">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 font-semibold tracking-tight" onClick={() => setOpen(false)}>
            <Image src="/pixpassport.jpg" alt="PixPassport logo" width={30} height={30} className="rounded-lg" priority />
            <span className="truncate">PixPassport</span>
          </Link>

          <nav aria-label="Main" className="flex shrink-0 items-center gap-1.5 text-sm md:gap-1">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="hidden rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-black md:block"
              >
                {label}
              </a>
            ))}
            <a
              href={ctaHref}
              className="ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 font-semibold whitespace-nowrap text-black transition-colors hover:bg-amber-500 active:bg-amber-500 sm:px-4"
            >
              {ctaText}
              {priceText && <span className="max-[379px]:hidden">· {priceText}</span>}
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex size-10 items-center justify-center rounded-lg text-black transition-colors active:bg-gray-100 md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </nav>
        </div>

        <div
          id="mobile-menu"
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
            open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
          inert={!open}
        >
          <div className="overflow-hidden">
            <nav aria-label="Mobile" className="mx-3 border-t border-gray-100 pt-1">
              {links.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-gray-100 px-1 py-3.5 text-base font-medium last:border-0 active:text-amber-700"
                >
                  {label}
                  <ArrowRight className="size-4 text-gray-400" />
                </a>
              ))}
            </nav>
            <div className="p-3 pt-2">
              <a
                href={ctaHref}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-black active:bg-amber-500"
              >
                {ctaText}
                {priceText && <> · {priceText}</>}
              </a>
              <p className="mt-2 text-center text-xs text-gray-500">Free preview · pay only to download</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

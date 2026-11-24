"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import type { CountryPassportConfig } from "@/config/countries";

export interface CountryComboboxProps {
  /** Options to choose from, already in display order. */
  countries: CountryPassportConfig[];
  /** Selected country_code. */
  value: string;
  onChange: (code: string) => void;
  label: string;
  /** Element id for the input; the label points at it. */
  id?: string;
}

/** Extra search terms people type for a format, keyed by country_code. */
export const COUNTRY_ALIASES: Record<string, string[]> = {
  GB: ["uk", "britain", "great britain", "england", "scotland", "wales", "hmpo"],
  US: ["usa", "america", "united states of america", "us visa"],
  EU: ["schengen", "europe", "eu visa"],
  IN: ["bharat", "passport seva", "oci"],
  AE: ["uae", "dubai", "abu dhabi", "emirates"],
  KR: ["korea"],
  CHE: ["swiss", "switzerland"],
  NZ: ["kiwi"],
};

function countryFlag(code: string): string {
  if (code.length !== 2 || code === "EU") return code === "EU" ? "🇪🇺" : "🌍";
  return code
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

function optionLabel(c: CountryPassportConfig): string {
  return `${c.country_name} — ${c.document_type || "passport"} (${c.dimensions} px)`;
}

function matches(c: CountryPassportConfig, q: string): boolean {
  if (!q) return true;
  const hay = [c.country_name, c.country_code, c.document_type, c.dimensions, ...(COUNTRY_ALIASES[c.country_code] ?? [])]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

/** Searchable, keyboard-accessible country picker (ARIA combobox with listbox popup). */
export default function CountryCombobox({ countries, value, onChange, label, id }: CountryComboboxProps) {
  const autoId = useId();
  const inputId = id ?? `country-${autoId}`;
  const listId = `${inputId}-list`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = countries.find((c) => c.country_code === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = countries.filter((c) => matches(c, q));
    if (!q) return list;
    // Names (or aliases/codes) that start with the query come first, then the rest, keeping display order
    const rank = (c: CountryPassportConfig) => {
      if (c.country_name.toLowerCase().startsWith(q) || c.country_code.toLowerCase() === q) return 0;
      if ((COUNTRY_ALIASES[c.country_code] ?? []).some((a) => a.startsWith(q))) return 1;
      if (c.country_name.toLowerCase().split(/\s+/).some((w) => w.startsWith(q))) return 2;
      return 3;
    };
    return list.map((c, i) => ({ c, i, r: rank(c) })).sort((a, b) => a.r - b.r || a.i - b.i).map((x) => x.c);
  }, [countries, query]);

  // Close when clicking or tapping outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted option visible while arrowing through the list
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function openList() {
    if (open) return;
    const idx = filtered.findIndex((c) => c.country_code === value);
    setActive(idx >= 0 ? idx : 0);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setQuery("");
  }

  function choose(code: string) {
    onChange(code);
    close();
    inputRef.current?.blur();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(filtered.length - 1);
        }
        break;
      case "Enter":
        if (open && filtered[active]) {
          e.preventDefault();
          choose(filtered[active].country_code);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          close();
        }
        break;
      case "Tab":
        close();
        break;
    }
  }

  const activeOption = open ? filtered[active] : undefined;

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>

      <div
        className={`flex items-center gap-2 rounded-xl bg-gray-100 px-3.5 ring-inset ${
          open ? "ring-2 ring-amber-400" : "ring-1 ring-gray-200"
        }`}
      >
        {open ? (
          <Search className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
        ) : (
          <span className="shrink-0 text-lg leading-none" aria-hidden="true">
            {selected ? countryFlag(selected.country_code) : "🌍"}
          </span>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeOption ? `${listId}-${activeOption.country_code}` : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder={open ? "Search country, e.g. India, UK, Schengen" : undefined}
          value={open ? query : selected ? optionLabel(selected) : ""}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            if (!open) setOpen(true);
          }}
          onFocus={openList}
          onClick={openList}
          onKeyDown={onKeyDown}
          className="w-full min-w-0 truncate bg-transparent py-3 text-base outline-none placeholder:text-gray-400 sm:text-sm"
        />
        {open && query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActive(0);
              inputRef.current?.focus();
            }}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200"
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => (open ? close() : inputRef.current?.focus())}
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200"
            aria-label={open ? "Close country list" : "Open country list"}
          >
            <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        )}
      </div>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 z-30 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-xl bg-white p-1 ring-1 ring-gray-200"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-4 text-center text-sm text-gray-500" role="presentation">
              No country matches “{query}”. Try another spelling.
            </li>
          ) : (
            filtered.map((c, i) => {
              const isSelected = c.country_code === value;
              const isActive = i === active;
              return (
                <li
                  key={c.country_code}
                  id={`${listId}-${c.country_code}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(c.country_code)}
                  onMouseMove={() => setActive(i)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    isActive ? "bg-amber-50" : ""
                  } ${isSelected ? "font-semibold" : ""}`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="text-base leading-none" aria-hidden="true">
                      {countryFlag(c.country_code)}
                    </span>
                    <span className="truncate">{c.country_name}</span>
                    <span className="shrink-0 text-xs text-gray-400 capitalize">{c.document_type || "passport"}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">{c.dimensions}px</span>
                    {isSelected && <Check className="size-4 text-amber-600" aria-hidden="true" />}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

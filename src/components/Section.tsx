import type { ReactNode } from "react";

export interface SectionProps {
  id?: string;
  /** Short amber label above the heading, e.g. "Requirements". */
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Landing-page section: centred eyebrow, H2 and subtitle above the content. */
export default function Section({ id, eyebrow, title, subtitle, className = "", children }: SectionProps) {
  return (
    <section id={id} className={`px-4 py-14 sm:px-6 sm:py-20 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="reveal mx-auto max-w-3xl text-center">
          {eyebrow && (
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase sm:mb-4 sm:text-sm">
              <span aria-hidden className="h-px w-5 bg-amber-500" />
              {eyebrow}
              <span aria-hidden className="h-px w-5 bg-amber-500" />
            </p>
          )}
          <h2 className="text-[clamp(1.75rem,6vw,2.9rem)] leading-[1.1] font-bold tracking-tight text-balance text-black">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-pretty text-gray-500 sm:mt-4 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        <div className="reveal mt-8 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}

/** Highlighted direct answer under a heading (featured-snippet friendly). */
export function AnswerBox({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-amber-50 p-5 text-base leading-relaxed text-pretty text-gray-800 ring-1 ring-amber-200 ring-inset sm:p-6 sm:text-lg">
      {children}
    </div>
  );
}

export interface InfoTableProps {
  caption?: string;
  head: string[];
  rows: string[][];
  /** Column index to emphasise (e.g. our own product). */
  highlightCol?: number;
}

/** Table in a grey card; first column is a row header. Below 640px each row stacks as a labelled card. */
export function InfoTable({ caption, head, rows, highlightCol }: InfoTableProps) {
  return (
    <div className="rounded-2xl bg-gray-100 p-2 sm:p-4">
      {caption && <h3 className="px-3 pt-2 pb-3 text-lg font-bold tracking-tight sm:text-xl">{caption}</h3>}
      <div className="rounded-xl sm:overflow-x-auto sm:bg-white">
        <table className="block w-full text-left text-sm sm:table sm:min-w-[560px] sm:text-base">
          <thead className="sr-only sm:not-sr-only sm:table-header-group sm:text-gray-500">
            <tr>
              {head.map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className={`py-3 font-medium ${i === 0 ? "px-4" : "px-3"} ${i === highlightCol ? "text-amber-700" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="flex flex-col gap-2 sm:table-row-group sm:divide-y sm:divide-gray-100">
            {rows.map(([first, ...rest]) => (
              <tr key={first} className="block rounded-xl bg-white p-4 sm:table-row sm:rounded-none sm:p-0">
                <th scope="row" className="block pb-2 align-top font-semibold sm:table-cell sm:px-4 sm:py-3">
                  {first}
                </th>
                {rest.map((cell, i) => (
                  <td
                    key={`${first}-${i}`}
                    data-label={head[i + 1]}
                    className={`block py-1 align-top before:block before:text-xs before:font-medium before:text-gray-400 before:content-[attr(data-label)] sm:table-cell sm:px-3 sm:py-3 sm:before:hidden ${i + 1 === highlightCol ? "font-semibold text-black" : "text-gray-600"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

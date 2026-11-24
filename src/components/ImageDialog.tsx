"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  /** Short caption under the image, e.g. "After · 600x750 px". */
  caption?: string;
}

/**
 * Full-size image viewer built on the native <dialog> (focus trap, Esc to close and
 * a backdrop for free). Clicking the backdrop or the × closes it.
 */
export default function ImageDialog({ open, onClose, src, alt, caption }: ImageDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Stop the page behind from scrolling while the dialog is open
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // A click on the dialog element itself (not its content) is a click on the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={alt}
      className="m-auto max-h-[94vh] max-w-[94vw] overflow-visible bg-transparent p-0 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <figure className="relative flex flex-col items-center">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Close preview"
          className="absolute -top-3 -right-3 z-10 flex size-10 items-center justify-center rounded-full bg-white text-black ring-1 ring-gray-200 transition-colors hover:bg-amber-400 sm:-top-4 sm:-right-4"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-[min(85vh,1000px)] w-auto max-w-[94vw] rounded-2xl bg-white object-contain select-none"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        {caption && (
          <figcaption className="mt-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-black">
            {caption}
          </figcaption>
        )}
      </figure>
    </dialog>
  );
}

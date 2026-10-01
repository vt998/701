import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ZoomImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

/** Фото, яке відкривається у збільшеному вікні при кліку (вікно поверх усієї сторінки). */
export function ZoomImage({ src, alt, className, width, height }: ZoomImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={`cursor-zoom-in ${className ?? ""}`}
        onClick={() => setOpen(true)}
      />
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-[100] grid cursor-zoom-out place-items-center bg-background/95 p-4 sm:p-10"
            onClick={() => setOpen(false)}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-full rounded-md border-2 border-primary-deep bg-card object-contain shadow-toy"
            />
            <button
              type="button"
              aria-label="Закрити"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-md border-2 border-primary-deep bg-card font-display text-xl text-primary-deep shadow-toy-sm"
            >
              ×
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

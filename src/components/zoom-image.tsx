import { useState } from "react";

type ZoomImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

/** Фото, яке відкривається у збільшеному вікні при кліку. */
export function ZoomImage({ src, alt, className, width, height }: ZoomImageProps) {
  const [open, setOpen] = useState(false);

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
      {open && (
        <div
          role="dialog"
          aria-label={alt}
          className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-background/95 p-4 sm:p-10"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[92vh] max-w-full rounded-md border-2 border-primary-deep bg-card object-contain shadow-toy"
          />
          <button
            type="button"
            aria-label="Закрити"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-md border-2 border-primary-deep bg-card font-display text-xl text-primary-deep shadow-toy-sm"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

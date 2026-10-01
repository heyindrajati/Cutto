"use client";

import { Slide, downloadBlob } from "@/lib/imageSlicer";

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function SlidePreviewGrid({
  slides,
  isSliced,
  baseName,
}: {
  slides: Slide[];
  isSliced: boolean;
  baseName: string;
}) {
  if (slides.length === 0) return null;

  return (
    <div>
      <p className="font-display text-xl font-bold tracking-[-0.5px] text-ink">
        Preview your slides
        {!isSliced && (
          <span className="ml-2 font-body text-sm font-semibold text-ink">
            — tap any slide to download it individually
          </span>
        )}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {slides.map((slide) => (
          <div key={slide.index}>
            <button
              onClick={() => downloadBlob(slide.blob, `${baseName}-slide-${slide.index}.png`)}
              className="relative block aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#E6D7C7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
            >
              <img
                src={slide.url}
                alt={`Slide ${slide.index}`}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-pastel-pink px-3 py-1 text-xs font-bold text-cocoa shadow-sm backdrop-blur-sm">
                Slide {slide.index}
              </span>
            </button>

            {isSliced && (
              <button
                onClick={() => downloadBlob(slide.blob, `${baseName}-slide-${slide.index}.png`)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-brand-pink to-brand-orange py-3 font-display text-sm font-bold text-[#F9F5F0] shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]"
              >
                <SaveIcon />
                Save slide {slide.index}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

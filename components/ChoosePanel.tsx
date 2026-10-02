"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef } from "react";
import { MAX_SLIDES, MIN_SLIDES, Source, bestCount, cropFor, formatMB, trimmed } from "@/lib/slicer";
import PrimaryButton from "./PrimaryButton";
import { Panel } from "./Shell";
import { ACCEPTED } from "./UploadPanel";

const COUNTS = Array.from({ length: MAX_SLIDES - MIN_SLIDES + 1 }, (_, i) => i + MIN_SLIDES);

/** Step 2 (choose) and Step 3 (slicing — same panel, locked, with progress on the button). */
export default function ChoosePanel({
  file,
  src,
  count,
  slicing,
  progress,
  error,
  onCount,
  onSlice,
  onReplace,
}: {
  file: File;
  src: Source;
  count: number;
  slicing: boolean;
  progress: number;
  error?: string | null;
  onCount: (n: number) => void;
  onSlice: () => void;
  onReplace: (f: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const best = bestCount(src.width, src.height);
  const cut = trimmed(src.width, src.height, count);

  return (
    <Panel className="justify-between gap-6 p-5 sm:p-9">
      <div className="flex flex-col gap-5" aria-busy={slicing}>
        {/* File card */}
        <div className="flex items-center gap-3 rounded-2xl border border-stroke bg-cream p-3">
          <img src={src.url} alt="" className="h-12 w-12 shrink-0 rounded-[14px] object-cover shadow-[0_1px_2px_rgba(0,0,0,0.05)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-body text-sm font-bold leading-5 tracking-[-0.35px] text-cocoa">{file.name}</p>
            <p className="truncate font-body text-xs font-semibold leading-4 text-meta">
              {formatMB(file.size)} · {src.width} × {src.height}px
            </p>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={slicing}
            className="shrink-0 rounded-full px-3 py-1.5 font-body text-xs font-bold leading-4 text-brand-purple transition-colors hover:bg-white disabled:opacity-40"
          >
            Replace
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onReplace(f);
              e.target.value = "";
            }}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-2 font-body text-xs font-bold text-red-600">
            {error}
          </p>
        )}

        {/* Slide count */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <h2 className="font-body text-lg font-bold leading-7 tracking-[-0.95px] text-ink sm:text-xl">Pick your slide count</h2>
            <p className="shrink-0 font-body text-xs font-semibold leading-4 text-ink/70">1080 × 1350px each</p>
          </div>

          <div role="radiogroup" aria-label="Number of slides" className="grid grid-cols-5 gap-2 sm:flex sm:justify-between sm:gap-0">
            {COUNTS.map((n) => {
              const on = n === count;
              return (
                <button
                  key={n}
                  role="radio"
                  aria-checked={on}
                  disabled={slicing}
                  onClick={() => onCount(n)}
                  className={`relative flex h-[50px] items-center justify-center rounded-[14px] border-[1.5px] font-body text-base font-bold leading-7 tracking-[-0.45px] transition-all sm:w-[45px] ${
                    on
                      ? "border-brand-amber bg-brand-orange text-white shadow-picked"
                      : "border-stroke bg-white text-cocoa hover:-translate-y-0.5 hover:border-brand-purple/50 disabled:hover:translate-y-0"
                  } disabled:cursor-not-allowed`}
                >
                  {n}
                  {n === best && (
                    <span
                      aria-label="Best fit"
                      className={`absolute -top-[5.9px] right-[5.6px] h-[12.7px] w-[12.7px] rounded-full border-[2.1px] border-white ${
                        on ? "bg-brand-purple" : "bg-brand-pink"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <p className="flex items-center gap-1.5 font-body text-xs font-semibold leading-4 text-ink/70">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-pink" aria-hidden />
            {count === best ? (
              "Best fit for this image — least cropping."
            ) : (
              <span>
                Best fit:{" "}
                <button disabled={slicing} onClick={() => onCount(best)} className="font-bold text-brand-purple underline-offset-2 hover:underline">
                  {best} slides
                </button>
              </span>
            )}
          </p>
        </div>

        {/* Slice preview */}
        <div className="flex flex-col items-center gap-1">
          <CutPreview src={src} count={count} />
          <p className={`text-center font-body text-xs font-semibold leading-4 ${cut > 0.15 ? "text-[#C2410C]" : "text-ink/60"}`}>
            {cut < 0.005 ? "Nothing gets trimmed — perfect fit." : `About ${Math.round(cut * 100)}% gets trimmed (the dimmed parts).`}
          </p>
        </div>
      </div>

      <PrimaryButton icon="scissors" busy={slicing} disabled={slicing} onClick={onSlice} className="w-full">
        {slicing ? `Slicing ${progress}/${count}…` : `Slice into ${count}`}
      </PrimaryButton>
    </Panel>
  );
}

/** Figma "slice-preview": sand tray, the image with dashed cut lines and numbered parts. */
function CutPreview({ src, count }: { src: Source; count: number }) {
  const { sx, sy, sw, sh } = cropFor(src.width, src.height, count);
  const pct = (v: number, t: number) => `${(v / t) * 100}%`;
  const ratio = src.width / src.height;

  return (
    <div className="flex h-[113px] w-full items-center justify-center rounded-[18px] bg-sand p-3">
      <div
        className="relative max-h-full overflow-hidden rounded-[9px] shadow-preview"
        style={{ aspectRatio: `${src.width} / ${src.height}`, width: `min(100%, ${89 * ratio}px)` }}
      >
        <img src={src.url} alt="Your uploaded image" className="absolute inset-0 h-full w-full object-fill" />
        <div
          className="absolute rounded-[1.5px] transition-all duration-300"
          style={{
            left: pct(sx, src.width),
            top: pct(sy, src.height),
            width: pct(sw, src.width),
            height: pct(sh, src.height),
            boxShadow: "0 0 0 9999px rgba(50,22,79,0.55)",
          }}
        >
          {Array.from({ length: count - 1 }, (_, i) => (
            <span key={i} className="cut-line absolute inset-y-0 w-0" style={{ left: `${((i + 1) / count) * 100}%` }} />
          ))}
          {Array.from({ length: count }, (_, i) => (
            <span
              key={`n${i}`}
              className="absolute top-[4.5px] -translate-x-1/2 rounded-full bg-white/90 px-[4.5px] font-body text-[7.6px] font-bold leading-3 tracking-[0.09px] text-ink"
              style={{ left: `${((i + 0.5) / count) * 100}%` }}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

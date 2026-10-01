"use client";

import GradientButton from "./GradientButton";

const ScissorsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M8.5 8L19 19M19 5L8.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function SliceSection({
  isSliced,
  isProcessing,
  onSlice,
  onDownloadZip,
}: {
  isSliced: boolean;
  isProcessing: boolean;
  onSlice: () => void;
  onDownloadZip: () => void;
}) {
  return (
    <section className="rounded-[32px] border border-dashed border-stroke bg-white p-10 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xl font-bold text-[#F4EBE2]">
          03
        </span>
        <h2 className="font-display text-[30px] font-bold leading-9 tracking-[-0.75px] text-ink">
          Slice it
        </h2>
      </div>

      <div className="mt-6">
        {isSliced ? (
          <GradientButton
            icon={<DownloadIcon />}
            onClick={onDownloadZip}
            className="h-[76px] text-2xl tracking-[1.2px]"
          >
            Download zip
          </GradientButton>
        ) : (
          <GradientButton
            icon={<ScissorsIcon />}
            onClick={onSlice}
            disabled={isProcessing}
            className="h-[76px] text-2xl tracking-[1.2px]"
          >
            {isProcessing ? "Slicing…" : "Slice it"}
          </GradientButton>
        )}
      </div>
    </section>
  );
}

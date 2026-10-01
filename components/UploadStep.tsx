"use client";

import { useCallback, useRef, useState } from "react";
import GradientButton from "./GradientButton";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 50;

export default function UploadStep({
  onFileSelected,
}: {
  onFileSelected: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndEmit = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File terlalu besar. Maksimal ${MAX_SIZE_MB}MB.`);
        return;
      }
      setError(null);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div>
      <h1 className="text-center font-display text-7xl font-bold leading-[64px] tracking-[-3.6px] text-ink">
        Turn long images into
        <br />
        <span className="bg-brand-gradient-heading bg-clip-text text-transparent">
          killer carousels
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-center font-body text-[17px] font-medium leading-[28px] text-ink">
        Drop your image, pick your slides, download &amp; post.
        <br />
        No signup. No nonsense. Just clean cuts.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          validateAndEmit(e.dataTransfer.files?.[0]);
        }}
        className={`mx-auto mt-10 max-w-3xl rounded-3xl border-2 border-dashed border-stroke bg-white px-8 py-16 text-center transition-colors ${
          isDragging ? "bg-pastel-pink" : ""
        }`}
      >
        <h2 className="font-display text-4xl font-bold tracking-[-1.26px] text-cocoa">
          Drop your image here
        </h2>
        <p className="mt-6 font-body text-base font-medium text-ink">
          Exported your carousel? Drop it straight in.
        </p>

        <div className="mt-10 flex justify-center">
          <div className="w-56">
            <GradientButton onClick={() => inputRef.current?.click()}>
              Choose file
            </GradientButton>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => validateAndEmit(e.target.files?.[0])}
        />

        {error && <p className="mt-4 text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Pill className="bg-pastel-pink">JPG</Pill>
          <Pill className="bg-pastel-blue">PNG</Pill>
          <Pill className="bg-pastel-green">WEBP</Pill>
          <Pill className="bg-pastel-lilac">up to {MAX_SIZE_MB}MB</Pill>
        </div>
      </div>
    </div>
  );
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 font-body text-xs font-bold tracking-[0.6px] text-pillText ${className}`}
    >
      {children}
    </span>
  );
}

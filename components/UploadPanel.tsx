"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "./PrimaryButton";

export const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
export const MAX_MB = 50;

export function checkFile(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return "That format isn't supported. Use JPG, PNG or WEBP.";
  if (file.size > MAX_MB * 1024 * 1024) return `That file is too big. The limit is ${MAX_MB}MB.`;
  return null;
}

export default function UploadPanel({ onFile, error }: { onFile: (f: File) => void; error?: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const take = useCallback(
    (file?: File | null) => {
      if (!file) return;
      const problem = checkFile(file);
      setLocalError(problem);
      if (!problem) onFile(file);
    },
    [onFile]
  );

  // Cmd/Ctrl + V pastes an image straight in
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      if (item) take(item.getAsFile());
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [take]);

  const shown = localError ?? error;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload an image"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        take(e.dataTransfer.files?.[0]);
      }}
      className={`group flex min-h-[380px] flex-1 cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed px-6 py-12 text-center outline-none transition-colors focus-visible:ring-4 focus-visible:ring-brand-purple/25 sm:px-8 lg:min-h-0 ${
        dragging ? "border-brand-pink bg-cream" : "border-stroke bg-white hover:border-brand-purple/40"
      }`}
    >
      <div className="flex w-full flex-col items-center gap-2.5">
        <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-pastel-lilac transition-transform group-hover:-translate-y-0.5">
          <img src="/icons/upload.svg" alt="" width={28} height={28} className="h-7 w-7" />
        </span>

        <div className="flex flex-col items-center">
          <h2 className="font-display text-[30px] font-bold leading-[48px] tracking-[-0.1em] text-cocoa sm:text-4xl">
            {dragging ? "Let it go!" : "Drop your image here"}
          </h2>
          <p className="font-body text-sm leading-[22.5px] tracking-[-0.23px] text-ink/80">
            Exported your carousel? Drop it straight in.
            <br className="hidden sm:block" />
            <span className="hidden sm:inline">Or paste it with ⌘V / Ctrl+V.</span>
          </p>
        </div>

        <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
          <PrimaryButton className="w-56" onClick={() => inputRef.current?.click()}>
            Choose file
          </PrimaryButton>
        </div>

        {shown && (
          <p role="alert" className="mt-4 rounded-full bg-red-50 px-4 py-1.5 font-body text-xs font-bold text-red-600">
            {shown}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-2 pt-8">
          <Pill className="bg-cream">JPG</Pill>
          <Pill className="bg-pastel-blue">PNG</Pill>
          <Pill className="bg-pastel-green">WEBP</Pill>
          <Pill className="bg-pastel-lilac">up to {MAX_MB}MB</Pill>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`rounded-full px-3 py-1 font-body text-xs font-bold leading-4 tracking-[0.6px] text-pillText ${className}`}>{children}</span>
  );
}

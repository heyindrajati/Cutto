"use client";

import { useMemo, useState } from "react";
import JSZip from "jszip";
import StepIndicator from "@/components/StepIndicator";
import UploadStep from "@/components/UploadStep";
import SlideCountPicker from "@/components/SlideCountPicker";
import SliceSection from "@/components/SliceSection";
import SlidePreviewGrid from "@/components/SlidePreviewGrid";
import Footer from "@/components/Footer";
import { Slide, loadImage, sliceImage, downloadBlob } from "@/lib/imageSlicer";

function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [slideCount, setSlideCount] = useState(6);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isSliced, setIsSliced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const step = useMemo(() => {
    if (!file) return 1;
    if (isSliced) return 4;
    return 2;
  }, [file, isSliced]);

  async function handleFileSelected(f: File) {
    setFile(f);
    setIsSliced(false);
    const img = await loadImage(f);
    const preview = await sliceImage(img, slideCount);
    setSlides(preview);
  }

  async function handleSlideCountChange(n: number) {
    setSlideCount(n);
    if (!file) return;
    const img = await loadImage(file);
    const preview = await sliceImage(img, n);
    setSlides(preview);
  }

  async function handleSlice() {
    if (!file) return;
    setIsProcessing(true);
    const img = await loadImage(file);
    const result = await sliceImage(img, slideCount);
    setSlides(result);
    setIsSliced(true);
    setIsProcessing(false);
  }

  async function handleDownloadZip() {
    const zip = new JSZip();
    const baseName = file?.name.replace(/\.[^/.]+$/, "") || "cutto-carousel";
    slides.forEach((slide) => {
      zip.file(`${baseName}-slide-${slide.index}.png`, slide.blob);
    });
    const content = await zip.generateAsync({ type: "blob" });
    downloadBlob(content, `${baseName}.zip`);
  }

  function handleStartOver() {
    setFile(null);
    setSlides([]);
    setIsSliced(false);
  }

  const baseName = file?.name.replace(/\.[^/.]+$/, "") || "cutto-carousel";

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cutto-logo.svg"
          alt="Cutto by Indra Jati"
          className="h-12 w-auto"
        />
      </div>

      <div className="mt-10">
        <StepIndicator current={step} />
      </div>

      {file && (
        <button
          onClick={handleStartOver}
          className="mt-8 flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-purple"
        >
          ← Start over
        </button>
      )}

      <div className="mt-8">
        {!file ? (
          <UploadStep onFileSelected={handleFileSelected} />
        ) : (
          <div className="space-y-6">
            <SlideCountPicker
              value={slideCount}
              onChange={handleSlideCountChange}
              fileName={file.name}
              fileSizeLabel={formatSize(file.size)}
            />
            <SliceSection
              isSliced={isSliced}
              isProcessing={isProcessing}
              onSlice={handleSlice}
              onDownloadZip={handleDownloadZip}
            />
            <SlidePreviewGrid slides={slides} isSliced={isSliced} baseName={baseName} />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

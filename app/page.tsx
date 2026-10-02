"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import Shell, { SidebarCopy } from "@/components/Shell";
import UploadPanel, { checkFile } from "@/components/UploadPanel";
import ChoosePanel from "@/components/ChoosePanel";
import DownloadPanel from "@/components/DownloadPanel";
import { Slide, Source, bestCount, loadSource, release, saveBlob, slice } from "@/lib/slicer";

type Phase = "upload" | "choose" | "slicing" | "done";
const STEP: Record<Phase, number> = { upload: 1, choose: 2, slicing: 3, done: 4 };

// Sidebar text for each step — edit the words here
const COPY: Record<Phase, SidebarCopy> = {
  upload: {
    eyebrow: "Step 1 · Upload",
    lead: "Turn long images into",
    accent: "killer carousels",
    narrow: true, // Figma: this headline is 328px wide so it wraps over three lines
    body: "Drop your image, pick your slides, download & post. No signup. No nonsense. Just clean cuts.",
  },
  choose: {
    eyebrow: "Step 2 · Choose slides",
    lead: "How many",
    accent: "slides?",
    body: "Pick a count. The dashed lines show exactly where each cut lands, and anything dimmed gets trimmed.",
  },
  slicing: {
    eyebrow: "Step 3 · Slice",
    lead: "Making the",
    accent: "cuts…",
    body: "Hang tight, this only takes a moment. Everything happens in your browser, so your image never leaves your device.",
  },
  done: {
    eyebrow: "Step 4 · Download",
    lead: "Your carousel is",
    accent: "ready!",
    body: "Grab them all as a zip, or save slides one by one. Every slide is 1080 × 1350px — Instagram's 4:5 size.",
  },
};

// Step 3 stays on screen at least this long so it reads as a loading moment, not a flicker
const MIN_SLICING_MS = 1200;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<Source | null>(null);
  const [count, setCount] = useState(6);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [progress, setProgress] = useState(0);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Free object URLs when leaving the page
  const live = useRef<{ src: Source | null; slides: Slide[] }>({ src: null, slides: [] });
  live.current = { src, slides };
  useEffect(() => () => release([live.current.src?.url, ...live.current.slides.map((s) => s.url)]), []);

  const baseName = file?.name.replace(/\.[^/.]+$/, "") || "cutto";

  const openFile = useCallback(
    async (f: File) => {
      const problem = checkFile(f);
      if (problem) {
        setError(problem);
        return;
      }
      try {
        const next = await loadSource(f);
        release([src?.url, ...slides.map((s) => s.url)]);
        setSlides([]);
        setFile(f);
        setSrc(next);
        setCount(bestCount(next.width, next.height));
        setError(null);
        setPhase("choose");
      } catch {
        setError("We couldn't read that image. Try exporting it again as JPG or PNG.");
      }
    },
    [src, slides]
  );

  async function handleSlice() {
    if (!src) return;
    setError(null);
    setProgress(0);
    setPhase("slicing");
    const started = Date.now();
    try {
      await new Promise((r) => setTimeout(r, 60)); // let Step 3 paint first
      const result = await slice(src, count, setProgress);
      const wait = MIN_SLICING_MS - (Date.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      release(slides.map((s) => s.url));
      setSlides(result);
      setPhase("done");
    } catch {
      setError("Something went wrong while slicing. Try a smaller image.");
      setPhase("choose");
    }
  }

  async function handleZip() {
    setZipping(true);
    try {
      const zip = new JSZip();
      slides.forEach((s) => zip.file(`${baseName}-slide-${s.index}.png`, s.blob));
      saveBlob(await zip.generateAsync({ type: "blob" }), `${baseName}-carousel.zip`);
    } finally {
      setZipping(false);
    }
  }

  function backToChoose() {
    release(slides.map((s) => s.url));
    setSlides([]);
    setPhase("choose");
  }

  function startOver() {
    release([src?.url, ...slides.map((s) => s.url)]);
    setSrc(null);
    setFile(null);
    setSlides([]);
    setError(null);
    setPhase("upload");
  }

  return (
    <Shell step={STEP[phase]} copy={COPY[phase]}>
      {phase === "upload" && <UploadPanel onFile={openFile} error={error} />}

      {(phase === "choose" || phase === "slicing") && file && src && (
        <ChoosePanel
          file={file}
          src={src}
          count={count}
          slicing={phase === "slicing"}
          progress={progress}
          error={error}
          onCount={setCount}
          onSlice={handleSlice}
          onReplace={openFile}
        />
      )}

      {phase === "done" && (
        <DownloadPanel slides={slides} baseName={baseName} zipping={zipping} onZip={handleZip} onBack={backToChoose} onNew={startOver} />
      )}
    </Shell>
  );
}

"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { Slide, saveBlob } from "@/lib/slicer";
import PrimaryButton from "./PrimaryButton";
import { Panel } from "./Shell";

export default function DownloadPanel({
  slides,
  baseName,
  zipping,
  onZip,
  onBack,
  onNew,
}: {
  slides: Slide[];
  baseName: string;
  zipping: boolean;
  onZip: () => void;
  onBack: () => void;
  onNew: () => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 100 });

  // Keep the gradient indicator in sync with the strip's scroll position
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const update = () => {
      const width = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
      const left = el.scrollWidth > 0 ? (el.scrollLeft / el.scrollWidth) * 100 : 0;
      setThumb({ left, width });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Let a normal mouse wheel scroll the strip sideways
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      el.removeEventListener("wheel", onWheel);
    };
  }, [slides.length]);

  // Drag the strip itself with the mouse (touch already scrolls natively)
  const drag = useRef({ active: false, moved: false, x: 0, scroll: 0 });
  const [grabbing, setGrabbing] = useState(false);

  function onStripDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = stripRef.current!;
    drag.current = { active: true, moved: false, x: e.clientX, scroll: el.scrollLeft };
  }
  function onStripMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      setGrabbing(true);
      stripRef.current!.setPointerCapture(e.pointerId);
    }
    if (d.moved) stripRef.current!.scrollLeft = d.scroll - dx;
  }
  function onStripUp() {
    drag.current.active = false;
    if (drag.current.moved) {
      setGrabbing(false);
      // let the snap settle on the nearest slide
      const el = stripRef.current!;
      const card = el.firstElementChild as HTMLElement | null;
      if (card) {
        const step = card.offsetWidth + 12;
        el.scrollTo({ left: Math.round(el.scrollLeft / step) * step, behavior: "smooth" });
      }
    }
  }
  // A drag must not count as a click on "Save slide"
  function onStripClickCapture(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  // Drag the gradient bar like a scrollbar; clicking the track jumps there
  const trackRef = useRef<HTMLDivElement>(null);
  const bar = useRef({ active: false, x: 0, scroll: 0 });
  function onBarDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = stripRef.current;
    const track = trackRef.current;
    if (!el || !track || el.scrollWidth <= el.clientWidth) return;
    e.preventDefault();
    const rect = track.getBoundingClientRect();
    const ratio = el.scrollWidth / rect.width;
    const thumbLeft = rect.left + (thumb.left / 100) * rect.width;
    const thumbRight = thumbLeft + (thumb.width / 100) * rect.width;
    if (e.clientX < thumbLeft || e.clientX > thumbRight) {
      // jump: centre the thumb on the click
      el.scrollLeft = (e.clientX - rect.left) * ratio - el.clientWidth / 2;
    }
    bar.current = { active: true, x: e.clientX, scroll: el.scrollLeft };
    track.setPointerCapture(e.pointerId);
    setGrabbing(true);
  }
  function onBarMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = stripRef.current;
    const track = trackRef.current;
    if (!bar.current.active || !el || !track) return;
    const ratio = el.scrollWidth / track.getBoundingClientRect().width;
    el.scrollLeft = bar.current.scroll + (e.clientX - bar.current.x) * ratio;
  }
  function onBarUp() {
    if (!bar.current.active) return;
    bar.current.active = false;
    setGrabbing(false);
  }

  const total = slides.length;
  const scrollable = thumb.width < 99.5;

  return (
    <Panel className="justify-between gap-6 p-5 sm:p-9">
      <div className="flex min-h-0 flex-col gap-5">
        <div className="flex items-center justify-between font-body text-sm font-bold leading-5 tracking-[-0.15px]">
          <button onClick={onBack} className="text-ink transition-colors hover:text-brand-purple">
            ← Change slide count
          </button>
          <button onClick={onNew} className="text-brand-purple transition-colors hover:text-brand-pink">
            New image
          </button>
        </div>

        <div
          ref={stripRef}
          tabIndex={0}
          aria-label="Your slides"
          onPointerDown={onStripDown}
          onPointerMove={onStripMove}
          onPointerUp={onStripUp}
          onPointerCancel={onStripUp}
          onClickCapture={onStripClickCapture}
          className={`no-scrollbar flex gap-3 overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/30 ${
            grabbing ? "cursor-grabbing select-none" : `snap-x snap-mandatory ${scrollable ? "cursor-grab" : ""}`
          }`}
        >
          {slides.map((s) => (
            <figure key={s.index} className="w-[calc((100%-24px)/2.4)] shrink-0 snap-start sm:w-[calc((100%-24px)/3)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] border-[0.75px] border-black/[0.08] bg-clay shadow-slide">
                <img src={s.url} alt={`Slide ${s.index} of ${total}`} draggable={false} className="pointer-events-none h-full w-full object-cover" />
                <span className="absolute left-1.5 top-1.5 rounded-full bg-cream px-[7.5px] py-[1.5px] font-body text-[9px] font-bold leading-3 text-cocoa drop-shadow-[0_0.75px_0.75px_rgba(0,0,0,0.05)]">
                  {s.index}/{total}
                </span>
              </div>
              <button
                onClick={() => saveBlob(s.blob, `${baseName}-slide-${s.index}.png`)}
                className="mt-1.5 flex h-[30px] w-full items-center justify-center gap-[4.5px] rounded-full bg-save-grad font-body text-[11px] font-bold leading-[15px] tracking-[-0.11px] text-paper drop-shadow-[0_0.75px_0.75px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5"
              >
                <img src="/icons/save.svg" alt="" width={11} height={11} className="h-[11px] w-[11px]" />
                Save slide {s.index}
              </button>
            </figure>
          ))}
        </div>

        <div
          onPointerDown={onBarDown}
          onPointerMove={onBarMove}
          onPointerUp={onBarUp}
          onPointerCancel={onBarUp}
          className={`-my-2 touch-none py-2 ${scrollable ? (grabbing ? "cursor-grabbing" : "cursor-pointer") : ""}`}
          aria-hidden
        >
          <div ref={trackRef} className="relative h-2.5 w-full overflow-hidden rounded-full bg-[rgba(217,217,217,0.4)]">
            <div
              className={`absolute inset-y-0 rounded-full bg-bgv2 ${scrollable ? (grabbing ? "cursor-grabbing" : "cursor-grab") : ""}`}
              style={{ left: `${thumb.left}%`, width: `${thumb.width}%` }}
            />
          </div>
        </div>

        <p className="font-body text-xs font-semibold leading-4 text-ink/60">Tip: post them in order — slide 1 first — so the carousel lines up.</p>
      </div>

      <PrimaryButton icon="download" busy={zipping} disabled={zipping} onClick={onZip} className="w-full">
        {zipping ? "Zipping…" : `Download all (${total})`}
      </PrimaryButton>
    </Panel>
  );
}

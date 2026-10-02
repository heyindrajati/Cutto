"use client";
/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";
import Background from "./Background";
import Footer from "./Footer";
import { StepListHorizontal, StepListVertical } from "./StepList";
import { useBackgroundPhotos } from "./useBackgroundPhotos";

export type SidebarCopy = { eyebrow: string; lead: string; accent: string; body: string; narrow?: boolean };

/**
 * Desktop (lg+): exactly 100vh, no page scroll. The 1045 × 648 card sits centred
 * and only shrinks when the screen is too short to fit it.
 * Mobile/tablet: card stacks (sidebar on top) and the page scrolls normally.
 */
export default function Shell({ step, copy, children }: { step: number; copy: SidebarCopy; children: ReactNode }) {
  const { current, previous } = useBackgroundPhotos();
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-6 sm:px-6 lg:h-[100dvh] lg:overflow-hidden lg:px-8 lg:py-8">
      <Background current={current} previous={previous} />

      <div className="w-full max-w-[1045px]">
        <main className="flex flex-col overflow-hidden rounded-[28px] bg-cream shadow-card lg:h-[min(648px,calc(100dvh-112px))] lg:flex-row lg:rounded-[36px]">
          {/* Sidebar — 453 of 1045 */}
          <aside className="flex flex-col gap-6 p-6 sm:p-8 lg:w-[43.35%] lg:shrink-0 lg:justify-between lg:gap-4 lg:overflow-y-auto lg:p-9">
            <div className="flex justify-center pt-0 lg:block lg:pt-2.5">
              <img src="/cutto-logo.svg" alt="Cutto by Indra Jati" width={216} height={61} className="h-auto w-[170px] sm:w-[216px]" />
            </div>

            <div key={step} className="flex animate-fade-up flex-col items-center gap-4 text-center lg:items-start lg:gap-5 lg:text-left short:gap-3.5">
              <p className="font-body text-xs font-bold uppercase leading-4 tracking-[1.44px] text-brand-purple">{copy.eyebrow}</p>
              <h1 className={`${copy.narrow ? "lg:max-w-[328px]" : ""} max-w-[381px] font-display text-[38px] font-bold leading-[1] tracking-[-0.075em] text-ink sm:text-[44px] lg:text-[48px] lg:leading-[48px] short:text-[40px] short:leading-[40px]`}>
                {copy.lead} <span className="grad-text">{copy.accent}</span>
              </h1>
              <p className="max-w-[370px] font-body text-[15px] leading-6 tracking-[-0.23px] text-ink/80">{copy.body}</p>
              <div className="hidden lg:block">
                <StepListVertical current={step} />
              </div>
              <div className="w-full pt-1 lg:hidden">
                <StepListHorizontal current={step} />
              </div>
            </div>
          </aside>

          {/* Right section — 592 of 1045, holds the dashed box */}
          <section className="flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-8 sm:pb-8 lg:p-9">{children}</section>
        </main>

        <Footer photo={current} />
      </div>
    </div>
  );
}

/** The white dashed box inside the right section (Figma "Button - Upload an image"). */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-h-0 flex-1 flex-col rounded-[28px] border-2 border-dashed border-stroke bg-white ${className}`}>{children}</div>
  );
}

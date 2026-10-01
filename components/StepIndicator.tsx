"use client";

import { Fragment } from "react";

const STEPS = ["Upload", "Choose slides", "Slice", "Download"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mx-auto flex max-w-2xl items-start">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isLast = stepNum === STEPS.length;
        return (
          <Fragment key={label}>
            <div className="flex shrink-0 flex-col items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white ${
                  isActive ? "bg-brand-orange" : "bg-ink"
                }`}
              >
                {stepNum}
              </div>
              <span
                className={`mt-2 whitespace-nowrap text-center font-body text-xs font-semibold ${
                  isActive ? "text-cocoa" : "text-stepLabel"
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && <div className="step-line mx-2 mt-4 h-px flex-1" />}
          </Fragment>
        );
      })}
    </div>
  );
}

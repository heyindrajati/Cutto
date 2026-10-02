/* eslint-disable @next/next/no-img-element */
export const STEPS = ["Upload", "Choose slides", "Slice", "Download"] as const;

type State = "done" | "active" | "todo";
const stateOf = (n: number, current: number): State => (n < current ? "done" : n === current ? "active" : "todo");

function Dot({ n, state }: { n: number; state: State }) {
  if (state === "done") return <img src="/icons/step-done.svg" alt="" width={32} height={32} className="h-8 w-8 shrink-0" />;
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold leading-5 tracking-[-0.15px] text-white transition-colors ${
        state === "active" ? "bg-brand-orange shadow-dot" : "bg-ink"
      }`}
    >
      {n}
    </span>
  );
}

/** Desktop: vertical list with short connectors (Figma "Numbered List"). */
export function StepListVertical({ current }: { current: number }) {
  return (
    <ol className="flex flex-col" aria-label="Progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = stateOf(n, current);
        return (
          <li key={label} className="flex items-start gap-3" aria-current={state === "active" ? "step" : undefined}>
            <div className="flex flex-col items-center">
              <Dot n={n} state={state} />
              {n < STEPS.length && (
                <span className="py-1 short:py-0.5">
                  <span className="block h-2.5 w-px bg-ink short:h-1.5" />
                </span>
              )}
            </div>
            <span
              className={`whitespace-nowrap pt-1.5 font-body text-sm leading-5 tracking-[-0.15px] text-ink ${
                state === "active" ? "font-bold" : "font-semibold"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Mobile/tablet: compact horizontal version of the same list. */
export function StepListHorizontal({ current }: { current: number }) {
  return (
    <ol className="flex items-start" aria-label="Progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = stateOf(n, current);
        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-1.5" aria-current={state === "active" ? "step" : undefined}>
            <div className="relative flex w-full justify-center">
              {i > 0 && <span className="absolute right-1/2 top-1/2 mr-5 h-px w-[calc(50%-20px)] bg-ink/40" />}
              <Dot n={n} state={state} />
              {n < STEPS.length && <span className="absolute left-1/2 top-1/2 ml-5 h-px w-[calc(50%-20px)] bg-ink/40" />}
            </div>
            <span className={`text-center font-body text-[11px] leading-tight text-ink sm:text-xs ${state === "active" ? "font-bold" : "font-semibold"}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

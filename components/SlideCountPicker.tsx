"use client";

const OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function SlideCountPicker({
  value,
  onChange,
  fileName,
  fileSizeLabel,
}: {
  value: number;
  onChange: (n: number) => void;
  fileName: string;
  fileSizeLabel: string;
}) {
  return (
    <section className="rounded-[32px] border border-dashed border-stroke bg-white p-10 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xl font-bold text-[#F4EBE2]">
          02
        </span>
        <h2 className="font-display text-[30px] font-bold leading-9 tracking-[-0.75px] text-ink">
          Pick your slide count
        </h2>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {OPTIONS.map((n) => {
          const active = n === value;
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={`flex h-14 w-14 items-center justify-center rounded-[24px] font-display text-xl font-bold transition-transform ${
                active
                  ? "scale-[1.1] border-[2.2px] border-[#D37D0D] bg-brand-orange text-white shadow-[0_11px_8px_rgba(211,125,13,0.25),0_4px_3px_rgba(211,125,13,0.25)]"
                  : "border-2 border-stroke bg-white text-cocoa hover:border-brand-purple/40"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <p className="mt-4 pl-1 font-body text-sm font-semibold text-ink">
        Each slide: 1080 × 1350px
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-[24px] border border-stroke bg-stroke p-4">
        <div className="h-16 w-16 shrink-0 rounded-[20px] bg-[#F4EBE2] shadow-sm" aria-hidden />
        <div>
          <p className="font-body text-base font-bold tracking-[-0.4px] text-cocoa">{fileName}</p>
          <p className="font-body text-sm font-semibold text-stepLabel">{fileSizeLabel}</p>
        </div>
      </div>
    </section>
  );
}

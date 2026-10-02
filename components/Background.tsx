/* eslint-disable @next/next/no-img-element */
import type { ShownPhoto } from "./useBackgroundPhotos";

/**
 * Purple brand backdrop with three soft blobs (from Figma).
 * The hand-picked photos (lib/backgrounds.ts) cross-fade on top of it.
 */
export default function Background({ current, previous }: { current: ShownPhoto | null; previous: ShownPhoto | null }) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-brand-purple">
      <div className="absolute -left-[160px] -top-[160px] h-[520px] w-[520px] rounded-full bg-brand-pink/40 blur-[120px]" />
      <div className="absolute left-[40%] top-[60.5%] h-[360px] w-[360px] rounded-full bg-brand-orange/30 blur-[120px]" />
      <div className="absolute left-[calc(100%+112px)] top-[70%] h-[560px] w-[560px] rounded-full bg-brand-purple/50 blur-[140px]" />

      {previous && <img key={`p-${previous.url}`} src={previous.url} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      {current && (
        <img key={`c-${current.url}`} src={current.url} alt="" className="absolute inset-0 h-full w-full animate-fade-in object-cover" />
      )}

      {/* Keeps the white footer text readable on bright photos */}
      {current && <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/45 to-transparent" />}
    </div>
  );
}

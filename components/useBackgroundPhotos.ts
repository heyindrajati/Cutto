"use client";

import { useEffect, useRef, useState } from "react";
import { BACKGROUNDS, BackgroundPhoto, ROTATE_EVERY_MS, sizedSrc } from "@/lib/backgrounds";

export type ShownPhoto = BackgroundPhoto & { url: string };

/** Resolves with the sized URL if the image loads, or null if it fails (so it can be skipped). */
function preload(src: string) {
  return new Promise<string | null>((resolve) => {
    const url = sizedSrc(src);
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/** Rotates through BACKGROUNDS in order, skipping any photo that doesn't load. */
export function useBackgroundPhotos() {
  const [current, setCurrent] = useState<ShownPhoto | null>(null);
  const [previous, setPrevious] = useState<ShownPhoto | null>(null);
  const index = useRef(-1);
  const shown = useRef<ShownPhoto | null>(null);
  const broken = useRef(new Set<number>());

  useEffect(() => {
    if (BACKGROUNDS.length === 0) return;
    let alive = true;
    let busy = false;

    async function advance() {
      if (busy || document.hidden) return;
      busy = true;
      // Try each photo at most once per step; give up quietly if none load
      for (let tries = 0; tries < BACKGROUNDS.length; tries++) {
        const next = (index.current + 1 + tries) % BACKGROUNDS.length;
        if (broken.current.has(next)) continue;
        const url = await preload(BACKGROUNDS[next].src);
        if (!alive) return;
        if (!url) {
          broken.current.add(next);
          continue;
        }
        if (next !== index.current) {
          index.current = next;
          const photo = { ...BACKGROUNDS[next], url };
          setPrevious(shown.current);
          setCurrent(photo);
          shown.current = photo;
        }
        break;
      }
      busy = false;
    }

    advance();
    const id = setInterval(advance, ROTATE_EVERY_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return { current, previous };
}

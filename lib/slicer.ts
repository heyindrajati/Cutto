// All image work happens in the browser — nothing is uploaded anywhere.

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
export const MIN_SLIDES = 2;
export const MAX_SLIDES = 10;

export type Slide = { index: number; blob: Blob; url: string };
export type Source = { img: HTMLImageElement; url: string; width: number; height: number };
export type Crop = { sx: number; sy: number; sw: number; sh: number };

export function loadSource(file: File): Promise<Source> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    img.src = url;
  });
}

/**
 * The area of the image that becomes the carousel. The whole strip
 * (count × 1080 by 1350) is cropped once and centred, then cut into equal
 * parts — so seams line up perfectly on seamless carousels.
 */
export function cropFor(width: number, height: number, count: number): Crop {
  const target = (count * SLIDE_W) / SLIDE_H;
  let sw = width;
  let sh = height;
  if (width / height > target) sw = height * target;
  else sh = width / target;
  return { sx: (width - sw) / 2, sy: (height - sh) / 2, sw, sh };
}

/** Slide count that trims the least. */
export function bestCount(width: number, height: number): number {
  const n = Math.round(width / height / (SLIDE_W / SLIDE_H));
  return Math.min(MAX_SLIDES, Math.max(MIN_SLIDES, n));
}

/** Share of the image (0–1) that gets trimmed at this count. */
export function trimmed(width: number, height: number, count: number): number {
  const c = cropFor(width, height, count);
  return 1 - (c.sw * c.sh) / (width * height);
}

export async function slice(
  src: Source,
  count: number,
  onProgress?: (done: number) => void
): Promise<Slide[]> {
  const crop = cropFor(src.width, src.height, count);
  const partW = crop.sw / count;
  const out: Slide[] = [];

  for (let i = 0; i < count; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = SLIDE_W;
    canvas.height = SLIDE_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no-canvas");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src.img, crop.sx + i * partW, crop.sy, partW, crop.sh, 0, 0, SLIDE_W, SLIDE_H);

    const blob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("no-blob"))), "image/png")
    );
    out.push({ index: i + 1, blob, url: URL.createObjectURL(blob) });
    onProgress?.(i + 1);
  }
  return out;
}

export function release(urls: (string | undefined)[]) {
  urls.forEach((u) => u && URL.revokeObjectURL(u));
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function formatMB(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

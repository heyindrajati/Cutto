export type Slide = {
  index: number;
  blob: Blob;
  url: string;
};

// Cutto's slide size, per the Figma spec ("Each slide: 1080 × 1350px")
export const SLIDE_WIDTH = 1080;
export const SLIDE_HEIGHT = 1350;

/**
 * Loads a File into an HTMLImageElement.
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

/**
 * Splits a long source image into `count` equal-width carousel slides.
 * Each slide is drawn at SLIDE_WIDTH x SLIDE_HEIGHT, cropping/centering
 * vertically so the source content fills the frame without distortion.
 */
export async function sliceImage(
  img: HTMLImageElement,
  count: number
): Promise<Slide[]> {
  const sliceSourceWidth = img.naturalWidth / count;
  const slides: Slide[] = [];

  for (let i = 0; i < count; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = SLIDE_WIDTH;
    canvas.height = SLIDE_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // Scale the source slice to fill the target frame, cropping overflow
    const scale = Math.max(
      SLIDE_WIDTH / sliceSourceWidth,
      SLIDE_HEIGHT / img.naturalHeight
    );
    const drawWidth = sliceSourceWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const offsetX = (SLIDE_WIDTH - drawWidth) / 2;
    const offsetY = (SLIDE_HEIGHT - drawHeight) / 2;

    ctx.drawImage(
      img,
      i * sliceSourceWidth,
      0,
      sliceSourceWidth,
      img.naturalHeight,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        "image/png",
        0.92
      );
    });

    slides.push({ index: i + 1, blob, url: URL.createObjectURL(blob) });
  }

  return slides;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

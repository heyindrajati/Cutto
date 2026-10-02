import { withUtm } from "@/lib/backgrounds";
import type { ShownPhoto } from "./useBackgroundPhotos";

const link = "font-semibold underline-offset-2 hover:underline";

export default function Footer({ photo }: { photo: ShownPhoto | null }) {
  return (
    <footer className="grid w-full gap-1 px-2 pt-4 text-center font-body text-xs leading-4 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
      <p className="sm:text-left">
        Created by{" "}
        <a href="https://www.instagram.com/hey.indrajati/" target="_blank" rel="noopener noreferrer" className={link}>
          @hey.indrajati
        </a>
      </p>

      {/* Unsplash attribution — required wording + links */}
      <p className="order-last text-white/80 sm:order-none">
        {photo && (
          <>
            Photo by{" "}
            <a href={withUtm(photo.photographerUrl)} target="_blank" rel="noopener noreferrer" className={link}>
              {photo.photographer}
            </a>{" "}
            on{" "}
            <a href={withUtm(photo.photoUrl)} target="_blank" rel="noopener noreferrer" className={link}>
              Unsplash
            </a>
          </>
        )}
      </p>

      <p className="sm:text-right">Free of cost · No sign up · No data stored</p>
    </footer>
  );
}

/**
 * Background photos — picked by hand from Unsplash (Unsplash License).
 *
 * To add / change a photo:
 *  1. Open the photo on unsplash.com
 *  2. Right-click the big image → "Copy image address", keep only the part before "?"
 *     (looks like https://images.unsplash.com/photo-1234567890-abcdef)
 *     — or put your own file in /public/backgrounds and use "/backgrounds/name.jpg"
 *  3. Fill in the photographer's name, their profile link and the photo page link
 *
 * Photos that fail to load are skipped automatically.
 */

export type BackgroundPhoto = {
  src: string; // images.unsplash.com base URL, or a local /backgrounds/... file
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
};

export const BACKGROUNDS: BackgroundPhoto[] = [
  {
    src: "https://images.unsplash.com/photo-1790791196732-cc81a2b29f51",
    photographer: "Daniil Silantev",
    photographerUrl: "https://unsplash.com/@betagamma",
    photoUrl: "https://unsplash.com/photos/person-on-rocky-mountain-slope-CMlbS1CqkDE",
  },
  {
    src: "https://images.unsplash.com/photo-1790924104828-bbe67bc273b5",
    photographer: "Kiarash Mansouri",
    photographerUrl: "https://unsplash.com/@kiarash_mansouri",
    photoUrl: "https://unsplash.com/photos/geodesic-dome-against-orange-sky-fC0CVp5cWRg",
  },
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    photographer: "Qingbao Meng",
    photographerUrl: "https://unsplash.com/@ideasboom",
    photoUrl: "https://unsplash.com/photos/birds-eye-view-photograph-of-green-mountains-01_igFr7hd4",
  },
  {
    src: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    photographer: "Johannes Plenio",
    photographerUrl: "https://unsplash.com/@jplenio",
    photoUrl: "https://unsplash.com/photos/forest-heat-by-sunbeam-RwHv7LgeC7s",
  },
  {
    src: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c",
    photographer: "Denys Nevozhai",
    photographerUrl: "https://unsplash.com/@dnevozhai",
    photoUrl: "https://unsplash.com/photos/alleyway-with-red-lanterns-in-tokyo-D68ADLeMh5Q",
  },
  {
    src: "https://images.unsplash.com/photo-1491466424936-e304919aada7",
    photographer: "Jonatan Pie",
    photographerUrl: "https://unsplash.com/@r3dmax",
    photoUrl: "https://unsplash.com/photos/northern-lights-3l3RwQdHRHg",
  },
  {
    src: "https://images.unsplash.com/photo-1479030160180-b1860951d696",
    photographer: "Ashim D'Silva",
    photographerUrl: "https://unsplash.com/@randomlies",
    photoUrl: "https://unsplash.com/photos/scenery-of-mountain-canyon-WeYamle9fDM",
  },
  {
    src: "https://images.unsplash.com/photo-1633596683562-4a47eb4983c5",
    photographer: "Li Zhang",
    photographerUrl: "https://unsplash.com/@sunx",
    photoUrl: "https://unsplash.com/photos/an-abstract-red-and-orange-background-with-curves-K-DwbsTXliY",
  },
];

// How long each photo stays before the next one fades in
export const ROTATE_EVERY_MS = 10000;

const UTM = "utm_source=cutto&utm_medium=referral";
export const withUtm = (url: string) => `${url}${url.includes("?") ? "&" : "?"}${UTM}`;

/** Unsplash photos are resized by their CDN to fit the screen; local files are used as-is. */
export function sizedSrc(src: string): string {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const w = typeof window === "undefined" ? 1920 : Math.min(2400, Math.round(window.innerWidth * Math.min(window.devicePixelRatio || 1, 2)));
  return `${src}?w=${w}&q=75&auto=format&fit=crop`;
}

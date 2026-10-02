import type { Config } from "tailwindcss";

// Every value here comes from the Figma file "Carousel Slicer App" → page "Split Screen Concept"
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        // Desktop laptops with short screens: tighten the sidebar so the 100vh layout still fits
        short: { raw: "(min-width: 1024px) and (max-height: 760px)" },
      },
      colors: {
        ink: "#32164F", // Dark-purple: headings, body, step dots
        cocoa: "#4B2D1B", // "Drop your image here", file name, slide numbers
        meta: "#92664F", // file size line
        stroke: "#D9BDE3", // dashed borders, count buttons
        cream: "#FFF6FB", // bg-light: card, file card, slide badges
        sand: "#F4EBE2", // cut preview tray
        clay: "#E6D7C7", // slide placeholder
        paper: "#F9F5F0", // "Save slide" text
        brand: {
          pink: "#FF3D8D",
          orange: "#FF763B",
          purple: "#8B3DFF",
          deep: "#6227BF", // button hard shadow
          amber: "#D37D0D", // selected count border
        },
        pastel: { blue: "#B9C7FF", green: "#D7FA91", lilac: "#DFC9FF" },
        pillText: "#5F3D73",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // "main grad" — primary buttons
        "main-grad": "linear-gradient(174.57deg, #FF3D8D 12.448%, #8B3DFF 87.552%)",
        // Headline accent words
        "headline-grad": "linear-gradient(90deg, #FF3D8D 0%, #FF763B 38%, #8B3DFF 76%)",
        // "Save slide" buttons
        "save-grad": "linear-gradient(90deg, #FF3D8D 0%, #FF763B 100%)",
        // "BGv2" — slide-strip scroll indicator
        "bgv2": "linear-gradient(174.29deg, #FF3D8D 0%, #B23CC9 45%, #6227BF 100%)",
      },
      boxShadow: {
        // shadow1 — the floating card
        card: "0 10px 30px -10px rgba(50,22,79,0.35), 0 30px 80px -20px rgba(50,22,79,0.55)",
        // primary button: hard purple ledge + soft ambient
        button: "0 8px 0 0 #6227BF, 0 12px 22px 0 rgba(50,22,79,0.2)",
        // shadow2 — selected slide count
        picked: "0 2px 8.48px 0 rgba(211,125,13,0.25), 0 4.24px 3.18px 0 rgba(211,125,13,0.25)",
        dot: "0 4px 5px 0 rgba(255,118,59,0.45)",
        preview: "0 4.55px 12.14px 0 rgba(50,22,79,0.18)",
        slide: "0 3px 4.5px -0.75px rgba(0,0,0,0.1), 0 1.5px 3px -1.5px rgba(0,0,0,0.1)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { "fade-up": "fade-up 0.35s ease-out both", "fade-in": "fade-in 1.4s ease-in-out both" },
    },
  },
  plugins: [],
};

export default config;

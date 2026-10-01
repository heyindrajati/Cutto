import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact values pulled from Figma via the Figma MCP (node 33:346, Homepage)
        ink: "#32164F", // headings / body text
        cocoa: "#4B2D1B", // bold labels e.g. "Drop your image here"
        stepLabel: "#92664F", // muted label for not-yet-active steps
        stroke: "#D9BDE3", // dashed borders / dividers
        bgLight: "#FFF6FB",
        brand: {
          pink: "#FF3D8D",
          orange: "#FF763B",
          purple: "#8B3DFF",
          shadowPurple: "#6227BF", // button's hard drop-shadow
        },
        pastel: {
          pink: "#FFF6FB",
          blue: "#B9C7FF",
          green: "#D7FA91",
          lilac: "#DFC9FF",
        },
        pillText: "#5F3D73",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // Button gradient — exact angle/stops from Figma
        "brand-gradient": "linear-gradient(143deg, #FF3D8D 8%, #8B3DFF 92%)",
        // "killer carousels" heading text gradient — 3-stop, left to right
        "brand-gradient-heading":
          "linear-gradient(90deg, #FF3D8D 0%, #FF763B 38%, #8B3DFF 76%)",
        "mesh-light":
          "radial-gradient(circle at 16% 22%, rgba(255,61,141,0.16) 0%, rgba(255,61,141,0) 32%), radial-gradient(circle at 87% 25%, rgba(49,91,255,0.15) 0%, rgba(49,91,255,0) 32%), radial-gradient(circle at 52% 85%, rgba(183,243,75,0.1) 0%, rgba(183,243,75,0) 32%), #FFF6FB",
      },
      boxShadow: {
        // Hard drop-shadow + soft ambient shadow, matching the Figma button exactly
        button: "0 8px 0 0 #6227BF, 0 12px 22px 0 rgba(50,22,79,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;

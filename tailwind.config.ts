import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F3",
        sand: {
          DEFAULT: "#F4EBDD",
          light: "#FDFBF7",
          medium: "#EDE2D0",
          dark: "#DCCBB3",
        },
        primary: {
          DEFAULT: "#243B53",
          light: "#334E68",
          dark: "#102A43",
          subtle: "#F0F4F8",
        },
        cta: {
          DEFAULT: "#C65D3B",
          hover: "#B24E2E",
          active: "#9E3F21",
          light: "#FDF2EE",
          border: "#E8B2A0",
        },
        charcoal: {
          DEFAULT: "#263238",
          secondary: "#455A64",
          muted: "#627D98",
          light: "#829AB1",
        },
        success: {
          DEFAULT: "#3E6650",
          light: "#EBF3EE",
          dark: "#2A4536",
        },
        earth: {
          ochre: "#D97706",
          clay: "#A75D3F",
          stone: "#E2D9CC",
          border: "#E5DEC9",
        },
      },
      borderRadius: {
        card: "16px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        artisan: "0 2px 8px -2px rgba(36, 59, 83, 0.08), 0 1px 4px -1px rgba(36, 59, 83, 0.04)",
        "artisan-hover": "0 8px 24px -4px rgba(36, 59, 83, 0.12), 0 3px 8px -2px rgba(36, 59, 83, 0.06)",
        "artisan-card": "0 1px 3px rgba(38, 50, 56, 0.06), 0 1px 2px rgba(38, 50, 56, 0.04)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Noto Sans", "Noto Sans Telugu", "Noto Sans Devanagari", "sans-serif"],
        telugu: ["Noto Sans Telugu", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#faf8f5",
          100: "#f4f0e8",
          200: "#e8dcce",
          300: "#d9c4ad",
          400: "#c7a88b",
          500: "#b58e6d", // Luxury warm bronze / champagne
          600: "#9c7353",
          700: "#7e5a3f",
          800: "#654936",
          900: "#4f392c",
          950: "#2d1f18",
        },
        onyx: {
          800: "#181b20",
          850: "#13161b",
          900: "#0d0f13",
          950: "#07080a",
        },
        silver: {
          100: "#f1f3f5",
          200: "#e2e6ea",
          300: "#cfd5dc",
          400: "#9aa5b1",
          500: "#697787",
        },
        verified: {
          light: "#ecfdf5",
          DEFAULT: "#059669",
          dark: "#065f46",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        premium: "0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        "premium-dark": "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

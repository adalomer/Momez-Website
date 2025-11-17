import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ef4444",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        accent: {
          DEFAULT: "#fecaca",
          light: "#fee2e2",
          lighter: "#fef2f2",
        },
        background: {
          light: "#fafafa",
          dark: "#0f0f0f",
        },
        surface: {
          light: "#ffffff",
          dark: "#1a1a1a",
        },
        border: {
          light: "#f3f4f6",
          dark: "#2d2d2d",
        },
      },
      fontFamily: {
        display: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(239, 68, 68, 0.1), 0 2px 6px -4px rgba(239, 68, 68, 0.1)',
        'soft-lg': '0 10px 40px -10px rgba(239, 68, 68, 0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config;

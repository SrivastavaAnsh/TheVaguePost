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
        ink: "#111111",
        charcoal: "#222222",
        muted: "#666666",
        border: "#E5E5E5",
        surface: "#FFFFFF",
        canvas: "#FAFAFA",
        street: {
          green: "#059669",     // Primary Green
          "green-light": "#10B981",
          "green-bg": "#ECFDF5",
          red: "#DC2626",       // Opposite color on color wheel (Red/Coral)
          "red-light": "#EF4444",
          "red-bg": "#FEF2F2",
          yellow: "#FBBF24",    // Balance Ochre/Yellow
          "yellow-bright": "#FFE600",
          "yellow-bg": "#FFFBEB",
          dark: "#111111",
        },
      },
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["Kanit", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        hard: "3px 3px 0px #111111",
        "hard-sm": "2px 2px 0px #111111",
        "hard-lg": "5px 5px 0px #111111",
        "hard-green": "3px 3px 0px #059669",
        "hard-red": "3px 3px 0px #DC2626",
        soft: "0 2px 12px -2px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;

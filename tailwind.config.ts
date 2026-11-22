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
        ink: "#0D0D0D",
        charcoal: "#262626",
        muted: "#737373",
        border: "#E5E5E5",
        surface: "#FFFFFF",
        canvas: "#F7F7F8",
        graffiti: {
          yellow: "#FFE600",
          blue: "#2563EB",
          red: "#EF4444",
          green: "#10B981",
          black: "#111111",
        },
      },
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["Kanit", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        hard: "3px 3px 0px #000000",
        "hard-sm": "2px 2px 0px #000000",
        "hard-lg": "5px 5px 0px #000000",
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;

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
        primary: "#0C0C0C",
        secondary: "#8A99A5",
        tertiary: "#14171B",
        frost: "#D7E2EA",
        "black-100": "#101318",
        "black-200": "#080A0C",
        "card-bg": "#12151D",
        "card-border": "rgba(255, 255, 255, 0.08)",
        accent: {
          DEFAULT: "#B600A8",
          glow: "#D900C7",
          cyan: "#4E8CF9",
          green: "#10A37F",
          amber: "#F59E0B",
          pink: "#FF3366",
        },
      },
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["Kanit", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(182, 0, 168, 0.35)",
        "glow-cyan": "0 0 25px -5px rgba(78, 140, 249, 0.35)",
        "glow-green": "0 0 25px -5px rgba(16, 163, 127, 0.35)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.6)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        pop: {
          "0%": { transform: "scale(0.85)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pulseGlow: "pulseGlow 6s ease-in-out infinite",
        pop: "pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [],
};
export default config;

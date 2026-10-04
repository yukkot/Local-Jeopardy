import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#17101F",
        panel: "#221733",
        "panel-deep": "#120B19",
        marigold: "#F2A93B",
        teal: "#5EEAD4",
        rose: "#FB7185",
        ink: "#F5EFE6",
        "ink-muted": "#A79BC9",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

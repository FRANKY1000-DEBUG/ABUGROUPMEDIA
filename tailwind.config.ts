import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#ffffff",
        surface: "#f7f7f9",
        "surface-2": "#eef0f3",
        line: "#e3e5ea",
        ink: "#14151a",
        muted: "#6b6d78",
        accent1: "#2563eb",
        accent2: "#e11d2a",
        good: "#16a34a"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl2: "20px"
      }
    }
  },
  plugins: []
};
export default config;

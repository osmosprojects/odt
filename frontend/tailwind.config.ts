import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A7D3E", // Castrol green (from dashboard chrome)
        "primary-dark": "#065C2C",
        brand: {
          blue: "#003E8A", // Primary CTA blue from palette
          orange: "#FF6B00", // Accent
          green: "#2FA745", // Warning/Success (palette label says Warning but color is green)
          red: "#DC3545", // Danger
          dark: "#212239", // Text primary
          gray: "#6C757D", // Text secondary
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
      },
      borderRadius: {
        card: "12px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;

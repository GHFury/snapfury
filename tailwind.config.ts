import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fury: {
          purple: "#4A3DC8",
          gold:   "#C8952A",
          red:    "#8B2035",
          paper:  "#F0E6C8",
          ink:    "#111111",
        },
      },
      fontFamily: {
        comic:  ["Anton", "sans-serif"],
        news:   ["Special Elite", "serif"],
        marker: ["Permanent Marker", "cursive"],
        body:   ["Barlow Condensed", "sans-serif"],
      },
      boxShadow: {
        comic:  "5px 5px 0 #111",
        "comic-lg": "8px 8px 0 #111",
        "comic-gold": "5px 5px 0 #C8952A",
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6D57FC",
        light: "#B0A4FD",
        lighter: "#E8E4FF",
        dark: "#261E58",
        darker: "#0C0A1C",
        gray: "#757575",
        softgray: "#E7E7E7",
        tintedgray: "#9E9DA4",
        tinteddark1: "#E7E7E9",
        tinteddark5: "#86858E",
        tinteddark6: "#6D6C77",
        tinteddark7: "#555461",
        tinteddark8: "#3D3B49",
      },
      fontFamily: {
        sans: ["var(--font-urbanist)", "sans-serif"],
        urbanist: ["var(--font-urbanist)", "sans-serif"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

export default config;

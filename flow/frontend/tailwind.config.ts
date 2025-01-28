import type { Config } from "tailwindcss";
import {
  animation,
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  height,
  keyframes,
  width
} from './src/themes'

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
      fontSize,
      fontFamily,
      width,
      height,
      borderRadius,
      keyframes,
      animation,
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')],
} satisfies Config;

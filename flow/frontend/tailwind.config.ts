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
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindScrollbarHide from 'tailwind-scrollbar-hide'

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.css",
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
  plugins: [tailwindcssAnimate, tailwindScrollbarHide],
} satisfies Config;

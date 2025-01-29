import type { Config } from 'tailwindcss'
import {
  animation,
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  height,
  keyframes,
  width,
} from './src/themes'
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindScrollbarHide from 'tailwind-scrollbar-hide'

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation,
      borderRadius,
      colors,
      fontFamily,
      fontSize,
      height,
      keyframes,
      width,
    },
  },
  plugins: [tailwindcssAnimate, tailwindScrollbarHide],
} satisfies Config

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/component-library/src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Font sizes
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
    'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl',
    'text-7xl', 'text-8xl', 'text-9xl',
    // Font weights
    'font-thin', 'font-extralight', 'font-light', 'font-normal',
    'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black',
    // Line heights
    'leading-none', 'leading-tight', 'leading-snug', 'leading-normal',
    'leading-relaxed', 'leading-loose',
    // Letter spacing
    'tracking-tighter', 'tracking-tight', 'tracking-normal',
    'tracking-wide', 'tracking-wider', 'tracking-widest',
    // Text alignment
    'text-left', 'text-center', 'text-right', 'text-justify',
    // Padding
    'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12',
    'p-16', 'p-20', 'p-24',
    'px-0', 'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8', 'px-10', 'px-12',
    'py-0', 'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-8', 'py-10', 'py-12',
    // Margin
    'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12', 'm-auto',
    'mx-auto', 'my-auto',
    // Border radius
    'rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg',
    'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

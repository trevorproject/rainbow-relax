/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'rr-',
  content: [
    './src/widget/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        '18': '4.5rem',
      },
      height: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}

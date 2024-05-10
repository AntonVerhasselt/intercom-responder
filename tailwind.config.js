/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}"
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["forest", "light", "dark", "nord"]
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
}


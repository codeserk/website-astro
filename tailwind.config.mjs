/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: { mono: ['var(--font-body)'] },
    screens: {
      sm: '640px',
      md: '850px',
      lg: '1024px',
      xl: '1300px',
    },
    extend: {},
  },
  plugins: [],
}

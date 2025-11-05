import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        'barber-client': '#B4654A',
        'barber-shop': '#156064',
        'barber-primary': '#DDDBCB',
        'barber-circle': '#D9D9D9',
        'barber-bg': '#000000',
      },
      fontSize: {
        'figma-title': ['2.5rem', '2.8125rem'], // 40px com 45px de leading
      },
    },
  },
  plugins: [],
}
export default config

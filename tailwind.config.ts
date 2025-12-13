import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E30613',
        'background-light': '#F1F7F8',
        'background-dark': '#1A1A1B',
        'surface-light': '#FFFFFF',
        'surface-dark': '#2D2D2D',
        'text-primary-light': '#111111',
        'text-primary-dark': '#F9F9F9',
        'text-secondary-light': '#555555',
        'text-secondary-dark': '#AAAAAA',
        'border-light': '#EAEAEA',
        'border-dark': '#3E3E3E',
        'accent': '#4A90E2',
      },
      fontFamily: {
        'sf-pro': ['var(--font-sf-pro)', 'SF Pro Display', 'sans-serif'],
        display: ['var(--font-sf-pro)', 'SF Pro Display', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
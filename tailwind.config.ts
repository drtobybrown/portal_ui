import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // UVic Brand Colors
        uvic: {
          blue: '#005493',
          'dark-blue': '#002754',
          gold: '#F5AA1C',
          red: '#C63527',
        },
        // Semantic aliases for easier use
        primary: {
          DEFAULT: '#005493',
          hover: '#004377',
          light: '#e6f0f7',
        },
        secondary: {
          DEFAULT: '#002754',
          hover: '#001d3d',
          light: '#e6eaf0',
        },
        accent: {
          DEFAULT: '#F5AA1C',
          hover: '#e09a0f',
          light: '#fef7e6',
        },
        destructive: {
          DEFAULT: '#C63527',
          hover: '#a82c21',
          light: '#fbeae8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}

export default config

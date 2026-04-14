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
        // SKAO Brand Primary Colours
        skao: {
          navy: '#070068',
          magenta: '#E70068',
          black: '#000000',
          // Science accent palette
          'nebula-teal': '#00B2A9',
          'pulsar-violet': '#6B3FA0',
          'quasar-gold': '#FFC72C',
          // Technology accent palette
          'steel': '#8A8D8F',
          'copper': '#B87333',
          'fiber-blue': '#0077C8',
          // Sites accent palette
          'outback-ochre': '#C4622D',
          'karoo-sage': '#7A9A65',
          'earth-brown': '#5C4033',
        },
        // Semantic aliases
        primary: {
          DEFAULT: '#070068',
          hover: '#05004F',
          light: '#EEEDF8',
          50: '#F0EFFA',
          100: '#D9D7F0',
          200: '#B3AFE1',
          600: '#050050',
          700: '#03003A',
          800: '#020028',
        },
        secondary: {
          DEFAULT: '#0A0A2E',
          hover: '#06061E',
          light: '#E8E8F0',
        },
        accent: {
          DEFAULT: '#E70068',
          hover: '#C20058',
          light: '#FDE6F0',
        },
        destructive: {
          DEFAULT: '#DC2626',
          hover: '#B91C1C',
          light: '#FEE2E2',
        },
        success: {
          DEFAULT: '#00B2A9',
          light: '#E6F9F8',
        },
        warning: {
          DEFAULT: '#FFC72C',
          light: '#FFF9E6',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'Verdana', 'system-ui', 'sans-serif'],
        mono: ['Noto Sans Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'glow-magenta': '0 0 20px rgba(231, 0, 104, 0.15)',
        'glow-navy': '0 0 20px rgba(7, 0, 104, 0.15)',
      },
      backgroundImage: {
        'skao-gradient': 'linear-gradient(135deg, #070068 0%, #E70068 100%)',
        'skao-gradient-subtle': 'linear-gradient(135deg, #070068 0%, #1a0a5e 50%, #3d0050 100%)',
      },
    },
  },
  plugins: [],
}

export default config

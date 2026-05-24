/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brutalist: {
          bg: '#FFFEF0',
          black: '#0A0A0A',
          yellow: '#FFE600',
          red: '#FF2D00',
          green: '#39FF14',
          gray: '#BDBDBD',
          code: '#111111',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'Space Mono', 'monospace'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        bold: ['Arial Black', 'sans-serif'],
      },
      borderWidth: {
        DEFAULT: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
      },
      borderColor: {
        DEFAULT: '#0A0A0A',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
};
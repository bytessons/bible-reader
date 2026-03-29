/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      colors: {
        cream: {
          50:  '#fdfaf4',
          100: '#faf4e6',
          200: '#f3e8cc',
          300: '#e8d5a8',
          400: '#d9bc7e',
        },
        ink: {
          900: '#1a1208',
          800: '#2c1f0e',
          700: '#3d2d14',
          600: '#5c4520',
          500: '#7a5c30',
        },
        olive: {
          300: '#9aab89',
          400: '#7d9169',
          500: '#6b7a5e',
          600: '#556249',
          700: '#404a37',
          800: '#2d3427',
        },
      },
    },
  },
  plugins: [],
}

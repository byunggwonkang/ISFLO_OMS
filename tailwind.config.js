/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./views/**/*.{js,vue,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      width: {
        '30': '7.5rem',
        '58': '14.5rem',
        '66': '17rem'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
        '11xl': '112rem',
        '12xl': '120rem',
        '13xl': '128rem',
        '14xl': '136rem',
      },
      maxheight: {
        '90': '18rem', // h-94 정의
      },
      height: {
        '90': '18rem', // h-94 정의
      },
      accentColor: {
        'isac-gray': 'rgba(51, 65, 85, 0.07)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}


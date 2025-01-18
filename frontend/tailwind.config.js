/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light': "#92E0FF",
        'extra-light': "#B5EAFF",
        'dark': "#38B7EA",
        'light-dark': "#2780A3",
        'extra-dark': "#002E41", 
      }
    },
  },
  plugins: [],
}


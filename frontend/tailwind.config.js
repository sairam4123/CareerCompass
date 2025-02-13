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
      },
      animationDelay: {
        '1': '0.6s',
        '2': '0.7s',
        '3': '0.8s',
        '4': '0.9s',
        '5': '1s',
        '6': '1.1s',
        '7': '1.2s',
        '8': '1.3s',
        '9': '1.4s',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'fade-out': 'fadeOut 1s ease-in-out',
        'pop-in': 'popIn 0.5s ease-in-out',
        'pop-out': 'popOut 1s ease-in-out',
        'flip-in': 'flipIn 1s ease-in-out',
        'fade-in-left': 'fadeInLeft 0.25 ease-in-out',
      },
    },
  },
  plugins: [],
}


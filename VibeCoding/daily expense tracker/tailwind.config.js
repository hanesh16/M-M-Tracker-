/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mocha: '#c08b5c',
        milky: '#f7f2ea',
        cream: '#fdf8f1',
        pastelBlue: '#d8e9f3'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.08)'
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(8deg)' },
          '100%': { transform: 'rotate(0deg)' }
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.2)' }
        },
        bubble: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '20%': { opacity: 1, transform: 'translateY(0)' },
          '80%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-6px)' }
        }
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        wave: 'wave 2.4s ease-in-out infinite',
        blink: 'blink 3.8s ease-in-out infinite',
        bubble: 'bubble 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

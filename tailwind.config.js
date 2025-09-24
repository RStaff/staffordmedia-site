/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        smc: {
          navy: "#0A0F2A",
          cream: "#FFE169",
          text: "#E6EAF2"
        }
      },
      minHeight: {
        hero: "80vh"
      }
    }
  },
  plugins: []
};

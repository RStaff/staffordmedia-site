/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:  "#0B2545",
          purple:"#8E24AA",
          gray:  "#B4BBC3",
          gold:  "#F3C34A",
          abBlue:"#1976D2",
          abTeal:"#16A085",
          abDark:"#0D1D2A",
          abBg:  "#FAF7F2"
        }
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.25rem"
      },
      boxShadow: {
        card: "0 6px 24px rgba(0,0,0,0.12)"
      }
    },
  },
  plugins: [],
};

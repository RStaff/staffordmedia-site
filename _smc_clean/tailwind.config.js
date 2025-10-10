/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx,mdx}","./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "var(--brand-bg)",
          fg: "var(--brand-fg)",
          card: "var(--brand-card)",
          border: "var(--brand-border)",
          accent: "var(--brand-accent)",
          gray: "var(--brand-gray)"
        }
      },
      boxShadow: { card: "0 6px 24px rgba(0,0,0,0.12)" },
      borderRadius: { xl: "1rem" }
    }
  },
  plugins: []
};

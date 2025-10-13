/** Official Tailwind + PostCSS pipeline (Lightning CSS disabled) */
import tailwind from "@tailwindcss/postcss";
export default {
  plugins: [tailwind(), require("autoprefixer")],
};

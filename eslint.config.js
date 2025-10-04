import tseslint from "typescript-eslint";
import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";

export default [
  // Ignore build/dependency directories
  { ignores: ["node_modules/**", ".next/**", "dist/**"] },

  // Core rules for TypeScript + Next.js
  ...tseslint.configs.recommended,

  {
    plugins: {
      "@next/next": next,
      import: pluginImport,
    },
    rules: {
      ...next.configs["core-web-vitals"].rules, // ✅ adds Next.js lint rules
      "import/order": ["warn", { "alphabetize": { order: "asc" } }],
      "no-unused-vars": "warn",
    },
    languageOptions: {
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
  },

  // Disable stylistic conflicts
  prettier,
];

// /* next-eslint-detector */ export const __next_eslint_plugin = true;

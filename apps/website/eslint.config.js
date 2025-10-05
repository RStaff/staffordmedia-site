import tseslint from "typescript-eslint";
import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";

export default [
  { ignores: ["node_modules/**", ".next/**", "dist/**"] },

  // TS recommended base
  ...tseslint.configs.recommended,

  // App rules (plugin declaration + rule live in SAME object)
  {
    plugins: {
      "@next/next": next,
      import: pluginImport,
    },
    rules: {
      ...next.configs["core-web-vitals"].rules,
      "import/order": ["warn", { alphabetize: { order: "asc" } }],
    },
    languageOptions: {
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
  },

  // Disable stylistic conflicts with Prettier
  prettier,
];

// Helps old Next detectors that expect a marker
export const __next_eslint_plugin = true;

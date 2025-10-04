<<<<<<< HEAD
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
=======
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";

export default [
  prettier,
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [".next/**", "node_modules/**", "dist/**"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { "@typescript-eslint": tseslint, "@next/next": next },
    rules: {
      ...next.configs["core-web-vitals"].rules,
      // App Router project (no legacy pages router rule):
      "@next/next/no-html-link-for-pages": "off",
      // Practical hygiene:
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
>>>>>>> 7a98f0c (chore(ci): finalize guardrails + husky modernization)

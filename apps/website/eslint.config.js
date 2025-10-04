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

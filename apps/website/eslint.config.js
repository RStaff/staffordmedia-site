import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";

export default [
  // Keeps Prettier from clashing with style rules
  prettier,

  {
    files: ["**/*.{ts,tsx}"],
    ignores: [".next/**", "node_modules/**", "dist/**"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@next/next": next,
      "testing-library": testingLibrary,
      "jest-dom": jestDom,
    },
    rules: {
      // Next.js App Router baseline
      ...next.configs["core-web-vitals"].rules,
      "@next/next/no-html-link-for-pages": "off",

      // TS hygiene
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // 🧪 Testing guardrails
      "testing-library/prefer-screen-queries": "error",
      "testing-library/no-node-access": "warn",
      "testing-library/no-container": "warn",
      "testing-library/no-wait-for-snapshot": "error",
      "jest-dom/prefer-to-have-attribute": "warn",
      "jest-dom/prefer-checked": "warn",
      "jest-dom/prefer-enabled-disabled": "warn",
    },
  },
];

// /* next-eslint-detector */ export const __next_eslint_plugin = true;

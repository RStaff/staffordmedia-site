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
<<<<<<< HEAD
>>>>>>> 7a98f0c (chore(ci): finalize guardrails + husky modernization)
=======

// /* next-eslint-detector */ export const __next_eslint_plugin = true;
>>>>>>> 2265959 (fix(eslint): add Next detector export to satisfy Next.js plugin check)

<<<<<<< HEAD
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
=======
import tseslint from "typescript-eslint";
>>>>>>> b2ea271 (chore(ci): finalize doctor verification and guardrail health)
import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";

export default [
  // Ignore generated/deps
  { ignores: ["node_modules/**", ".next/**", "dist/**"] },

  // Typescript-eslint recommended
  ...tseslint.configs.recommended,

  // Next + import rules
  {
    plugins: { "@next/next": next, import: pluginImport },
    rules: {
      // Next core-web-vitals rules
      ...next.configs["core-web-vitals"].rules,

      // Gentle import ordering; we will auto-fix it before strict lint
      "import/order": ["warn", { alphabetize: { order: "asc", caseInsensitive: true }, "newlines-between": "always" }],
    },
    languageOptions: {
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
  },
<<<<<<< HEAD
];
<<<<<<< HEAD
>>>>>>> 7a98f0c (chore(ci): finalize guardrails + husky modernization)
=======

// /* next-eslint-detector */ export const __next_eslint_plugin = true;
>>>>>>> 2265959 (fix(eslint): add Next detector export to satisfy Next.js plugin check)
=======

  // Disable stylistic conflicts
  prettier,
];
>>>>>>> b2ea271 (chore(ci): finalize doctor verification and guardrail health)

<<<<<<< HEAD
<<<<<<< HEAD
import tseslint from "typescript-eslint";
import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";

export default [
<<<<<<< HEAD
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
=======
>>>>>>> b48eb19 (chore: ESLint stable + test/build green; prepare launch)
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
<<<<<<< HEAD
];
<<<<<<< HEAD
>>>>>>> 7a98f0c (chore(ci): finalize guardrails + husky modernization)
=======

// /* next-eslint-detector */ export const __next_eslint_plugin = true;
>>>>>>> 2265959 (fix(eslint): add Next detector export to satisfy Next.js plugin check)
=======

  // Disable stylistic conflicts with Prettier
  prettier,
];
<<<<<<< HEAD
>>>>>>> b2ea271 (chore(ci): finalize doctor verification and guardrail health)
=======

// Helps old Next detectors that expect a marker
export const __next_eslint_plugin = true;
>>>>>>> b48eb19 (chore: ESLint stable + test/build green; prepare launch)

import tseslint from "typescript-eslint";
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

  // Disable stylistic conflicts
  prettier,
];

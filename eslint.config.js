import js from "@eslint/js";
const tsParser = (await import("@typescript-eslint/parser")).default;

const browserGlobals = {
  window: "readonly",
  document: "readonly",
  localStorage: "readonly",
  FormData: "readonly",
  SVGSVGElement: "readonly",
  ReadableStream: "readonly",
  TransformStream: "readonly",
  Response: "readonly",
  console: "readonly",
};

const nodeGlobals = {
  process: "readonly",
  module: "readonly",
  require: "readonly",
  Buffer: "readonly",
};

const testGlobals = {
  test: "readonly",
  expect: "readonly",
};

export default [
  { ignores: ["**/.next/**","**/dist/**","**/build/**","**/coverage/**","**/node_modules/**","**/*.d.ts"] },
  js.configs.recommended,

  // TS/TSX app code
  {
    files: ["apps/website/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: { ...browserGlobals, ...nodeGlobals, React: "readonly" }
    },
    rules: {
      "no-undef": "off",
      "no-empty": ["warn", { "allowEmptyCatch": true }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }]
    }
  },

  // JS/JSX app code
  {
    files: ["apps/website/**/*.{js,jsx}"],
    languageOptions: {
      globals: { ...browserGlobals, ...nodeGlobals, React: "readonly" }
    },
    rules: {
      "no-undef": "off",
      "no-empty": ["warn", { "allowEmptyCatch": true }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }]
    }
  },

  // Tests
  {
    files: ["apps/website/tests/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: { ...browserGlobals, ...nodeGlobals, ...testGlobals }
    },
    rules: { "no-undef": "off" }
  }
];
